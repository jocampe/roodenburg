type Environment = Record<string, string | undefined>;

const value = (environment: Environment, name: string) => environment[name]?.trim() || "";

const booleanValue = (environment: Environment, name: string, fallback = false) => {
  const configured = value(environment, name).toLowerCase();
  if (!configured) return fallback;
  if (["1", "true", "yes", "on"].includes(configured)) return true;
  if (["0", "false", "no", "off"].includes(configured)) return false;
  throw new Error(`${name} must be true or false.`);
};

const portValue = (environment: Environment, name: string, fallback: number) => {
  const configured = value(environment, name);
  if (!configured) return fallback;
  const port = Number(configured);
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error(`${name} must be an integer between 1 and 65535.`);
  }
  return port;
};

const emailValue = (environment: Environment, name: string, fallback = "") => {
  const configured = value(environment, name) || fallback;
  if (configured && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(configured)) {
    throw new Error(`${name} must be a valid email address.`);
  }
  return configured;
};

const recipients = (environment: Environment, name: string) => {
  const configured = value(environment, name);
  if (!configured) return [];
  return configured.split(",").map((address) => address.trim()).filter((address) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
      throw new Error(`${name} contains an invalid email address.`);
    }
    return true;
  });
};

const integerValue = (
  environment: Environment,
  name: string,
  fallback: number,
  minimum: number,
  maximum: number,
) => {
  const configured = value(environment, name);
  if (!configured) return fallback;
  const parsed = Number(configured);
  if (!Number.isInteger(parsed) || parsed < minimum || parsed > maximum) {
    throw new Error(`${name} must be an integer between ${minimum} and ${maximum}.`);
  }
  return parsed;
};

export type S3Configuration = {
  accessKeyId?: string;
  bucket: string;
  enabled: boolean;
  endpoint?: string;
  forcePathStyle: boolean;
  region: string;
  required: boolean;
  secretAccessKey?: string;
};

export const resolveS3Configuration = (environment: Environment = process.env): S3Configuration => {
  const required = booleanValue(environment, "S3_REQUIRED");
  const bucket = value(environment, "S3_BUCKET");
  const endpoint = value(environment, "S3_ENDPOINT");
  const accessKeyId = value(environment, "S3_ACCESS_KEY_ID");
  const secretAccessKey = value(environment, "S3_SECRET_ACCESS_KEY");

  if (!bucket) {
    if (required) throw new Error("S3_BUCKET is required when S3_REQUIRED is true.");
    if (endpoint || accessKeyId || secretAccessKey) {
      throw new Error("S3_BUCKET must be set when other S3 settings are configured.");
    }
    return {
      bucket: "",
      enabled: false,
      forcePathStyle: false,
      region: value(environment, "S3_REGION") || "eu-west-1",
      required,
    };
  }

  if (Boolean(accessKeyId) !== Boolean(secretAccessKey)) {
    throw new Error("S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY must be configured together.");
  }

  if (endpoint) {
    const parsed = new URL(endpoint);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error("S3_ENDPOINT must use http or https.");
    }
  }

  return {
    accessKeyId: accessKeyId || undefined,
    bucket,
    enabled: true,
    endpoint: endpoint || undefined,
    forcePathStyle: booleanValue(environment, "S3_FORCE_PATH_STYLE"),
    region: value(environment, "S3_REGION") || "eu-west-1",
    required,
    secretAccessKey: secretAccessKey || undefined,
  };
};

export type SMTPConfiguration = {
  contactRecipients: string[];
  enabled: boolean;
  fromAddress: string;
  fromName: string;
  host: string;
  memberRecipients: string[];
  overrideRecipientAddress?: string;
  password?: string;
  port: number;
  replyTo?: string;
  required: boolean;
  secure: boolean;
  skipVerify: boolean;
  user?: string;
};

export const resolveSMTPConfiguration = (environment: Environment = process.env): SMTPConfiguration => {
  const required = booleanValue(environment, "SMTP_REQUIRED");
  const host = value(environment, "SMTP_HOST");
  const user = value(environment, "SMTP_USER");
  const password = value(environment, "SMTP_PASSWORD");
  const contactRecipients = recipients(environment, "CONTACT_NOTIFICATION_TO");
  const memberRecipients = recipients(environment, "MEMBER_NOTIFICATION_TO");

  if (!host) {
    if (required) throw new Error("SMTP_HOST is required when SMTP_REQUIRED is true.");
    if (user || password || contactRecipients.length || memberRecipients.length) {
      throw new Error("SMTP_HOST must be set when SMTP credentials or notification recipients are configured.");
    }
  }

  if (Boolean(user) !== Boolean(password)) {
    throw new Error("SMTP_USER and SMTP_PASSWORD must be configured together.");
  }

  return {
    contactRecipients,
    enabled: Boolean(host),
    fromAddress: emailValue(environment, "SMTP_FROM", "website@lvroodenburg.nl"),
    fromName: value(environment, "SMTP_FROM_NAME") || "L.V. Roodenburg",
    host,
    memberRecipients,
    overrideRecipientAddress: emailValue(environment, "SMTP_OVERRIDE_RECIPIENT") || undefined,
    password: password || undefined,
    port: portValue(environment, "SMTP_PORT", 587),
    replyTo: emailValue(environment, "SMTP_REPLY_TO") || undefined,
    required,
    secure: booleanValue(environment, "SMTP_SECURE"),
    skipVerify: booleanValue(environment, "SMTP_SKIP_VERIFY"),
    user: user || undefined,
  };
};

const proxyIPHeaders = ["cf-connecting-ip", "x-forwarded-for", "x-real-ip"] as const;

export type SecurityConfiguration = {
  edgeRateLimitRequired: boolean;
  edgeRateLimitVerified: boolean;
  proxyIPHeader: typeof proxyIPHeaders[number];
  trustProxyHeaders: boolean;
};

export const resolveSecurityConfiguration = (environment: Environment = process.env): SecurityConfiguration => {
  const proxyIPHeader = value(environment, "PROXY_IP_HEADER").toLowerCase() || "x-forwarded-for";
  if (!proxyIPHeaders.includes(proxyIPHeader as typeof proxyIPHeaders[number])) {
    throw new Error(`PROXY_IP_HEADER must be one of: ${proxyIPHeaders.join(", ")}.`);
  }
  const edgeRateLimitRequired = booleanValue(environment, "EDGE_RATE_LIMIT_REQUIRED");
  const edgeRateLimitVerified = booleanValue(environment, "EDGE_RATE_LIMIT_VERIFIED");
  if (edgeRateLimitRequired && !edgeRateLimitVerified) {
    throw new Error("EDGE_RATE_LIMIT_VERIFIED must be true when EDGE_RATE_LIMIT_REQUIRED is true.");
  }
  return {
    edgeRateLimitRequired,
    edgeRateLimitVerified,
    proxyIPHeader: proxyIPHeader as SecurityConfiguration["proxyIPHeader"],
    trustProxyHeaders: booleanValue(environment, "TRUST_PROXY_HEADERS"),
  };
};

export type ContactRetentionConfiguration = {
  days: number;
  purgeConfirmed: boolean;
};

export const resolveContactRetentionConfiguration = (environment: Environment = process.env): ContactRetentionConfiguration => ({
  days: integerValue(environment, "CONTACT_RETENTION_DAYS", 180, 30, 365),
  purgeConfirmed: booleanValue(environment, "RETENTION_PURGE_CONFIRM"),
});

export const operationalConfiguration = (environment: Environment = process.env) => {
  const s3 = resolveS3Configuration(environment);
  const smtp = resolveSMTPConfiguration(environment);
  const security = resolveSecurityConfiguration(environment);
  const retention = resolveContactRetentionConfiguration(environment);
  return {
    media: {
      mode: s3.enabled ? "s3" as const : "local" as const,
      required: s3.required,
    },
    email: {
      mode: smtp.enabled ? "smtp" as const : "disabled" as const,
      required: smtp.required,
      contactNotifications: smtp.contactRecipients.length > 0,
      memberNotifications: smtp.memberRecipients.length > 0,
    },
    security: {
      trustedProxy: security.trustProxyHeaders,
      edgeRateLimit: security.edgeRateLimitVerified ? "verified" as const : "not-verified" as const,
    },
    privacy: {
      contactRetentionDays: retention.days,
      purgeMode: retention.purgeConfirmed ? "enabled" as const : "dry-run" as const,
    },
  };
};

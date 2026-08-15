import { postgresAdapter } from "@payloadcms/db-postgres";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildConfig } from "payload";
import sharp from "sharp";
import { collections, Users } from "./collections";
import { globals } from "./globals";
import { resolveS3Configuration, resolveSMTPConfiguration } from "./infrastructure/runtime-config";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
const s3 = resolveS3Configuration();
const smtp = resolveSMTPConfiguration();

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: dirname },
    components: {
      beforeDashboard: ["/components/admin/ClubDashboard#ClubDashboard"],
    },
    meta: {
      titleSuffix: " — L.V. Roodenburg",
    },
  },
  collections,
  globals,
  email: smtp.enabled
    ? nodemailerAdapter({
        defaultFromAddress: smtp.fromAddress,
        defaultFromName: smtp.fromName,
        overrideRecipientAddress: smtp.overrideRecipientAddress,
        skipVerify: smtp.skipVerify,
        transportOptions: {
          host: smtp.host,
          port: smtp.port,
          secure: smtp.secure,
          ...(smtp.user && smtp.password
            ? { auth: { user: smtp.user, pass: smtp.password } }
            : {}),
        },
      })
    : undefined,
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || "" },
    push: process.env.NODE_ENV !== "production",
    migrationDir: path.resolve(dirname, "migrations"),
  }),
  editor: lexicalEditor(),
  localization: {
    locales: [
      { code: "nl", label: "Nederlands" },
      { code: "en", label: "English" },
    ],
    defaultLocale: "nl",
    fallback: true,
  },
  plugins: [
    s3Storage({
      enabled: s3.enabled,
      collections: { media: { prefix: "media" } },
      bucket: s3.bucket || "local-development",
      disableLocalStorage: s3.enabled,
      config: {
        endpoint: s3.endpoint,
        region: s3.region,
        forcePathStyle: s3.forcePathStyle,
        ...(s3.accessKeyId && s3.secretAccessKey
          ? { credentials: { accessKeyId: s3.accessKeyId, secretAccessKey: s3.secretAccessKey } }
          : {}),
      },
    }),
  ],
  secret: process.env.PAYLOAD_SECRET || "",
  serverURL,
  cors: [serverURL],
  csrf: [serverURL],
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
});

import config from "@payload-config";
import { getPayload } from "payload";
import { resolveContactRetentionConfiguration } from "../infrastructure/runtime-config";

const retention = resolveContactRetentionConfiguration();
const payload = await getPayload({ config });
const cutoff = new Date().toISOString();
const where = { deleteAfter: { less_than_equal: cutoff } } as const;

const expired = await payload.find({
  collection: "contact-submissions",
  depth: 0,
  limit: 100,
  overrideAccess: true,
  where,
});

if (!retention.purgeConfirmed) {
  payload.logger.info({
    cutoff,
    dryRun: true,
    event: "contact.retention.purge",
    expired: expired.totalDocs,
  }, "Contact retention purge dry run complete");
  process.exit(0);
}

let deleted = 0;
let batch = expired;
while (batch.docs.length > 0) {
  for (const document of batch.docs) {
    await payload.delete({
      collection: "contact-submissions",
      id: document.id,
      overrideAccess: true,
    });
    deleted += 1;
  }
  batch = await payload.find({
    collection: "contact-submissions",
    depth: 0,
    limit: 100,
    overrideAccess: true,
    where,
  });
}

payload.logger.info({
  cutoff,
  deleted,
  dryRun: false,
  event: "contact.retention.purge",
}, "Contact retention purge complete");
process.exit(0);

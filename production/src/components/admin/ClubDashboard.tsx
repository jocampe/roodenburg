import config from "@payload-config";
import Link from "next/link";
import { getPayload } from "payload";
import { operationalConfiguration } from "../../infrastructure/runtime-config";

type Stat = {
  href: string;
  label: string;
  value: number;
};

const total = async (
  payload: Awaited<ReturnType<typeof getPayload>>,
  collection: Parameters<typeof payload.count>[0]["collection"],
  where?: Parameters<typeof payload.count>[0]["where"],
) => (await payload.count({ collection, where, overrideAccess: true })).totalDocs;

const loadDashboardData = async () => {
  try {
    const payload = await getPayload({ config });
    const footballState = await payload.findGlobal({
      slug: "football-sync-state" as never,
      overrideAccess: true,
    }) as { currentSnapshotId?: string | null; lastSuccessfulAt?: string | null; matchCount?: number | null; teamCount?: number | null };
    const [staff, members, activeMembers, publishedNews, draftNews, media, newContacts] = await Promise.all([
      total(payload, "users"),
      total(payload, "members"),
      total(payload, "members", { status: { equals: "active" } }),
      total(payload, "news-posts", { _status: { equals: "published" } }),
      total(payload, "news-posts", { _status: { equals: "draft" } }),
      total(payload, "media"),
      total(payload, "contact-submissions", { status: { equals: "new" } }),
    ]);

    const stats: Stat[] = [
      { label: "Published stories", value: publishedNews, href: "/admin/collections/news-posts?where[_status][equals]=published" },
      { label: "Draft stories", value: draftNews, href: "/admin/collections/news-posts?where[_status][equals]=draft" },
      { label: "Media assets", value: media, href: "/admin/collections/media" },
      { label: "New contacts", value: newContacts, href: "/admin/collections/contact-submissions?where[status][equals]=new" },
      { label: "CMS staff", value: staff, href: "/admin/collections/users" },
      { label: "Active members", value: activeMembers, href: "/admin/collections/members?where[status][equals]=active" },
      { label: "Synced teams", value: Number(footballState.teamCount || 0), href: "/admin/collections/football-teams" },
    ];

    const analyticsURL = process.env.ANALYTICS_DASHBOARD_URL;
    const analyticsProvider = process.env.ANALYTICS_PROVIDER || "Not connected";
    const operations = operationalConfiguration();

    return { analyticsProvider, analyticsURL, footballState, members, operations, staff, stats };
  } catch {
    return null;
  }
};

export async function ClubDashboard() {
  const dashboard = await loadDashboardData();
  if (!dashboard) {
    return (
      <section className="club-admin-dashboard club-admin-dashboard--unavailable">
        <h1>Club dashboard</h1>
        <p>Operational statistics will appear when the database connection is available.</p>
      </section>
    );
  }

  const { analyticsProvider, analyticsURL, footballState, members, operations, staff, stats } = dashboard;
  return (
    <section className="club-admin-dashboard">
      <header className="club-admin-dashboard__intro">
        <div>
          <span>L.V. Roodenburg administration</span>
          <h1>Club dashboard</h1>
          <p>Content, people and operational workload in one secure starting point.</p>
        </div>
        <Link href="/nl" target="_blank" rel="noreferrer">Open website ↗</Link>
      </header>

      <div className="club-admin-dashboard__stats">
        {stats.map((stat) => (
          <Link href={stat.href} key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </Link>
        ))}
      </div>

      <div className="club-admin-dashboard__panels">
        <article>
          <span className="club-admin-dashboard__eyebrow">People</span>
          <h2>Accounts stay separated</h2>
          <p>{staff} CMS staff accounts can edit the site. {members} member accounts belong to the website portal and cannot enter the CMS.</p>
          <div className="club-admin-dashboard__actions">
            <Link href="/admin/collections/users">Manage CMS staff</Link>
            <Link href="/admin/collections/members">Manage members</Link>
          </div>
        </article>

        <article>
          <span className="club-admin-dashboard__eyebrow">Analytics</span>
          <h2>{analyticsProvider}</h2>
          <p>Traffic and engagement analytics remain in a dedicated privacy-controlled service instead of the editorial database.</p>
          {analyticsURL
            ? <a className="club-admin-dashboard__external" href={analyticsURL} target="_blank" rel="noreferrer">Open analytics dashboard ↗</a>
            : <span className="club-admin-dashboard__pending">Provider configuration pending</span>}
        </article>

        <article>
          <span className="club-admin-dashboard__eyebrow">Football data</span>
          <h2>{footballState.currentSnapshotId ? "Sportlink snapshot active" : "Sportlink not connected"}</h2>
          <p>{footballState.currentSnapshotId
            ? `${footballState.teamCount || 0} teams and ${footballState.matchCount || 0} matches are published from the last successful snapshot.`
            : "The approved sample data remains public until the first validated synchronization succeeds."}</p>
          {footballState.lastSuccessfulAt
            ? <span className="club-admin-dashboard__pending">Last success: {new Date(footballState.lastSuccessfulAt).toLocaleString("nl-NL")}</span>
            : <Link className="club-admin-dashboard__external" href="/admin/collections/football-sync-runs">Open sync history →</Link>}
        </article>

        <article>
          <span className="club-admin-dashboard__eyebrow">Infrastructure</span>
          <h2>{operations.media.mode === "s3" ? "Durable media active" : "Local media storage"}</h2>
          <p>Email delivery is {operations.email.mode === "smtp" ? "connected through SMTP" : "not connected"}. Contact and member notification destinations are configured independently.</p>
          <span className="club-admin-dashboard__pending">
            Contact: {operations.email.contactNotifications ? "ready" : "pending"} · Members: {operations.email.memberNotifications ? "ready" : "pending"}
          </span>
          <span className="club-admin-dashboard__pending">
            Proxy: {operations.security.trustedProxy ? "trusted" : "direct"} · Edge limit: {operations.security.edgeRateLimit} · Retention: {operations.privacy.contactRetentionDays} days ({operations.privacy.purgeMode})
          </span>
        </article>
      </div>
    </section>
  );
}

import { draftMode } from "next/headers";

export async function PreviewBanner() {
  const preview = await draftMode();
  if (!preview.isEnabled) return null;

  return (
    <aside className="preview-banner" role="status">
      <strong>CMS preview</strong>
      <span>Draft content is visible only to you.</span>
      <a href="/exit-preview">Exit preview</a>
    </aside>
  );
}

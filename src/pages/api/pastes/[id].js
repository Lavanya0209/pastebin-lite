import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;

  // 👉 LOCAL DEVELOPMENT SAFETY
  // If KV is not available locally, behave as "not found"
  if (!process.env.KV_URL) {
    return res.status(404).json({ error: "Not found" });
  }

  const paste = await kv.get(`paste:${id}`);
  if (!paste) {
    return res.status(404).json({ error: "Not found" });
  }

  const now =
    process.env.TEST_MODE === "1" && req.headers["x-test-now-ms"]
      ? Number(req.headers["x-test-now-ms"])
      : Date.now();

  // TTL check
  if (paste.expires_at && now >= paste.expires_at) {
    return res.status(404).json({ error: "Not found" });
  }

  // View limit check
  if (paste.max_views !== null && paste.views >= paste.max_views) {
    return res.status(404).json({ error: "Not found" });
  }

  // Count this successful fetch as a view
  paste.views += 1;
  await kv.set(`paste:${id}`, paste);

  res.status(200).json({
    content: paste.content,
    remaining_views:
      paste.max_views !== null ? paste.max_views - paste.views : null,
    expires_at: paste.expires_at
      ? new Date(paste.expires_at).toISOString()
      : null,
  });
}
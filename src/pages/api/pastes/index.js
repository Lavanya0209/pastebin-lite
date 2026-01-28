import { kv } from "@vercel/kv";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { content, ttl_seconds, max_views } = req.body;

  // Validate content
  if (!content || typeof content !== "string" || content.trim() === "") {
    return res.status(400).json({ error: "Invalid content" });
  }

  // Validate ttl_seconds if provided
  if (ttl_seconds !== undefined) {
    if (!Number.isInteger(ttl_seconds) || ttl_seconds < 1) {
      return res.status(400).json({ error: "Invalid ttl_seconds" });
    }
  }

  // Validate max_views if provided
  if (max_views !== undefined) {
    if (!Number.isInteger(max_views) || max_views < 1) {
      return res.status(400).json({ error: "Invalid max_views" });
    }
  }

  const id = uuidv4();
  const now = Date.now();

  const paste = {
    content,
    created_at: now,
    expires_at: ttl_seconds ? now + ttl_seconds * 1000 : null,
    max_views: max_views ?? null,
    views: 0,
  };

  await kv.set(`paste:${id}`, paste);

  res.status(200).json({
    id,
    url: `${req.headers.origin}/p/${id}`,
  });
}
import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  // Local development: KV may not be available
  if (!process.env.KV_URL) {
    return res.status(200).json({ ok: true });
  }

  try {
    await kv.ping();
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false });
  }
}
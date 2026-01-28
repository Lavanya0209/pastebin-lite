import { kv } from "@vercel/kv";
import { nanoid } from "nanoid";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let body = req.body;

  // ✅ FIX: handle string body (Vercel behavior)
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: "Invalid JSON" });
    }
  }

  const text = body?.text;

  if (typeof text !== "string" || text.trim().length === 0) {
    return res.status(400).json({ error: "Invalid content" });
  }

  const id = nanoid(8);

  await kv.set(`paste:${id}`, text);

  return res.status(201).json({ id });
}
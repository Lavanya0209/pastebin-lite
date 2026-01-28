import { kv } from "@vercel/kv";

export async function getServerSideProps({ params, req }) {
  const { id } = params;

  // 👉 LOCAL DEVELOPMENT SAFETY
  // If KV is not available locally, behave as "not found"
  if (!process.env.KV_URL) {
    return { notFound: true };
  }

  const paste = await kv.get(`paste:${id}`);
  if (!paste) {
    return { notFound: true };
  }

  const now =
    process.env.TEST_MODE === "1" && req.headers["x-test-now-ms"]
      ? Number(req.headers["x-test-now-ms"])
      : Date.now();

  // TTL check
  if (paste.expires_at && now >= paste.expires_at) {
    return { notFound: true };
  }

  // View limit check
  if (paste.max_views !== null && paste.views >= paste.max_views) {
    return { notFound: true };
  }

  return {
    props: {
      content: paste.content,
    },
  };
}

export default function PastePage({ content }) {
  // Escape HTML to prevent script execution
  const safeContent = content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return (
    <pre
      style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
      dangerouslySetInnerHTML={{ __html: safeContent }}
    />
  );
}
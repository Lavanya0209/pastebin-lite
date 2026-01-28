export default function Home() {
  return (
    <main style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>Pastebin Lite</h1>
      <p>A minimal pastebin-like service built with Next.js.</p>

      <h3>Available endpoints</h3>
      <ul>
        <li>POST /api/pastes</li>
        <li>GET /api/pastes/:id</li>
        <li>GET /p/:id</li>
      </ul>
    </main>
  );
}
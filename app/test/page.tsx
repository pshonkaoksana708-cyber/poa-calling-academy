export default function TestPage() {
  return (
    <main style={{ fontFamily: "Arial, sans-serif", padding: 32 }}>
      <h1>Production image test</h1>
      <section style={{ display: "grid", gap: 24, maxWidth: 960 }}>
        <article>
          <h2>Large image</h2>
          <p>/images/author/author-01.png — 1024 x 1536 px, 1 868 953 bytes</p>
          <img
            alt="Author test"
            src="/images/author/author-01.png"
            style={{ display: "block", height: "auto", maxWidth: 360, width: "100%" }}
          />
        </article>

        <article>
          <h2>Small image</h2>
          <p>/images/logo/poa-calling-logo.svg — 1200 x 1400 viewBox, 2 492 bytes</p>
          <img
            alt="Logo test"
            src="/images/logo/poa-calling-logo.svg"
            style={{ display: "block", height: "auto", maxWidth: 120, width: "100%" }}
          />
        </article>
      </section>
    </main>
  );
}

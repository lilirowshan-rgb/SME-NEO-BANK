export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="page">
      <h1 className="page-title">{title}</h1>
      <section className="card">
        <p className="muted">این صفحه هنوز پیاده‌سازی نشده است.</p>
      </section>
    </div>
  );
}

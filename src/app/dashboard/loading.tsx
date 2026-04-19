export default function DashboardLoading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <section className="h-48 animate-pulse rounded-3xl border border-earth-200 bg-white/80" />
      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="h-24 animate-pulse rounded-2xl border border-earth-200 bg-white" />
        <div className="h-24 animate-pulse rounded-2xl border border-earth-200 bg-white" />
        <div className="h-24 animate-pulse rounded-2xl border border-earth-200 bg-white" />
        <div className="h-24 animate-pulse rounded-2xl border border-earth-200 bg-white" />
      </section>
    </main>
  );
}

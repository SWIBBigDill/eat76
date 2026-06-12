export default function Loading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-eat-blue border-t-transparent" />
        <p className="mt-4 text-sm text-eat-muted">Loading…</p>
      </div>
    </div>
  );
}

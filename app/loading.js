export default function Loading() {
  return (
    <div className="px-4 md:px-8 lg:px-12 py-8 animate-pulse">
      <div className="h-10 w-56 bg-orange-200 rounded mb-8" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="bg-white rounded-md border border-orange-100 p-4 space-y-4 shadow-sm">
            <div className="h-40 bg-orange-100 rounded" />
            <div className="h-4 bg-orange-100 rounded w-11/12" />
            <div className="h-4 bg-orange-100 rounded w-8/12" />
            <div className="h-3 bg-orange-100 rounded w-5/12" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DataUpload() {
  return (
    <div className="max-w-xl">
      <h1 className="font-serif text-2xl">Data Upload</h1>
      <p className="mt-2 text-foreground/80">Authenticate to upload CSV/GeoJSON. We’ll validate the schema, scan for duplicates, and queue a background job.</p>
      <div className="mt-4 rounded-md border bg-card p-4 text-sm">
        <p className="text-foreground/70">Thanks — your dataset is queued. A curator will review it shortly.</p>
      </div>
    </div>
  );
}

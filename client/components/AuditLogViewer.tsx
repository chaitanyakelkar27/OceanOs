type AuditLog = { id: string; entity: string; entity_id: string; action: string; actor_id: string; note?: string; created_at: string };

export function AuditLogViewer({ logs }: { logs: AuditLog[] }) {
  if (!logs?.length) {
    return <div className="text-sm text-foreground/60">No audit entries yet.</div>;
  }
  return (
    <ol className="space-y-2">
      {logs.map((l) => (
        <li key={l.id} className="rounded-md border bg-card p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{l.action}</span>
            <span className="text-foreground/60">{new Date(l.created_at).toLocaleString()}</span>
          </div>
          <div className="text-sm text-foreground/80">
            {l.entity} ({l.entity_id}) • by {l.actor_id}
          </div>
          {l.note ? <div className="mt-1 text-sm text-foreground/70">“{l.note}”</div> : null}
        </li>
      ))}
    </ol>
  );
}

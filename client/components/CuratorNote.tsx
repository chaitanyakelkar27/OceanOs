import { ReactNode } from "react";

export function CuratorNote({ children, author }: { children: ReactNode; author: string }) {
  return (
    <div className="rounded-md border-l-4 border-accent bg-secondary/60 p-4">
      <div className="text-sm text-foreground/70">Curator note by {author}</div>
      <div className="mt-1 font-serif text-[1.05rem] leading-relaxed">{children}</div>
    </div>
  );
}

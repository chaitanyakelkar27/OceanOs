export function PhotographerAttribution({ name, license, href }: { name: string; license?: string; href?: string }) {
  return (
    <p className="text-xs text-foreground/60">
      Photo by {href ? (
        <a href={href} target="_blank" rel="noreferrer" className="underline underline-offset-2">
          {name}
        </a>
      ) : (
        name
      )}
      {license ? ` • ${license}` : null}
    </p>
  );
}

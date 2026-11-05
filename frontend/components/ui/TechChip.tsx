import { BrandIcon } from './BrandIcon';

export function TechChip({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 glass-chip rounded-full px-2.5 py-1 font-mono text-[0.7rem] text-fg/80">
      <BrandIcon name={name} className="size-3.5" />
      {name}
    </span>
  );
}

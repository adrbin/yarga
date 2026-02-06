import type { ButtonHTMLAttributes } from 'react';
import { cx } from '../../utils/cx';

type Variant = 'pill' | 'ghost' | 'list';
type Size = 'pill-sm' | 'pill-md' | 'ghost-arrow' | 'list';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

const base = 'transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/60';

const variants: Record<Variant, string> = {
  pill: 'rounded-full border border-white/20 text-chalk/70 uppercase tracking-wide hover:bg-white/10',
  ghost: 'rounded-full border border-white/10 bg-transparent text-chalk/80 hover:bg-white/10',
  list: 'rounded-xl border border-white/5 bg-ink/70 text-left hover:bg-white/10'
};

const sizes: Record<Size, string> = {
  'pill-sm': 'px-3 py-1 text-[10px]',
  'pill-md': 'px-4 py-2 text-xs',
  'ghost-arrow': 'h-10 w-20',
  list: 'px-3 py-2'
};

export default function Button({
  variant = 'pill',
  size = 'pill-md',
  className,
  type = 'button',
  ...props
}: Props) {
  return (
    <button
      type={type}
      className={cx(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

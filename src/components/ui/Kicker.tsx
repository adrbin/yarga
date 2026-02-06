import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
};

const base = 'text-xs uppercase tracking-[0.2em] text-chalk/50';

export default function Kicker({ children, className }: Props) {
  return <p className={[base, className].filter(Boolean).join(' ')}>{children}</p>;
}

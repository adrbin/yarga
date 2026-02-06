import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';

type Props = {
  children: ReactNode;
  className?: string;
  tone?: 'muted' | 'error';
};

const tones: Record<NonNullable<Props['tone']>, string> = {
  muted: 'text-sm text-chalk/50',
  error: 'text-sm text-ember'
};

export default function EmptyState({ children, className, tone = 'muted' }: Props) {
  return <p className={cx(tones[tone], className)}>{children}</p>;
}

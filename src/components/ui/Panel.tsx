import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';

type Props = {
  children: ReactNode;
  className?: string;
  as?: 'section' | 'div';
};

export default function Panel({ children, className, as = 'section' }: Props) {
  const Component = as;

  return (
    <Component className={cx('rounded-2xl border border-white/10 bg-white/5 p-4', className)}>
      {children}
    </Component>
  );
}

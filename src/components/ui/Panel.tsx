import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  as?: 'section' | 'div';
};

const cx = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(' ');

export default function Panel({ children, className, as = 'section' }: Props) {
  const Component = as;

  return (
    <Component className={cx('rounded-2xl border border-white/10 bg-white/5 p-4', className)}>
      {children}
    </Component>
  );
}

import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx';

type BaseProps = {
  children: ReactNode;
  className?: string;
};

type DivProps = BaseProps & HTMLAttributes<HTMLDivElement> & { as?: 'div' };
type ButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { as: 'button' };
type Props = DivProps | ButtonProps;

const base = 'rounded-2xl border border-white/10 bg-white/5';

export default function Card(props: Props) {
  if (props.as === 'button') {
    const { className, ...rest } = props;
    return <button className={cx(base, className)} {...rest} />;
  }

  const { className, ...rest } = props;
  return <div className={cx(base, className)} {...rest} />;
}

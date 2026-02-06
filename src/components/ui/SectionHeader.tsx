type Props = {
  title: string;
  count?: number | string;
  className?: string;
};

const cx = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(' ');

export default function SectionHeader({ title, count, className }: Props) {
  return (
    <div className={cx('flex items-center justify-between', className)}>
      <h2 className="font-display text-lg uppercase tracking-wide text-chalk/80">{title}</h2>
      {count !== undefined && <span className="text-xs text-chalk/50">{count}</span>}
    </div>
  );
}

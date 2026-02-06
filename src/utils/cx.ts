export const cx = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(' ');

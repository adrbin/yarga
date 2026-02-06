type Direction = 'left' | 'right' | 'up' | 'down';

const paths: Record<Direction, string> = {
  left: 'M12.5 4.5L7 10l5.5 5.5',
  right: 'M7.5 4.5L13 10l-5.5 5.5',
  up: 'M4.5 12.5L10 7l5.5 5.5',
  down: 'M4.5 7.5L10 13l5.5-5.5'
};

type Props = {
  direction: Direction;
  className?: string;
};

export default function ArrowIcon({ direction, className }: Props) {
  return (
    <svg
      aria-hidden="true"
      className={className ?? 'h-5 w-5'}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths[direction]} />
    </svg>
  );
}

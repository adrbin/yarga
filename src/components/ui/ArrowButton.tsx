import Button from './Button';
import ArrowIcon from './ArrowIcon';
import { cx } from '../../utils/cx';

type Direction = 'left' | 'right' | 'up' | 'down';

type Props = {
  direction: Direction;
  ariaLabel: string;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  dataNoSwipe?: boolean;
};

export default function ArrowButton({
  direction,
  ariaLabel,
  disabled,
  onClick,
  className,
  dataNoSwipe
}: Props) {
  return (
    <Button
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      data-no-swipe={dataNoSwipe ? 'true' : undefined}
      variant="ghost"
      size="ghost-arrow"
      className={cx(
        'pointer-events-auto',
        disabled ? 'cursor-not-allowed opacity-40' : 'opacity-100',
        className
      )}
    >
      <ArrowIcon direction={direction} />
    </Button>
  );
}

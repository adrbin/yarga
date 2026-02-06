import { useRef } from 'react';
import type { ReactNode } from 'react';

type Props = {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  children: ReactNode;
  className?: string;
  testId?: string;
};

const SWIPE_THRESHOLD = 60;

export default function SwipeLayer({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  children,
  className,
  testId
}: Props) {
  const startRef = useRef<{ x: number; y: number; pointerId: number } | null>(null);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement | null;
    if (target?.closest('[data-no-swipe="true"], button, input, textarea, select')) {
      return;
    }
    startRef.current = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
    if ('setPointerCapture' in event.currentTarget) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!startRef.current || startRef.current.pointerId !== event.pointerId) return;
    const dx = event.clientX - startRef.current.x;
    const dy = event.clientY - startRef.current.y;
    if ('releasePointerCapture' in event.currentTarget) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    startRef.current = null;

    if (!Number.isFinite(dx) || !Number.isFinite(dy)) {
      return;
    }

    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (absX < SWIPE_THRESHOLD && absY < SWIPE_THRESHOLD) return;

    if (absX >= absY) {
      if (dx > 0) {
        onSwipeRight?.();
      } else {
        onSwipeLeft?.();
      }
    } else {
      if (dy > 0) {
        onSwipeDown?.();
      } else {
        onSwipeUp?.();
      }
    }
  };

  return (
    <div
      data-testid={testId}
      className={["touch-none overscroll-none", className].filter(Boolean).join(' ')}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        startRef.current = null;
      }}
    >
      {children}
    </div>
  );
}

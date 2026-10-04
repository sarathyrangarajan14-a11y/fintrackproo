import React from "react";
import { Link, LinkProps } from "react-router-dom";
import { prefetchRoute } from "../../lib/prefetch";

interface PrefetchLinkProps extends LinkProps {
  prefetchDelay?: number;
}

/**
 * Enhanced Link that automatically pre-fetches the target route bundle
 * on mouse enter, touch start, or keyboard focus.
 */
export const PrefetchLink = React.forwardRef<HTMLAnchorElement, PrefetchLinkProps>(
  ({ to, onMouseEnter, onTouchStart, onFocus, children, prefetchDelay = 60, ...rest }, ref) => {
    const timerRef = React.useRef<NodeJS.Timeout | null>(null);

    const targetPath = typeof to === "string" ? to : to.pathname || "";

    const triggerPrefetch = () => {
      if (targetPath) {
        prefetchRoute(targetPath);
      }
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
      timerRef.current = setTimeout(triggerPrefetch, prefetchDelay);
      onMouseEnter?.(e);
    };

    const handleMouseLeave = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLAnchorElement>) => {
      triggerPrefetch();
      onTouchStart?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLAnchorElement>) => {
      triggerPrefetch();
      onFocus?.(e);
    };

    return (
      <Link
        ref={ref}
        to={to}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onFocus={handleFocus}
        {...rest}
      >
        {children}
      </Link>
    );
  }
);

PrefetchLink.displayName = "PrefetchLink";

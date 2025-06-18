import React from 'react';
import { isEqual } from 'lodash';

type EqualityFn<P> = (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean;

/**
 * withMemo - A HOC that applies React.memo with customizable comparison
 * 
 * @param Component - React component to memoize
 * @param propsAreEqual - Custom equality function (uses lodash isEqual by default)
 * @returns Memoized component
 * 
 * Usage:
 * ```tsx
 * // Basic memoization with deep comparison
 * const MemoizedComponent = withMemo(MyComponent);
 * 
 * // With custom equality check
 * const MemoizedComponent = withMemo(MyComponent, (prev, next) => {
 *   // Only compare the id prop
 *   return prev.id === next.id;
 * });
 * ```
 */
export function withMemo<P extends object>(
  Component: React.ComponentType<P>,
  propsAreEqual: EqualityFn<P> = (prev, next) => isEqual(prev, next)
): React.MemoExoticComponent<React.ComponentType<P>> {
  return React.memo(Component, propsAreEqual);
}

/**
 * withShallowMemo - A HOC that applies React.memo with shallow comparison
 * 
 * @param Component - React component to memoize
 * @returns Memoized component that only updates when props actually change
 */
export function withShallowMemo<P extends object>(
  Component: React.ComponentType<P>
): React.MemoExoticComponent<React.ComponentType<P>> {
  return React.memo(Component);
}
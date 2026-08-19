/**
 * The single easing curve used for every transition on the site.
 * Extracted from the reference template, where it is applied uniformly
 * at 0.3s-0.4s. Keeping one curve is what makes the motion feel like
 * one system rather than a collection of effects.
 */
export const EASE_BRAND = [0.44, 0, 0.56, 1] as const;

/** Default reveal duration, in seconds. */
export const DURATION_REVEAL = 0.4;

/** Default distance a revealing element travels, in pixels. */
export const DISTANCE_REVEAL = 32;

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'none';

/**
 * Starting offset for a reveal.
 *
 * Note: `up` means the element rises into place from below, which is the
 * template's behaviour and the usual reading of the word. The older
 * `ScrollAnimation` component treated `up` as falling from above; call sites
 * migrating across will see the direction corrected, not just retimed.
 */
export function offsetFor(
  direction: RevealDirection,
  distance: number
): { x: number; y: number } {
  switch (direction) {
    case 'up':
      return { x: 0, y: distance };
    case 'down':
      return { x: 0, y: -distance };
    case 'left':
      return { x: -distance, y: 0 };
    case 'right':
      return { x: distance, y: 0 };
    case 'none':
      return { x: 0, y: 0 };
  }
}

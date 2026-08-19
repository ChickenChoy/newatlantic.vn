/**
 * Motion primitives.
 *
 * Every animation on the site composes from these five, all running on one
 * easing curve and all honouring `prefers-reduced-motion`. Adding effects here
 * rather than inline is what keeps the motion coherent across pages.
 */
export { default as Reveal } from './Reveal';
export { default as StaggerGroup } from './StaggerGroup';
export { default as Marquee } from './Marquee';
export { default as CountUp } from './CountUp';
export { default as Parallax } from './Parallax';
export {
  EASE_BRAND,
  DURATION_REVEAL,
  DISTANCE_REVEAL,
  offsetFor,
  type RevealDirection,
} from './ease';

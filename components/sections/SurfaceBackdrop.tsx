import Image from 'next/image';

export interface SurfaceBackdropProps {
  /** Background photograph, laid under the navy scrim. */
  image?: string;
  /** Looping background clip. Rendered over `image`, which stays as the poster. */
  video?: string;
  /** Poster frame for the clip. Falls back to `image`. */
  poster?: string;
  /** Set on the first hero of a route so the photo joins the LCP request. */
  priority?: boolean;
  /** Drop the dot mesh where a section already carries its own texture. */
  mesh?: boolean;
  className?: string;
}

/**
 * The material every navy surface sits on.
 *
 * A flat navy band is the cheapest thing a brand can do and it reads as unfinished
 * — which is exactly the complaint. This gives one shared treatment instead:
 *
 *   1. optional photograph or looping clip, held under a scrim heavy enough that
 *      white copy keeps a ~10:1 contrast ratio over any frame;
 *   2. a cool highlight falling from the top left and an accent bloom rising
 *      from the opposite corner, so the panel has a light direction;
 *   3. a fine dot mesh, masked to fade out downward, which gives large empty
 *      areas something to catch the eye without competing with the copy;
 *   4. a specular hairline along the top seam.
 *
 * Layers 2–4 are the same ones the partner-network panel and the footer use, so
 * every dark surface on the site reads as the same material.
 *
 * Deliberately JS-free: no observer, no state, so it stays a server component and
 * costs nothing on the client. Reduced-motion users get the poster frame instead
 * of the clip, handled in CSS (see `.backdrop-clip` in globals.css).
 */
export default function SurfaceBackdrop({
  image,
  video,
  poster,
  priority = false,
  mesh = true,
  className = '',
}: SurfaceBackdropProps) {
  const hasMedia = Boolean(image || video);

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}>
      {image && (
        <Image
          src={image}
          alt=""
          fill
          priority={priority}
          sizes="100vw"
          className="object-cover"
        />
      )}

      {video && (
        <video
          className="backdrop-clip absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster || image}
        >
          <source src={video} type="video/mp4" />
        </video>
      )}

      {/* Scrim. Navy is L*15, so even at 78% over a mid-tone frame the surface
          lands near L*24 and white copy keeps roughly 10:1. */}
      {hasMedia && (
        <>
          <div className="absolute inset-0 bg-navy/[0.78]" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-navy/70" />
        </>
      )}

      <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_10%_0%,rgba(255,255,255,0.07),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(60%_70%_at_92%_100%,rgba(95,122,184,0.14),transparent_65%)]" />

      {mesh && <div className="surface-mesh absolute inset-0" />}

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
    </div>
  );
}

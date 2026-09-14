/**
 * The page transition.
 *
 * A template rather than a layout, because Next gives it a fresh key on every
 * navigation: the animation below re-runs on arrival, which is the whole
 * point. It also sits inside the layout rather than around it, so the header
 * and the footer hold still while only the page content changes.
 *
 * Opacity only, and only on the page arriving.
 *
 * An earlier version of this site crossfaded the outgoing and incoming pages
 * through View Transitions, which meant two full pages painted at once and
 * their headings read as doubled. Animating nothing on the way out makes that
 * impossible by construction: the old page is gone before this one paints.
 * And no transform, because the slide is what made the doubling legible in
 * the first place.
 */
export default function SiteTemplate({ children }: LayoutProps<"/">) {
  return <div className="page-enter">{children}</div>;
}

/**
 * Keyboard users can jump past the marketing header or the workspace
 * navigation. The target (<main id="main-content" tabIndex={-1}>) receives
 * focus so the next Tab continues inside the content.
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
    >
      Skip to main content
    </a>
  )
}

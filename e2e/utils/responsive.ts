import { Page, expect } from "@playwright/test";

const allNavLinks = [
  { name: "Home", url: "/", heading: "Home" },
  { name: "About", url: "/about", heading: "About" },
  { name: "Projects", url: "/projects", heading: "Projects" },
  { name: "Blog", url: "/blog", heading: "Blog" },
];

// Reusable responsive test utility
export async function testResponsive(
  page: Page,
  url: string,
  checkElementsFn: (page: Page) => Promise<void>
) {
  // Tailwind breakpoints
  const breakpoints = {
    sm: { width: 640, height: 800 },
    md: { width: 768, height: 800 },
    lg: { width: 1024, height: 800 },
    xl: { width: 1280, height: 800 },
    "2xl": { width: 1536, height: 800 },
  };

  const navLinks =
    url === "/" ? allNavLinks.filter((link) => link.url !== "/") : allNavLinks;

  // Load the page
  await page.goto(url);

  // Test each breakpoint in sequence
  for (const [, size] of Object.entries(breakpoints)) {
    await page.setViewportSize(size);

    // check navigation
    for (const link of navLinks) {
      const navLink = page.getByRole("link", { name: link.name });
      // expect(page.getByRole("link", { name: link.name })).toBeInViewport();
      const boundingBox = await navLink.boundingBox();

      // If boundingBox is null, the element is not in the viewport at all
      if (boundingBox) {
        // Ensure the element is fully within the viewport
        expect(boundingBox.x + boundingBox.width).toBeLessThanOrEqual(
          size.width
        );
        expect(boundingBox.y + boundingBox.height).toBeLessThanOrEqual(
          size.height
        );
        expect(boundingBox.x).toBeGreaterThanOrEqual(0);
        expect(boundingBox.y).toBeGreaterThanOrEqual(0);
      }
    }

    await checkElementsFn(page);
  }
}

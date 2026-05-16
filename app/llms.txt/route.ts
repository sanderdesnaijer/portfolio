import { sanityFetch } from "@/sanity/lib/fetch";
import { blogsQuery, projectsQuery } from "@/sanity/lib/queries";
import { ProjectTypeSanity } from "@/sanity/types";
import { BlogSanity } from "@/sanity/types/blogType";
import envConfig from "@/envConfig";

export const revalidate = 86400; // 24 hours

export async function GET() {
  const { baseUrl } = envConfig;

  const [projects, articles] = await Promise.all([
    sanityFetch<ProjectTypeSanity[]>({ query: projectsQuery }),
    sanityFetch<BlogSanity[]>({ query: blogsQuery }),
  ]);

  const projectLines = projects
    .slice(0, 10)
    .map(
      (p) =>
        `- [${p.title}](${baseUrl}/projects/${p.slug.current}): ${p.excerpt || ""}`
    )
    .join("\n");

  const articleLines = articles
    .slice(0, 10)
    .map(
      (a) =>
        `- [${a.title}](${baseUrl}/blog/${a.slug.current}): ${a.excerpt || ""}`
    )
    .join("\n");

  const content = `# Sander de Snaijer

> Frontend developer specializing in MediaPipe, computer vision, React, and hardware projects. Building creative browser experiments that combine webcams, hand tracking, and real-time interaction.

## About

Sander de Snaijer is a frontend developer based in the Netherlands. He builds browser-based computer vision projects using MediaPipe, WebGL, and Canvas. His work includes face-controlled games, gesture-controlled maps, ESP32 hardware projects, and Flutter mobile apps. All projects are open source.

## Topics of expertise

- MediaPipe face mesh and hand tracking in JavaScript
- Browser-based computer vision (WebGL, Canvas, WASM)
- Gesture recognition for web applications (OpenLayers, Google Maps, Leaflet)
- ESP32 and Arduino hardware projects
- Flutter and Dart mobile development
- Next.js and React frontend architecture
- 3D printing and maker projects

## Projects

${projectLines}

## Blog articles

${articleLines}

## Links

- Website: ${baseUrl}
- GitHub: https://github.com/sanderdesnaijer
- LinkedIn: https://www.linkedin.com/in/sanderdesnaijer
- X: https://x.com/sanderdesnaijer
- YouTube: https://www.youtube.com/@metSander
- Demos: https://demos.sanderdesnaijer.com
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}

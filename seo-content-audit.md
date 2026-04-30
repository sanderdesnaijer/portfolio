# SEO Content Audit - sanderdesnaijer.com

## Current state

### What's working well

The technical SEO foundation is strong. JSON-LD schemas are implemented correctly for blog posts, projects, FAQ, breadcrumbs, Person, and WebSite types. Meta descriptions are consistently 155-165 characters with solid keyword placement. The content-first title strategy (article title before brand name) improves click-through rates in search results. Tag hub pages create good topical clusters, and FAQ schema on blog posts gives a shot at rich results in Google.

The plumbing is great. The bottleneck is content volume and strategy.

### Content inventory

- **Blog posts:** 10
- **Projects:** 11
- **Tags:** 53
- **Indexed pages (Google):** ~10 (newer posts still climbing)

### SEO scores by area

| Area                      | Score  | Notes                                                 |
| ------------------------- | ------ | ----------------------------------------------------- |
| Structured data (JSON-LD) | 9.2/10 | Comprehensive schema coverage across all page types   |
| Meta tags                 | 9.0/10 | Well-written, correct length, keyword-rich            |
| Tag hub pages             | 8.8/10 | Strong taxonomy with intro text and meta descriptions |
| Title strategy            | 9.0/10 | Content-first on detail pages, brand-first on indexes |
| FAQ schema                | 8.0/10 | Google-compliant, but only on blog posts              |
| Internal linking          | 5.5/10 | Tag hubs work, but no direct cross-content links      |
| Content volume            | 5.5/10 | 10 posts is growing but still needs depth per topic   |
| Topical authority         | 6.0/10 | MediaPipe cluster is building, others still thin      |

### Content categories (current)

- MediaPipe / webcam / computer vision: 3 posts
- 3D printing / maker: 3 posts
- Web development (Next.js, CSS): 2 posts
- Flutter / mobile: 2 posts

---

## Google Search Console findings (April 2026)

### Biggest opportunity: "resin stained glass alternative technique"

- **1,352 impressions, 0 clicks** over the full reporting period
- Average position dropped from 6.1 to 8.1 (page 1, but slipping)
- 0% CTR means people see the result and scroll past

**Root cause:** The blog title "How to Make 3D Printed Stained Glass with Resin (Step-by-Step Guide)" leads with "3D Printed", but the search intent is about resin as an alternative to traditional stained glass. Searchers may not own a 3D printer and skip the result.

**Fix (in Sanity):**

- **New title:** "How to Make Stained Glass with Resin - No Glass Cutting Required" (55 chars, fits Google's display limit)
- **New excerpt/meta description:** "Learn how to create realistic stained glass using resin and a few simple tools. A beginner-friendly alternative to traditional glass cutting, with step-by-step photos." (168 chars)
- **Content update:** Add a section early in the post addressing "resin as a stained glass alternative" directly. Mention "no glass cutting" and "alternative technique" in the first paragraph and in at least one H2.

### Query cluster: MediaPipe hand tracking (~1,200+ impressions)

Top queries people use to find the site:

- "mediapipe hands cdn jsdelivr" (119 impressions)
- hand_landmarker.task URL variants (84+42+42)
- "mediapipe hands handedness assumes mirrored selfie" (54+33+15+...)
- "@mediapipe/tasks-vision handlandmarker example" (42+26+23)
- "mediapipe hands js cdn" (32+23+20+18)

**What this means:** People want very specific things: working CDN URLs, copy-paste JavaScript examples, and help with the handedness/mirroring issue. The blog posts are appearing for these queries but may not answer them directly enough.

**Fix:** Make sure the MediaPipe hand tracking post includes a clearly marked, copy-paste CDN URL section, a complete working JavaScript example block, and a dedicated section explaining the handedness/mirrored camera behavior. These are reference queries, so scannable formatting (code blocks, clear headings) matters more than narrative.

### Query cluster: MediaPipe face mesh landmarks (~600+ impressions)

Top queries:

- "mediapipe face mesh landmark 33 263 outer eye corners" (45)
- "mediapipe face mesh 61 291 mouth corners" (31)
- "mediapipe face mesh landmark 13 14 upper lip lower lip" (31)
- "mediapipe facemesh landmark 152 chin" (8)
- face_landmarker.task URL variants (17+11)

**What this means:** The Face Mesh Landmark Index post (published April 29, 2026) is brand new and already pulling impressions. People want a visual reference for specific landmark numbers.

**Fix:** Ensure the post has a clear visual diagram of the face with numbered landmarks. A searchable or filterable table of all 468 landmarks would be a standout feature that no competitor offers. Group landmarks by region (eyes, mouth, nose, chin, forehead) with the specific index numbers people search for.

### Query cluster: Next.js + headless CMS (~180+ impressions)

Top queries:

- "nextjs headless cms" (38)
- "next.js headless cms" (14)
- "headless cms for nextjs" (13)
- "best headless cms for nextjs" (5)
- "nextjs sanity" (4)
- "sanity next js" (7)

**What this means:** Competitive queries, but the portfolio blog post is appearing. Zero clicks suggests the result isn't compelling enough against established comparison articles.

**Fix:** Add a comparison section to the portfolio post explaining why Sanity was chosen over Contentful, Strapi, and other alternatives. Include setup time estimates and real tradeoffs. Consider updating the title to be more specific, like "Building a Portfolio with Next.js and Sanity: Setup, Gotchas, and Why I Chose It."

### Query cluster: OpenGeoWeb (~160 impressions)

- "opengeoweb" (96 impressions)
- "open geoweb" (33 impressions, 1 click)
- "ex geoweb" (31 impressions)

**What this means:** People are searching for the project by name, including what appears to be former users of the system ("ex geoweb"). The project page should clearly state what OpenGeoWeb is and its relationship to KNMI.

### Query cluster: 3D printing (stained glass + chocolate, ~50+ impressions)

- "3d printed stained glass" (7), "3d print stained glass" (6), "stained glass 3d print" (4)
- "3d printed chocolate mold" (5), "chocolate mold 3d print" (4), "3d printer chocolate mold" (1)

**What this means:** Smaller volume but high-intent maker queries. The stained glass post is the only content that has earned real clicks. These long-tail queries convert well. Make sure both posts have image alt text using these exact phrases.

### Surprise queries worth monitoring

- "face tetris" (10 impressions) - validates writing an Eyebrow Tetris companion blog post
- "browser tetris" (3) - same signal
- "toilet paper simulator" (2) - even fun projects attract search traffic
- "finger detection" (4) - generic query, but relevant to the webcam projects
- "three.js particle system hand tracking mediapipe demo" (4) - very specific, high-intent

---

## Where traffic is being left on the table

### 1. Content volume needs continued growth

10 blog posts is an improvement but still not enough for deep topical authority. The MediaPipe cluster is the strongest growth area with 3 posts and 1,800+ combined impressions. Keep building here.

### 2. Best projects lack companion blog posts

Eyebrow Tetris is genuinely unique and lives on its own subdomain, but there is no "how I built a face-controlled Tetris with MediaPipe" post to capture the search traffic. "Face tetris" already gets 10 impressions with no dedicated content. Same goes for Pug's Hunt, the 3D Toilet Paper Roll Simulator, and the Game of Life project.

### 3. No cross-linking between blogs and projects

Right now the only bridge is the shared tag system. If someone reads the 3D printed word clock post, there is no direct link saying "see the full project page" and vice versa. That is free internal link equity not being used.

### 4. "How to" content is the strongest performer but underrepresented

The stained glass and chocolate mold posts are the kind of long-tail content that ranks well because they are specific, experience-based, and hard for AI to replicate. The stained glass post alone accounts for 1,400+ impressions across related queries.

### 5. Thin tag pages dilute authority

53 tags across 10 posts and 11 projects means many tag pages have only 1 item. Tags like "Resin" (1), "stained glass" (1), "silicone molds" (1), "arts and crafts" (1) could be merged into broader tags like "DIY" or "makers". Tags like "browser game" (1), "Canvas" (1), "gesture controls" (1), and "app development" (1) need more content tagged with them or should be consolidated.

---

## Blog post ideas that would bring real people in

### Maker/DIY content (strongest lane)

- **"How I built a face-controlled Tetris game with MediaPipe"** - Targets webcam game devs, MediaPipe learners, and the creative coding crowd. "Face tetris" already gets 10 impressions with no content targeting it.
- **"3D printing food-safe molds: what actually works (and what doesn't)"** - Consolidates the chocolate mold experience into a broader guide, targets a growing search query.
- **"Building a word clock from scratch: Arduino + 3D printing + custom firmware"** - A detailed build log targeting the maker/Arduino community.
- **"5 unusual things you can make with a 3D printer (that aren't phone cases)"** - Listicle format with high shareability, showcasing stained glass, chocolate molds, and clock projects.

### Developer content (leveraging 10+ years of experience)

- **"What I learned building my portfolio with Next.js and Sanity"** - Consistently pulls traffic from devs evaluating headless CMS options. 180+ impressions for "nextjs headless cms" queries confirm the demand.
- **"React mistakes I made in 10 years of frontend development"** - Personal experience content that AI cannot replicate. High engagement potential.
- **"Setting up a multilingual app with Flutter: the hard parts nobody mentions"** - Draws from building Sudoku Ultimato and turns those lessons into searchable content.
- **"Using MediaPipe in the browser: a practical guide"** - Very few good tutorials exist for this. Already 1,800+ impressions across MediaPipe queries validate this topic.

### Crossover content (dev + maker, unique positioning)

- **"From code to physical object: how I prototype with 3D printing and Arduino"** - Positions the site uniquely at the intersection of software and hardware.
- **"How I use AI tools in my side projects"** - Timely topic with an authentic angle from someone who actually ships things.

---

## Quick wins to implement now

### 1. Fix stained glass post title and description (highest impact)

Change in Sanity. New title: "How to Make Stained Glass with Resin - No Glass Cutting Required". New excerpt targeting "resin stained glass alternative technique". Add early content section about resin as an alternative. This single change addresses 1,352 wasted impressions.

### 2. Enrich tags on existing content

Many projects and blog posts are under-tagged. Adding existing tags to content that fits them will thicken thin tag pages without writing new content. Key tags to spread: "browser game", "Canvas", "gesture controls", "app development", "Bambu X1C", "3D modelling", "electronics", "Landmarks", "localization", "Firebase".

### 3. Add direct blog-to-project cross-links

Add links from each blog post to its corresponding project page and back. A "See the project" card at the bottom of relevant blog posts would work well.

Specific cross-links to add:

| Blog post                    | Link to project                                             |
| ---------------------------- | ----------------------------------------------------------- |
| 3D Printed Stained Glass     | Create project page if missing                              |
| Arduino Word Clock           | Arduino 3D printed dutch word clock                         |
| Chocolate Bar Mold           | Create project page if missing                              |
| Sudoku App (Flutter)         | Sudoku Ultimato                                             |
| First Flutter App            | Cross-link to Sudoku blog post as sequel                    |
| Portfolio (Next.js + Sanity) | Portfolio project page                                      |
| Responsive Header            | Portfolio project page (real-world example)                 |
| MediaPipe hand tracking      | Control Maps with Hand Gestures, Pug's Hunt, Eyebrow Tetris |
| MediaPipe Face Mesh Landmark | Eyebrow Tetris, Pug's Hunt                                  |
| Gesture controls post        | Control Maps with Hand Gestures                             |

Blog-to-blog clusters to interlink:

- 3D printing cluster: Stained glass, Chocolate mold, Word clock (link between all three)
- Flutter cluster: First Flutter App and Sudoku Ultimato (link as a series)
- MediaPipe cluster: Hand tracking, Face Mesh, Gesture controls (link between all three)

### 4. Add FAQ sections to project pages

Project pages currently have no FAQ schema. Questions like "What technologies does this use?" or "Can I fork this?" are natural fits and give more FAQ schema coverage in search results.

### 5. Consolidate thin tag pages

Merge tags with only 1 item where possible. Candidates: "Resin" + "stained glass" + "arts and crafts" could all live under "DIY". "silicone molds" could merge into "3D printing" or "makers".

### 6. Write a companion post for Eyebrow Tetris

"Face tetris" gets 10 impressions already. This is probably the single highest-impact new content to create. The project is unique, the tech stack is interesting (MediaPipe, browser APIs, game logic), and very few people have written about building webcam-controlled browser games.

---

_Audit date: April 30, 2026_
_Updated with Google Search Console data (reporting period: March-April 2026)_

// SVG module declarations for TypeScript
// This file provides type declarations for SVG imports that are transformed by @svgr/webpack

declare module "*.svg" {
  import * as React from "react";

  const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;

  export default ReactComponent;
}

declare module "*.svg?url" {
  const content: string;
  export default content;
}

declare module "*.svg?inline" {
  import * as React from "react";
  const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;
  export default ReactComponent;
}

// Explicit declarations for specific SVG files
// declare module "@/public/logo.svg" {
//   import * as React from "react";
//   const ReactComponent: React.FunctionComponent<
//     React.SVGProps<SVGSVGElement> & { title?: string }
//   >;
//   export default ReactComponent;
// }

// declare module "@/public/icons/github.svg" {
//   import * as React from "react";
//   const ReactComponent: React.FunctionComponent<
//     React.SVGProps<SVGSVGElement> & { title?: string }
//   >;
//   export default ReactComponent;
// }

// declare module "@/public/icons/article.svg" {
//   import * as React from "react";
//   const ReactComponent: React.FunctionComponent<
//     React.SVGProps<SVGSVGElement> & { title?: string }
//   >;
//   export default ReactComponent;
// }

// declare module "@/public/icons/download.svg" {
//   import * as React from "react";
//   const ReactComponent: React.FunctionComponent<
//     React.SVGProps<SVGSVGElement> & { title?: string }
//   >;
//   export default ReactComponent;
// }

// declare module "@/public/icons/demo.svg" {
//   import * as React from "react";
//   const ReactComponent: React.FunctionComponent<
//     React.SVGProps<SVGSVGElement> & { title?: string }
//   >;
//   export default ReactComponent;
// }

// declare module "@/public/icons/gitlab.svg" {
//   import * as React from "react";
//   const ReactComponent: React.FunctionComponent<
//     React.SVGProps<SVGSVGElement> & { title?: string }
//   >;
//   export default ReactComponent;
// }

// declare module "@/public/icons/linkedin.svg" {
//   import * as React from "react";
//   const ReactComponent: React.FunctionComponent<
//     React.SVGProps<SVGSVGElement> & { title?: string }
//   >;
//   export default ReactComponent;
// }

// declare module "@/public/icons/missing.svg" {
//   import * as React from "react";
//   const ReactComponent: React.FunctionComponent<
//     React.SVGProps<SVGSVGElement> & { title?: string }
//   >;
//   export default ReactComponent;
// }

// declare module "@/public/icons/chevron-right.svg" {
//   import * as React from "react";
//   const ReactComponent: React.FunctionComponent<
//     React.SVGProps<SVGSVGElement> & { title?: string }
//   >;
//   export default ReactComponent;
// }

// declare module "@/public/icons/x.svg" {
//   import * as React from "react";
//   const ReactComponent: React.FunctionComponent<
//     React.SVGProps<SVGSVGElement> & { title?: string }
//   >;
//   export default ReactComponent;
// }

// declare module "@/public/icons/youtube.svg" {
//   import * as React from "react";
//   const ReactComponent: React.FunctionComponent<
//     React.SVGProps<SVGSVGElement> & { title?: string }
//   >;
//   export default ReactComponent;
// }

// declare module "@/public/icons/instagram.svg" {
//   import * as React from "react";
//   const ReactComponent: React.FunctionComponent<
//     React.SVGProps<SVGSVGElement> & { title?: string }
//   >;
//   export default ReactComponent;
// }

// declare module "@/public/icons/medium.svg" {
//   import * as React from "react";
//   const ReactComponent: React.FunctionComponent<
//     React.SVGProps<SVGSVGElement> & { title?: string }
//   >;
//   export default ReactComponent;
// }

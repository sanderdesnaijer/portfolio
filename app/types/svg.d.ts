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

// Explicit declarations for the specific SVG files being imported
// declare module "@/app/assets/logo.svg" {
//   import * as React from "react";
//   const ReactComponent: React.FunctionComponent<
//     React.SVGProps<SVGSVGElement> & { title?: string }
//   >;
//   export default ReactComponent;
// }

// declare module "@/app/assets/icons/github.svg" {
//   import * as React from "react";
//   const ReactComponent: React.FunctionComponent<
//     React.SVGProps<SVGSVGElement> & { title?: string }
//   >;
//   export default ReactComponent;
// }

// declare module "@/app/assets/icons/article.svg" {
//   import * as React from "react";
//   const ReactComponent: React.FunctionComponent<
//     React.SVGProps<SVGSVGElement> & { title?: string }
//   >;
//   export default ReactComponent;
// }

// declare module "@/app/assets/icons/download.svg" {
//   import * as React from "react";
//   const ReactComponent: React.FunctionComponent<
//     React.SVGProps<SVGSVGElement> & { title?: string }
//   >;
//   export default ReactComponent;
// }

// declare module "@/app/assets/icons/demo.svg" {
//   import * as React from "react";
//   const ReactComponent: React.FunctionComponent<
//     React.SVGProps<SVGSVGElement> & { title?: string }
//   >;
//   export default ReactComponent;
// }

// declare module "@/app/assets/icons/gitlab.svg" {
//   import * as React from "react";
//   const ReactComponent: React.FunctionComponent<
//     React.SVGProps<SVGSVGElement> & { title?: string }
//   >;
//   export default ReactComponent;
// }

// declare module "@/app/assets/icons/linkedin.svg" {
//   import * as React from "react";
//   const ReactComponent: React.FunctionComponent<
//     React.SVGProps<SVGSVGElement> & { title?: string }
//   >;
//   export default ReactComponent;
// }

// declare module "@/app/assets/icons/missing.svg" {
//   import * as React from "react";
//   const ReactComponent: React.FunctionComponent<
//     React.SVGProps<SVGSVGElement> & { title?: string }
//   >;
//   export default ReactComponent;
// }

// declare module "@/app/assets/icons/chevron-right.svg" {
//   import * as React from "react";
//   const ReactComponent: React.FunctionComponent<
//     React.SVGProps<SVGSVGElement> & { title?: string }
//   >;
//   export default ReactComponent;
// }

// declare module "@/app/assets/icons/x.svg" {
//   import * as React from "react";
//   const ReactComponent: React.FunctionComponent<
//     React.SVGProps<SVGSVGElement> & { title?: string }
//   >;
//   export default ReactComponent;
// }

// declare module "@/app/assets/icons/youtube.svg" {
//   import * as React from "react";
//   const ReactComponent: React.FunctionComponent<
//     React.SVGProps<SVGSVGElement> & { title?: string }
//   >;
//   export default ReactComponent;
// }

// declare module "@/app/assets/icons/instagram.svg" {
//   import * as React from "react";
//   const ReactComponent: React.FunctionComponent<
//     React.SVGProps<SVGSVGElement> & { title?: string }
//   >;
//   export default ReactComponent;
// }

// declare module "@/app/assets/icons/medium.svg" {
//   import * as React from "react";
//   const ReactComponent: React.FunctionComponent<
//     React.SVGProps<SVGSVGElement> & { title?: string }
//   >;
//   export default ReactComponent;
// }

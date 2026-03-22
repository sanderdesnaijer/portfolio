"use client";

import { useMemo } from "react";
import hljs from "highlight.js/lib/core";
import "highlight.js/styles/github-dark.min.css";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import json from "highlight.js/lib/languages/json";
import bash from "highlight.js/lib/languages/bash";
import python from "highlight.js/lib/languages/python";
import dart from "highlight.js/lib/languages/dart";
import yaml from "highlight.js/lib/languages/yaml";
import plaintext from "highlight.js/lib/languages/plaintext";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("html", xml);
hljs.registerLanguage("css", css);
hljs.registerLanguage("json", json);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("python", python);
hljs.registerLanguage("dart", dart);
hljs.registerLanguage("yaml", yaml);
hljs.registerLanguage("plaintext", plaintext);

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const highlightedHTML = useMemo(() => {
    if (language && hljs.getLanguage(language)) {
      return hljs.highlight(code, { language }).value;
    }
    return hljs.highlightAuto(code).value;
  }, [code, language]);

  return (
    <div className="not-prose group relative my-6">
      {language && language !== "text" && (
        <span className="absolute top-2 right-3 text-xs text-gray-400 opacity-70">
          {language}
        </span>
      )}
      <pre className="overflow-x-auto rounded-lg bg-gray-950 p-4 text-sm leading-relaxed text-gray-200">
        <code
          className={`hljs${language ? ` language-${language}` : ""}`}
          dangerouslySetInnerHTML={{ __html: highlightedHTML }}
        />
      </pre>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const highlightedHTML = useMemo(() => {
    if (language && hljs.getLanguage(language)) {
      return hljs.highlight(code, { language }).value;
    }
    return hljs.highlightAuto(code).value;
  }, [code, language]);

  const label = language && language !== "text" ? language : "Code";

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }, [code]);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(t);
  }, [copied]);

  return (
    <div className="not-prose my-6 overflow-hidden rounded-lg border border-gray-800 bg-gray-950 shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-gray-800 bg-gray-900/60 px-3 py-2">
        <span className="font-mono text-xs tracking-wide text-gray-400 uppercase">
          {label}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:outline-none"
          aria-label={copied ? "Copied" : "Copy code"}
        >
          {copied ? (
            <>
              <CheckIcon className="text-emerald-400" />
              {"Copied"}
            </>
          ) : (
            <>
              <CopyIcon />
              {"Copy"}
            </>
          )}
        </button>
      </div>
      <pre
        className="overflow-x-auto p-4 text-sm leading-relaxed text-gray-200"
        tabIndex={0}
        aria-label={`${label} code sample`}
      >
        <code
          className={`hljs${language ? ` language-${language}` : ""}`}
          dangerouslySetInnerHTML={{ __html: highlightedHTML }}
        />
      </pre>
    </div>
  );
}

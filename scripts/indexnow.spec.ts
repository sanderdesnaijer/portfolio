/**
 * @jest-environment node
 */
import { execFileSync } from "child_process";
import { readFileSync } from "fs";
import path from "path";

const HOST = "www.sanderdesnaijer.com";
const SCRIPT = path.join(__dirname, "indexnow.mjs");

// Loaded into the child process before the script, so nothing reaches the
// network: the sitemap is faked and the submission is printed instead of sent.
const FAKE_FETCH = `
  globalThis.fetch = async (url, options) => {
    if (options?.body) {
      console.log("REQUEST " + options.body);
      return new Response();
    }
    console.log("SITEMAP " + url);
    return new Response("<loc>https://${HOST}/blog/from-sitemap</loc>");
  };
`;

function runScript(...args: string[]) {
  const preload = `data:text/javascript,${encodeURIComponent(FAKE_FETCH)}`;
  const output = execFileSync(
    process.execPath,
    ["--import", preload, SCRIPT, ...args],
    { encoding: "utf8", timeout: 10_000 }
  );

  return {
    sitemap: output.match(/^SITEMAP (.+)$/m)?.[1],
    request: JSON.parse(output.match(/^REQUEST (.+)$/m)![1]),
  };
}

describe("indexnow script", () => {
  it("submits sitemap URLs under the www host", () => {
    const { sitemap, request } = runScript();

    expect(sitemap).toBe(`https://${HOST}/sitemap.xml`);
    expect(request.host).toBe(HOST);
    expect(request.urlList).toEqual([`https://${HOST}/blog/from-sitemap`]);
  });

  it("points to a key file on the www host that exists in public/", () => {
    const { request } = runScript();
    const keyFile = path.join(__dirname, "../public", `${request.key}.txt`);

    expect(request.keyLocation).toBe(`https://${HOST}/${request.key}.txt`);
    expect(readFileSync(keyFile, "utf8").trim()).toBe(request.key);
  });

  it.each(["../README.md", "indexnow.mjs"])(
    "has a usage example in %s that matches the host",
    (file) => {
      const text = readFileSync(path.join(__dirname, file), "utf8");
      const example = text.match(/indexnow\.mjs (https:\/\/\S+)/)![1];
      const { request } = runScript(example);

      expect(new URL(example).host).toBe(request.host);
      expect(request.host).toBe(HOST);
    }
  );
});

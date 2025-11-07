/**
 * @note The block below contains polyfills for Node.js globals
 * required for Jest to function when running JSDOM tests.
 * These HAVE to be require's and HAVE to be in this exact
 * order, since "undici" depends on the "TextEncoder" global API.
 *
 * Consider migrating to a more modern test runner if
 * you don't want to deal with this.
 */

import { TextDecoder, TextEncoder } from "node:util";
import {
  ReadableStream,
  WritableStream,
  TransformStream,
} from "node:stream/web";

Object.defineProperties(globalThis, {
  TextDecoder: { value: TextDecoder },
  TextEncoder: { value: TextEncoder },
  ReadableStream: { value: ReadableStream },
  WritableStream: { value: WritableStream },
  TransformStream: { value: TransformStream },
});

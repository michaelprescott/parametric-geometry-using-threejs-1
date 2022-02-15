/**
 * @jest-environment jsdom
 */
 import { TextEncoder, TextDecoder } from "util";
 (global as any).TextEncoder = TextEncoder;
 (global as any).TextDecoder = TextDecoder;

 import * as fs from "fs";
 import { JSDOM } from "jsdom";
 import { JSDOM_OPTIONS } from "./jsdom-helpers";

 const html = fs.readFileSync("./tests/unit/example-1.page.html");
 export const page: JSDOM = new JSDOM(html, JSDOM_OPTIONS);

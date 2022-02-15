/**
 * @jest-environment jsdom
 */

import { TextEncoder, TextDecoder } from "util";
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;

import { JSDOM } from "jsdom";
import { JSDOM_OPTIONS } from "./jsdom-helpers";
import { Example1 } from "../../src/example-1";


describe("Example1", () => {
  let example1: Example1;
  beforeAll(() => {
    example1 = Example1.getInstance();
  });

  describe("Example1.getInstance()", () => {
    test("instance is created and attached to window.zapdaz.example1", () => {
      expect(example1).toBeDefined();
      expect(window.zapdaz.example1).toBeDefined();
    });
  });

  describe("init()", () => {
    test("should initialize", () => {
      example1.init();
    });

  });
});

import { JSDOM, ConstructorOptions } from "jsdom";

export const JSDOM_OPTIONS: ConstructorOptions = {
  userAgent: "Node.js",
  storageQuota: 100000000,
  runScripts: "dangerously",
  resources: "usable",
  contentType: "text/html",
  includeNodeLocations: true,
  pretendToBeVisual: true,
  // Fix: SecurityError: localStorage is not available for opaque origins
  // REFERENCE: https://github.com/jsdom/jsdom/issues/2383
  url: "https://localhost.calvertlearning.com",
};

// It's not clear to me yet whether or not these are needed anymore.
//
// export function copyProps(src: any, target: any): void {
//   Object.defineProperties(target, {
//     ...Object.getOwnPropertyDescriptors(src),
//     ...Object.getOwnPropertyDescriptors(target),
//   });
// }

// export function setGlobals(jsDomInstance: JSDOM, fetch: any): void {
//   const { window } = jsDomInstance;
//   global["window"] = window;
//   global["document"] = window.document;
//   global["navigator"] = {
//     userAgent: "Node.js",
//   };
//   global["fetch"] = fetch;
//   global["Request"] = fetch.Request;
//   global["requestAnimationFrame"] = window.requestAnimationFrame;
//   global["cancelAnimationFrame"] = window.cancelAnimationFrame;
//   global["Node"] = {
//     ELEMENT_NODE: 1, // An Element node like <p> or <div>.
//     TEXT_NODE: 3, // The actual Text inside an Element or Attr.
//     CDATA_SECTION_NODE: 4, // A CDATASection, such as <!CDATA[[ … ]]>.
//     PROCESSING_INSTRUCTION_NODE: 7, // A ProcessingInstruction of an XML document, such as <?xml-stylesheet … ?>.
//     COMMENT_NODE: 8, // A Comment node, such as <!-- … -->.
//     DOCUMENT_NODE: 9, // A Document node.
//     DOCUMENT_TYPE_NODE: 10, // A DocumentType node, such as <!DOCTYPE html>.
//     DOCUMENT_FRAGMENT_NODE: 11, // A DocumentFragment node.
//   };
//   // REFERENCE: https://github.com/jsdom/jsdom/issues/1368
//   global["DOMParser"] = window.DOMParser;
//   copyProps(window, global);
// }

// export function delGlobals(): void {
//   global["window"] = undefined;
//   global["document"] = undefined;
//   global["navigator"] = undefined;
//   global["fetch"] = undefined;
//   global["Request"] = undefined;
//   global["requestAnimationFrame"] = undefined;
//   global["cancelAnimationFrame"] = undefined;
//   global["Node"] = undefined;
// }

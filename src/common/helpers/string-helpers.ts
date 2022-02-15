export function lowercaseFirstLetter(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export function removeHtmlStringWhitespace(htmlStr: string): string {
  // remove newline / carriage return
  htmlStr = htmlStr.replace(/\n/g, "");
  // remove whitespace (space and tabs) before tags
  htmlStr = htmlStr.replace(/[\t ]+\</g, "<");
  // remove whitespace between tags
  htmlStr = htmlStr.replace(/\>[\t ]+\</g, "><");
  // remove whitespace after tags
  htmlStr = htmlStr.replace(/\>[\t ]+$/g, ">");
  // remove newline / carriage between properties
  htmlStr = htmlStr.replace(/[\n\t ]+/g, " ");
  return htmlStr;
}

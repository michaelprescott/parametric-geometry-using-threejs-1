/**
 * build-info provides a set of constants that are set to "baked-in" or compiler replaced values.
 * Classes and other modules will import build-info when it's these values are useful for
 * reporting, debugging, or sometimes cache and storage busting.
 * @packageDocumentation
 */

/**
 * The name of the package or app
 */
export const appName = ((): string => {
  const result = "${appName}";
  return result == "${" + "appName" + "}" ? "app-name-not-baked-in" : result;
})();

/**
 * The name of the author
 */
export const appAuthor = ((): string => {
  const result = "${appAuthor}";
  return result == "${" + "appAuthor" + "}" ? "Michael Prescott" : result;
})();

/**
 * Version of this build, extracted from package.json
 * Set by webpack.config.js
 */
export const version = ((): string => {
  const result = "${version}";
  return result == "${" + "version" + "}" ? "0.0.0" : result;
})();

/**
 * The date and time that this release was built. This is meant to be humanly readable.
 * @see buildTimeBuster for a cache busting or an acceptable url param value
 * Set by webpack.config.js
 */
export const buildTime = ((): string => {
  const result = "${buildTime}";
  return result == "${" + "buildTime" + "}" ? "January 1, 0000, 00:00:00 am" : result;
})();

/**
 * The date and time that this release was built. Compact format that is useful
 * for cache and storage busting.
 * Set by webpack.config.js
 */
export const buildTimeBuster = ((): string => {
  const result = "${buildTimeBuster}";
  return result == "${" + "buildTimeBuster" + "}" ? "00000000_000000" : result;
})();

export const releaseBranch = ((): string => {
  const result = "${releaseBranch}";
  return result == "${" + "releaseBranch" + "}" ? "dev" : result;
})();

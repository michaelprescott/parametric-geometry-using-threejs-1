/**
 *
 * @param {string} scriptSrc valid non-empty URL
 * @param {string} scriptType `module` | undefined
 * @param {function} onLoadCb function called onload
 * @param {function} onErrorCb function called onerror
 * @param {string} dataId adds a data-id to locate the specific script tag
 * @param {boolean} isAsync execute script when available, without blocking while fetching
 * @param {boolean} intoHead append to <head> when true; otherwise appends to body
 */
async function injectScriptPromise(scriptUrl, scriptType, onLoadCb, onErrorCb, dataId, isAsync, intoHead) {
  return new Promise((resolve, reject) => {
    let resolveOnLoadCb = (res) => {
      if (onLoadCb) onLoadCb(res);
      resolve(res);
    };

    let rejectOnErrorCb = (err) => {
      reject(err);
    };

    injectScript(scriptUrl, scriptType, resolveOnLoadCb, rejectOnErrorCb, dataId, isAsync, intoHead);
  });
}

function injectScript(scriptUrl, scriptType, onLoadCb, onErrorCb, dataId, isAsync, intoHead) {
  const script = document.createElement("script");

  // TODO: test module injections
  if (scriptType === "module") {
    script.type = scriptType;
  } else {
    if (typeof scriptType !== "undefined") {
      console.warn(`injectScript() only supports classic scripts or "module" scripts.
                  scriptType, "${scriptType}", will be used.`);
    }
  }

  if (scriptUrl) {
    script.src = scriptUrl;
  } else {
    console.warn("injectScript() requires a scriptUrl to set the <script src>");
  }

  if (dataId) {
    script.setAttribute("data-id", dataId);
  } else {
    throw new Error("You must set a dataId for injected scripts.");
  }

  script.onload = function () {
    if (onLoadCb) return onLoadCb(dataId);
  };
  script.onerror = function (err) {
    if (onErrorCb) return onErrorCb(err);
    return err;
  };

  if (intoHead) {
    document.getElementsByTagName("head")[0].appendChild(script);
  } else {
    let bodyEl = document.getElementsByTagName("body")[0];
    if (bodyEl) {
      bodyEl.appendChild(script);
    } else {
      injectWithEventListener(script);
    }
  }
}

function injectWithEventListener(script) {
  document.addEventListener("DOMContentLoaded", function () {
    document.getElementsByTagName("body")[0].appendChild(script);
  });
}

// Running in browser or test environment?
if (window) {
  if (typeof window.IN_BROWSER === "undefined") {
    window.IN_BROWSER = navigator.userAgent !== "Node.js";
  }
} else if (global) {
  if (typeof global.IN_BROWSER === "undefined") {
    global.IN_BROWSER = navigator.userAgent !== "Node.js";
  }
}

// Attaches instance to window for easy, script-tag integration into existing
// products. For example, `window.zapdaz.inex.init()`
if (typeof window !== "undefined") {
  if (typeof window.zapdaz === "undefined") {
    //if (IN_BROWSER) console.info("script-helpers - setting window.zapdaz = {}");
    window.zapdaz = {};
  }
  if (window.zapdaz.injectScript) {
    //console.info("script-helpers - window.zapdaz already has injectScript()");
  } else {
    //if (IN_BROWSER) console.info("assigning injectScript() to window.zapdaz.injectScript()");
    window.zapdaz.injectScript = injectScript;
    window.zapdaz.injectScriptPromise = injectScriptPromise;
  }
} else {
  console.warn("window is not defined, zapdaz and zapdaz.injectScript() can not be attached to it.");
}

// REFERENCE: https://html.spec.whatwg.org/multipage/scripting.html#the-script-element

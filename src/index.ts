import { version, buildTimeBuster } from "./build-info";
import { lowercaseFirstLetter } from "./common/helpers/string-helpers";
import zapdazWindow from "./global";
import { Page } from "./page";

const IN_BROWSER = navigator.userAgent !== "Node.js"; // Running in browser or test environment?

export class Index extends Page {
  private static namespace = "zapdaz";
  private static cid = "Index";
  public cid = Index.cid;
  private static logStyle = "background-color: #242424; color: #3c8200;";

  /**
   * Creates or returns a single instance of the Index
   * @param win - defaults to the browser's `window`, but may be replaced for unit testing
   */
  public static getInstance(win: zapdazWindow = window as zapdazWindow): Index {
    if (!Index.instance) Index.instance = new Index(win);
    return Index.instance;
  }

  private static instance: Index;
  private constructor(win: zapdazWindow) {
    super();

    if (IN_BROWSER) console.log(`%c${this.cid} v${version}_b${buildTimeBuster}`, Index.logStyle);
    const msg = {
      settingNamespace: `%c - setting window.zapdaz = {}`,
      existingInstance: `%c - window.zapdaz.${lowercaseFirstLetter(this.cid)} already has attached index`,
      assigningIndex: `%c - assigning ${this.cid} instance to window.zapdaz.${lowercaseFirstLetter(this.cid)}`,
      undefinedWindow: `%c${Index.cid}: window is not defined.  Insure your environment establishes a window and DOM.`,
    };

    // Attach instance to window for easy, script-tag integration into existing
    // products. For example, `window.zapdaz.index.init()`
    if (typeof win !== "undefined") {
      win.zapdaz = win.zapdaz || {};
      if (win.zapdaz[lowercaseFirstLetter(this.cid)]) {
        console.info(msg.existingInstance, Index.logStyle);
      } else {
        if (navigator.userAgent !== "Node.js") console.info(msg.assigningIndex, Index.logStyle);
        win.zapdaz[lowercaseFirstLetter(this.cid)] = this;
      }
    } else {
      console.warn(msg.undefinedWindow, Index.logStyle);
    }
  }

  public init(): boolean {
    console.log(`${this.cid}.init()`);

    document.addEventListener("DOMContentLoaded", () => {
      const versionableLinks = document.querySelectorAll("#manual-app-test, #manual-select-app-test");
      versionableLinks?.forEach((link) => {
        link?.setAttribute("href", link.getAttribute("href") + `?build=v${version}_b${buildTimeBuster}`);
        link.innerHTML = link.innerHTML + `?build=v${version}_b${buildTimeBuster}`;
      });
    });

    return super.init();
  }
}

const index = Index.getInstance();
index.init();

import { Page } from "./page";
import "./example-2.scss";
import { version, buildTimeBuster } from "./build-info";

export class Example2 extends Page {
  cid = "Example2";

  constructor() {
    super();
    console.log(`${this.cid}() v=${version} b=${buildTimeBuster}`);
  }

  public init(): boolean {
    console.log(`${this.cid}.init()`);
    return super.init();
  }
}

const example2 = new Example2();
example2.init();

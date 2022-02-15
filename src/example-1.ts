import { version, buildTimeBuster } from "./build-info";
import { lowercaseFirstLetter } from "./common/helpers/string-helpers";
import zapdazWindow from "./global";

import { Scene, PerspectiveCamera, WebGLRenderer, MeshBasicMaterial, Mesh } from "three";

import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry";
import { ParametricGeometries } from "three/examples/jsm/geometries/ParametricGeometries";

const IN_BROWSER = navigator.userAgent !== "Node.js"; // Running in browser or test environment?

export class Example1 {
  private static namespace = "zapdaz";
  private static cid = "Example1";
  public cid = Example1.cid;
  private static logStyle = "background-color: #242424; color: #3c8200;";

  /**
   * Creates or returns a single instance of the Example1
   * @param win - defaults to the browser's `window`, but may be replaced for unit testing
   */
  private static instance: Example1;
  public static getInstance(win: zapdazWindow = window as zapdazWindow): Example1 {
    if (!Example1.instance) Example1.instance = new Example1(win);
    return Example1.instance;
  }

  private constructor(win: zapdazWindow) {
    if (IN_BROWSER) console.log(`%c${this.cid} v${version}_b${buildTimeBuster}`, Example1.logStyle);
    const msg = {
      settingNamespace: `%c - setting window.zapdaz = {}`,
      existingInstance: `%c - window.zapdaz.${lowercaseFirstLetter(this.cid)} already has attached example1`,
      assigningExample1: `%c - assigning ${this.cid} instance to window.zapdaz.${lowercaseFirstLetter(this.cid)}`,
      undefinedWindow: `%c${Example1.cid}: window is not defined.  Insure your environment establishes a window and DOM.`,
    };

    // Attaches instance to window for easy, script-tag integration into existing
    // products. For example, `window.zapdaz.example1.init()`
    if (typeof win !== "undefined") {
      if (typeof win.zapdaz === "undefined") {
        if (IN_BROWSER) console.info(msg.settingNamespace, Example1.logStyle);
        win.zapdaz = {};
      }
      if (win.zapdaz[lowercaseFirstLetter(this.cid)]) {
        console.info(msg.existingInstance, Example1.logStyle);
      } else {
        if (IN_BROWSER) console.info(msg.assigningExample1, Example1.logStyle);
        win.zapdaz[lowercaseFirstLetter(this.cid)] = this;
      }
    } else {
      console.warn(msg.undefinedWindow, Example1.logStyle);
    }
  }

  init(): Promise<boolean> {
    return new Promise((resolve) => {
      const scene = new Scene();
      const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);
      const geometry = new ParametricGeometry(ParametricGeometries.klein, 25, 25);
      const material = new MeshBasicMaterial({ color: 0x00ff00 });
      const klein = new Mesh(geometry, material);
      scene.add(klein);
      // const geometry = new BoxGeometry();
      // const material = new MeshBasicMaterial({ color: 0x00ff00 });
      // const cube = new Mesh(geometry, material);
      // scene.add(cube);
      camera.position.z = 25;
      function animate() {
        requestAnimationFrame(animate);
        klein.rotation.x += 0.01;
        klein.rotation.y += 0.01;

        // cube.rotation.x += 0.01;
        // cube.rotation.y += 0.01;
        renderer.render(scene, camera);
      }
      animate();
      resolve(true);
    });
  }
}

const example1 = Example1.getInstance();
example1.init();

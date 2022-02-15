/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    // Global namespace var to support ES5, non-module capable, existing products
    zapdaz: any;
  }
}

interface zapdazWindow extends Window {
  zapdaz: any;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export default zapdazWindow;

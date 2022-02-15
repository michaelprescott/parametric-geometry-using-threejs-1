export class Page {
  public cid = "Page";

  get [Symbol.toStringTag](): string {
    return this.cid;
  }

  get isInitialized(): boolean {
    return this._isInitialized;
  }

  get isActivated(): boolean {
    return this._isActivated;
  }

  private _isInitialized = false;
  private _isActivated = false;

  constructor() {
    //console.log(`${this.cid}(): ${Object.prototype.toString.call(this)}`);
  }

  /**
   * Run processes that should be completed before activate()
   */
  public init(): boolean {
    return (this._isInitialized = true);
  }

  /**
   * Run only after the DOM is ready to manipulate DOM elements
   */
  public activate(): boolean {
    return (this._isActivated = true);
  }

  /**
   * Remove listeners from DOM elements; deconstruct dynamic DOM elements
   */
  public deactivate(): boolean {
    return (this._isActivated = false);
  }
}

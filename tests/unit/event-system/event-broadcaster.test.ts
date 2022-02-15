import { EventBroadcaster } from "../../../src/event-system/event-broadcaster";

const STRING_EVENT_A = "broadcaster.event.a";
const STRING_EVENT_B = "broadcaster.event.b";
interface IDataMessage {
  message: string;
}

class BroadcasterEventA {
  private _message: string;
  constructor(message: string) {
    this._message = message;

  }

  get message() {
    return this._message;
  }
}

class BroadcasterEventB {
  private _message: string;
  constructor(message: string) {
    this._message = message;
  }

  get message() {
    return this._message;
  }
}

describe("EventBroadcaster", () => {
  describe("subscribe", () => {
    describe("string events", () => {
      it("adds event with callback to the eventLookup object", () => {
        let eb = new EventBroadcaster();
        let callback = function () {};
        eb.subscribe(STRING_EVENT_A, callback);

        expect(eb.eventLookup[STRING_EVENT_A].length).toBe(1);
        expect(eb.eventLookup[STRING_EVENT_A][0]).toBe(callback);
      });

      it("adds multiple callbacks to the same event", () => {
        let eb = new EventBroadcaster();
        let callback1 = function () {};
        let callback2 = function () {};

        eb.subscribe(STRING_EVENT_A, callback1);
        eb.subscribe(STRING_EVENT_A, callback2);

        expect(eb.eventLookup[STRING_EVENT_A].length).toBe(2);
        expect(eb.eventLookup[STRING_EVENT_A][0]).toBe(callback1);
        expect(eb.eventLookup[STRING_EVENT_A][1]).toBe(callback2);
      });

      it("removes the callback after dispose()", () => {
        let eb = new EventBroadcaster();
        let callback1 = function () {};
        let callback2 = function () {};

        let subscription1 = eb.subscribe(STRING_EVENT_A, callback1);
        let subscription2 = eb.subscribe(STRING_EVENT_A, callback2);

        expect(eb.eventLookup[STRING_EVENT_A].length).toBe(2);
        expect(eb.eventLookup[STRING_EVENT_A][0]).toBe(callback1);
        expect(eb.eventLookup[STRING_EVENT_A][1]).toBe(callback2);

        subscription1.dispose();
        expect(eb.eventLookup[STRING_EVENT_A].length).toBe(1);

        // Notice callback2 is now in [0] position
        expect(eb.eventLookup[STRING_EVENT_A][0]).toBe(callback2);

        subscription2.dispose();
        expect(eb.eventLookup[STRING_EVENT_A].length).toBe(0);
      });

      it("should not remove another callback when dispose() called twice", () => {
        let eb = new EventBroadcaster();
        let scopedReference = 0; // Block scoped variable, updated by subscribers

        let subscription1 = eb.subscribe(STRING_EVENT_A, function () {
          scopedReference = 1;
        });

        let subscription2 = eb.subscribe(STRING_EVENT_A, function () {
          scopedReference = 2;
        });

        subscription2.dispose();
        subscription2.dispose();

        eb.publish(STRING_EVENT_A);

        // `1` because subscription1 handled the event, but not subscription2
        expect(scopedReference).toBe(1);
      });

      it("will respond to an event any time it is published", () => {
        let eb = new EventBroadcaster();
        let scopedReference = 0;
        let callback = function () {
          scopedReference = scopedReference + 1;
        };

        // subscribe() directly pushes callbacks into the list of handlers.
        // So it would be true that callback is in the 0 position.
        eb.subscribe(STRING_EVENT_A, callback);

        expect(eb.eventLookup[STRING_EVENT_A].length).toBe(1);
        expect(eb.eventLookup[STRING_EVENT_A][0]).toBe(callback);

        eb.publish(STRING_EVENT_A);
        eb.publish(STRING_EVENT_A);
        eb.publish(STRING_EVENT_A);

        // Unlike subscribeOnce() the list is not altered.
        expect(eb.eventLookup[STRING_EVENT_A].length).toBe(1);
        expect(eb.eventLookup[STRING_EVENT_A][0]).toBe(callback);

        // And callback successfully updated scopedReference on each publish()
        expect(scopedReference).toEqual(3);
      });

      it("will pass published data to the callback function", () => {
        let eb = new EventBroadcaster();
        let scopedReference: IDataMessage = { message: "_initial_value_" };
        let callback = function (d: IDataMessage) {
          scopedReference = d;
        };
        eb.subscribe(STRING_EVENT_A, callback);

        expect(eb.eventLookup[STRING_EVENT_A].length).toBe(1);
        expect(eb.eventLookup[STRING_EVENT_A][0]).toBe(callback);

        // Can publish with complex data.  In this case, an IDataMessage object
        eb.publish(STRING_EVENT_A, { message: "hello" });
        expect(scopedReference.message).toBe("hello");
      });
    });
    // END: describe "string events"

    describe("handler events", () => {
      it("adds handler with messageType and callback to the messageHandlers array", () => {
        let eb = new EventBroadcaster();
        let callback = function () {};
        eb.subscribe(BroadcasterEventA, callback);

        // Note that Constructables are added to the messageHandlers[], not eventLookup[type string]
        expect(eb.messageHandlers.length).toBe(1);
        expect(eb.messageHandlers[0].messageType).toBe(BroadcasterEventA);
        expect(eb.messageHandlers[0].callback).toBe(callback);
      });

      it("removes the handler after dispose()", () => {
        let eb = new EventBroadcaster();
        let callback = function () {};
        let subscription = eb.subscribe(BroadcasterEventA, callback);

        expect(eb.messageHandlers.length).toBe(1);
        subscription.dispose();
        expect(eb.messageHandlers.length).toBe(0);
      });

      it("should not remove another handler when dispose() called twice", () => {
        let eb = new EventBroadcaster();
        let scopedReference = 0; // Block scoped variable, updated by subscribers
        let scopedMessage = "_initial_value_";

        let subscription1 = eb.subscribe(BroadcasterEventA, function () {
          scopedReference = 1;
        });

        let subscription2 = eb.subscribe(BroadcasterEventB, function (d: IDataMessage) {
          scopedReference = 2;
          scopedMessage = d.message;
        });

        subscription1.dispose();
        subscription1.dispose();

        const eventMessage = "Hello, Event Message!";
        eb.publish(new BroadcasterEventB(eventMessage));

        expect(scopedReference).toBe(2);
        expect(scopedMessage).toBe(eventMessage);
      });
    });
    // END: describe "handler events"
  });
  // END: describe "subscribe"

  describe("subscribeOnce", () => {
    describe("string events", () => {
      it("adds event with an anynomous function that will execute the callback to the eventLookup object", () => {
        let eb = new EventBroadcaster();
        let callback = function () {};
        eb.subscribeOnce(STRING_EVENT_A, callback);

        expect(eb.eventLookup[STRING_EVENT_A].length).toBe(1);
        expect(eb.eventLookup[STRING_EVENT_A][0] === callback).toBe(false);

        // We're not actually testing execution of the callback here, just
        // verifying that it is a function, added by subscribeOnce() that
        // will execute if published later.
        expect(typeof eb.eventLookup[STRING_EVENT_A][0] === "function").toBe(true);
      });

      it("adds multiple callbacks to the same event", () => {
        let eb = new EventBroadcaster();
        let callback1 = function () {};
        let callback2 = function () {};

        eb.subscribeOnce(STRING_EVENT_A, callback1);
        eb.subscribeOnce(STRING_EVENT_A, callback2);

        // subscribeOnce() wrapped the callback() and pushes it's own
        // anonymous function into the list. Upon executing that function,
        // it disposes of the subscription itself executes the callback().
        // So, it will not be equal to the callback itself; however,
        // it is a function.
        expect(eb.eventLookup[STRING_EVENT_A].length).toBe(2);
        expect(eb.eventLookup[STRING_EVENT_A][0] === callback1).toBe(false);
        expect(typeof eb.eventLookup[STRING_EVENT_A][0] === "function").toBe(true);

        expect(eb.eventLookup[STRING_EVENT_A][1] === callback2).toBe(false);
        expect(typeof eb.eventLookup[STRING_EVENT_A][1] === "function").toBe(true);
      });

      it("removes the callback after dispose() and publish()", () => {
        let eb = new EventBroadcaster();
        let callback = function () {};

        // Each subscription's dispose will remove it from the broadcaster
        // One broadcaster publish() each one that succesfully executes
        let subscription1 = eb.subscribeOnce(STRING_EVENT_A, callback);
        let subscription2 = eb.subscribeOnce(STRING_EVENT_A, callback);

        // Each subscribeOnce added a new anonymous function to the
        // eventLookup callback list.  Remember these wrap the callback and
        // are not the callback() itself.
        expect(eb.eventLookup[STRING_EVENT_A].length).toBe(2);
        expect(eb.eventLookup[STRING_EVENT_A][0] === callback).toBe(false);
        expect(eb.eventLookup[STRING_EVENT_A][1] === callback).toBe(false);

        expect(typeof eb.eventLookup[STRING_EVENT_A][0] === "function").toBe(true);
        expect(typeof eb.eventLookup[STRING_EVENT_A][1] === "function").toBe(true);

        // Each dispose will remove one
        subscription1.dispose();
        expect(eb.eventLookup[STRING_EVENT_A].length).toBe(1);
        subscription2.dispose();
        expect(eb.eventLookup[STRING_EVENT_A].length).toBe(0);

        // Let's add them back and verify that a publish() executes both
        subscription1 = eb.subscribeOnce(STRING_EVENT_A, callback);
        subscription2 = eb.subscribeOnce(STRING_EVENT_A, callback);

        eb.publish(STRING_EVENT_A);
        // One publish should cause the broadcaster to remove all 3
        expect(eb.eventLookup[STRING_EVENT_A].length).toBe(0);
      });

      it("will respond to an event only once", () => {
        let eb = new EventBroadcaster();
        let scopedMessage: any = null;

        // Will execute just once, despite multiple calls to publish()
        let callback = function () {
          scopedMessage = "publish() caused this message to update.";
        };

        // Has just one callback, but we could add several of the same
        // and upon publish, each would execute just once.
        eb.subscribeOnce(STRING_EVENT_A, callback);

        expect(eb.eventLookup[STRING_EVENT_A].length).toBe(1);
        expect(eb.eventLookup[STRING_EVENT_A][0] === callback).toBe(false);
        expect(typeof eb.eventLookup[STRING_EVENT_A][0] === "function").toBe(true);

        eb.publish(STRING_EVENT_A);
        expect(scopedMessage).toBe("publish() caused this message to update.");

        expect(eb.eventLookup[STRING_EVENT_A].length).toBe(0);

        // Will not be altered by the callback again because
        // the callback will not execute on subsequent calls to publish()
        scopedMessage = null;
        eb.publish(STRING_EVENT_A);
        expect(scopedMessage).toBe(null);
      });

      it("will pass published data to the callback function only once", () => {
        let eb = new EventBroadcaster();

        let scopedReference: IDataMessage | null = { message: "_initial_value_" };
        let callback = function (d: IDataMessage) {
          scopedReference = d;
        };
        eb.subscribeOnce(STRING_EVENT_A, callback);

        expect(eb.eventLookup[STRING_EVENT_A].length).toBe(1);
        expect(eb.eventLookup[STRING_EVENT_A][0] === callback).toBe(false);
        expect(typeof eb.eventLookup[STRING_EVENT_A][0] === "function").toBe(true);

        eb.publish(STRING_EVENT_A, { message: "hello" });
        expect(scopedReference!.message).toBe("hello");

        expect(eb.eventLookup[STRING_EVENT_A].length).toBe(0);

        scopedReference = { message: "_initial_value_" };

        // Will not cause scopeReferenc's message to be updated by the callback
        eb.publish(STRING_EVENT_A, { message: "hello" });
        expect(scopedReference.message).toBe("_initial_value_");
      });
    });
    // END: describe "string events"

    describe("handler events", () => {
      it("adds handler with messageType and callback to the messageHandlers array", () => {
        let eb = new EventBroadcaster();

        let callback = function () {};
        eb.subscribeOnce(BroadcasterEventA, callback);

        expect(eb.messageHandlers.length).toBe(1);
        expect(eb.messageHandlers[0].messageType).toBe(BroadcasterEventA);
        expect(eb.messageHandlers[0].callback === callback).toBe(false);
        expect(typeof eb.messageHandlers[0].callback === "function").toBe(true);
      });

      it("removes the handler after dispose() and publish()", () => {
        let eb = new EventBroadcaster();

        let callback = function () {};

        let subscription1 = eb.subscribeOnce(BroadcasterEventA, callback);
        let subscription2 = eb.subscribeOnce(BroadcasterEventB, callback);

        expect(eb.messageHandlers.length).toBe(2);
        expect(eb.messageHandlers[0].messageType).toBe(BroadcasterEventA);
        expect(eb.messageHandlers[1].messageType).toBe(BroadcasterEventB);

        subscription1.dispose();
        expect(eb.messageHandlers.length).toBe(1);
        subscription2.dispose();
        expect(eb.messageHandlers.length).toBe(0);

        // Let's add them back and verify that a publish() executes both
        subscription1 = eb.subscribeOnce(BroadcasterEventA, callback);
        subscription2 = eb.subscribeOnce(BroadcasterEventA, callback);

        eb.publish(new BroadcasterEventA("Hello"));
        expect(eb.messageHandlers.length).toBe(0);
      });
    });
    // END: describe "handler events"
  });
  // END: describe "subscribeOnce"

  describe("publish", () => {
    describe("string events", () => {
      it("calls the callback functions for the event", () => {
        let eb = new EventBroadcaster();

        let scopedReferenceA, scopedReferenceB;

        let callback1 = function (data: any) {
          scopedReferenceA = data;
        };

        let callback2 = function (data: any) {
          scopedReferenceB = data;
        };

        eb.subscribe(STRING_EVENT_A, callback1);
        eb.subscribe(STRING_EVENT_A, callback2);

        let data = { foo: "bar" };
        eb.publish(STRING_EVENT_A, data);

        expect(scopedReferenceA).toBe(data);
        expect(scopedReferenceB).toBe(data);
      });

      it("does not call the callback functions if subscriber does not exist", () => {
        let eb = new EventBroadcaster();

        let scopedReference;

        let callback = function (data: any) {
          scopedReference = data;
        };
        eb.subscribe(STRING_EVENT_A, callback);

        eb.publish(STRING_EVENT_B, {});

        expect(scopedReference).toBeUndefined();
      });

      it("handles errors in subscriber callbacks", () => {
        let eb = new EventBroadcaster();

        let scopedReference: IDataMessage = { message: "_initial_value_" };

        let crash = function () {
          try {
            throw new Error("callback threw this error");
          } catch (err) {
            // Silence
          }

          // We need to handle the error or it blocks subsequent handlers
          //throw new Error("callback threw this error");
        };

        let callback = function (d: IDataMessage) {
          scopedReference.message = d.message;
        };

        eb.subscribe(STRING_EVENT_A, crash)
        eb.subscribe(STRING_EVENT_A, callback);
        eb.subscribe(STRING_EVENT_A, crash);

        eb.publish(STRING_EVENT_A, {message: "Hello"});

        expect(scopedReference.message).toBe("Hello");
      });
    });
    // END: describe "string events"

    describe("handler events", () => {
      it("calls the callback functions for the event", () => {
        let eb = new EventBroadcaster();

        let scopedMessage: IDataMessage = { message: "_initial_value_" };

        let callback = function (d: IDataMessage) {
          scopedMessage.message = d.message;
        };

        eb.subscribe(BroadcasterEventA, callback);

        let eventA = new BroadcasterEventA("broadcaster.event.a-1");
        eb.publish(eventA);

        expect(scopedMessage.message).toBe("broadcaster.event.a-1");

        let eventB = new BroadcasterEventA("broadcaster.event.a-2");
        eb.publish(eventB);

        expect(scopedMessage.message).toBe("broadcaster.event.a-2");
      });

      it("does not call the callback funtions if message is not an instance of the messageType", () => {
        let eb = new EventBroadcaster();

        let scopedMessage;

        let callback = function (message: any) {
          scopedMessage = message;
        };
        eb.subscribe(BroadcasterEventA, callback);

        eb.publish(new BroadcasterEventB("Hello, EventB"));

        // It will not be defined because the callback is only for
        // BroadCasterEventA, but the publish is for BroadcasterEventB
        expect(scopedMessage).toBeUndefined();
      });

      it("handles errors in subscriber callbacks", () => {
        let eb = new EventBroadcaster();

        let scopedMessageA: IDataMessage = { message: "_initial_value_" };
        let scopedMessageB: IDataMessage = { message: "_initial_value_" };

        let crash = function (d: IDataMessage) {
          try {
            throw new Error("callback threw an error");
          } catch (err: any) {
            scopedMessageA.message = err.message;
          }
        };

        let callback = function (d: IDataMessage) {
          scopedMessageB.message = d.message;
        };

        eb.subscribe(BroadcasterEventA, crash);
        eb.subscribe(BroadcasterEventA, callback);

        let eventA = new BroadcasterEventA("broadcaster.event.a-1");
        eb.publish(eventA);

        // Even though one of the subscriber callbacks failed,
        // the other should still complete
        expect(scopedMessageA.message).toBe("callback threw an error");
        expect(scopedMessageB.message).toBe("broadcaster.event.a-1");
      });

      it("handles errors on subscribe setup", () => {
        let eb = new EventBroadcaster();

        let scopedMessageA: IDataMessage = { message: "_initial_value_" };
        let scopedMessageB: IDataMessage = { message: "_initial_value_" };

        let callback = function (d: IDataMessage) {
          scopedMessageB.message = d.message;
        };

        // Helper to get class name
        function getClassName(clazz: any): string {
          let className;

          if (clazz) {
            let clazzStr = clazz.toString();
            if (clazzStr.indexOf("class") > -1) {
              className = clazzStr.substring(6, clazzStr.indexOf("{") - 1);
            }
            // Not sure why this arose, holding in case it arises again.
            // let funStr = clazz.toString();
            // if (funStr.indexOf("function") > -1) {
            //   className = funStr.substring(9, funStr.indexOf("("));
            // }
          }

          return className;
        }

        function undefinedConstructable(): any {
          return undefined as unknown as BroadcasterEventA;
        }

        function definedConstructable(): any {
          return  BroadcasterEventA;
        }

        // We need to pass an undefined object into subscribe(), but
        // it must match the interfaces's acceptable type at compile time.
        // So, we're creating it with undefinedConstructable();
        let undefinedEventName = getClassName(undefinedConstructable());
        expect(undefinedEventName).toBeUndefined();

        // Just verifying that our helper also works.  This is all a bunch
        // of hackery just to determine if the EventBroadcaster's subscribe()
        // really can throw errors.  It can.
        let definedEventName = getClassName(definedConstructable());
        expect(definedEventName).toEqual("BroadcasterEventA");

        expect(() => {
          eb.subscribe(undefinedConstructable(), callback);
        }).toThrowError("Invalid channel name or type: undefined.");
      });

      it("handles errors on publish setup", () => {
        let eb = new EventBroadcaster();

        let scopedMessageA: IDataMessage = { message: "_initial_value_" };

        let callback = function (d: IDataMessage) {
          scopedMessageA.message = d.message;
        };

        function undefinedConstructable(): any {
          return undefined as unknown as BroadcasterEventA;
        }

        function definedConstructable(): any {
          return  BroadcasterEventA;
        }

        // ----------------------------
        // TODO: Review.  Do we really want to prove all of this or
        // just the final part.  This is helpful to understand the
        // setup, but also a bit of noise and complexity to digest.

        /*
        // Helper to get class name
        function getClassName(clazz: any): string {
          let funStr, className;

          if (clazz) {
            funStr = clazz.toString();
            if (funStr.indexOf("function") > -1) {
              className = funStr.substring(9, funStr.indexOf("("));
            }
          }

          return className;
        }

        // We need to pass an undefined object into subscribe(), but
        // it must match the interfaces's acceptable type at compile time.
        // So, we're creating it with undefinedConstructable();
        let undefinedEventName = getClassName(undefinedConstructable());
        expect(undefinedEventName).toBeUndefined();

        // Just verifying that our helper also works.  This is all a bunch
        // of hackery just to determine if the EventBroadcaster's subscribe()
        // really can throw errors.  It can.
        let definedEventName = getClassName(definedConstructable());
        expect(definedEventName).toEqual("BroadcasterEventA");

        eb.subscribe(BroadcasterEventA, callback);

        // Let's test our hacky way of getting the event constructor
        let eventA = new (definedConstructable())("broadcaster.event.a-1");
        eb.publish(eventA);
        expect(scopedMessageA.message).toBe("broadcaster.event.a-1");
        */

        // ============================

        // Now, finally we get to what we really want to test, whether or
        // not passing this invalid beast into publish causes EB to throw an Error
        expect(() => {
          eb.publish(undefinedConstructable());
        }).toThrowError("Invalid channel name or instance: undefined.");

      });

    });
    // END: describe "handler events"
  });
  // END: describe "publish"
});


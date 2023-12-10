// Logic how it woks https://github.com/segunadebayo/egghead-zagjs-course/tree/05-create-logic-in-zag

import { createMachine } from "@zag-js/core";

// state or target the main of general state
type MachineState = {
  value: "idle" | "focused";
};

// context
type MachineContext = {
  name?: string, // name of form / app
  value: string[]; // input of value string
  focusedIndex: number;
  readonly isCompleted: boolean; // to define is it input is filled
  onComplete?: (value: string[]) => void; // func for callback after invokeOnComplete
};


// options is a params parsing by user needed to parsing into context value
export type MachineOptions = {
  name?: string,
  value?: string[];
  onComplete?: (value: string[]) => void;
  numberOfFields: number;
}

// kindly like modeling the logical how it's works
export function machine(options: MachineOptions) {
  const {numberOfFields, ...restOptions } = options
  return createMachine<MachineContext, MachineState>(
    {
      id: "pin-input",
      context: {
        value: Array.from<string>({ length: numberOfFields }).fill(""),
        ...restOptions,
        focusedIndex: -1,

        // Remmoved : couse there have functions from params
        // onComplete(value) {
        //   console.log({ value });
        // },
      },
      // to computed the context // logic from the readonly state
      computed: {
        isCompleted(ctx) {
          return ctx.value.every((value) => value !== "");
        },
      },
      // allow to define side effect for the context value
      watch: {
        focusedIndex: ["executeFocus"],
        isCompleted: ["invokeOnComplete"], // to watch or stream computed state isCompleted changes // func to handle completed state
      },
      initial: "idle", // initial value
      states: {
        idle: {
          // function when that state on
          on: {
            // customize event handler FOKUS => for the transition into focused state
            FOCUS: {
              target: "focused",
              actions: ["setFocusedIndex"], // state focusedIndex => set
            },
            LABEL_CLICK: {
              actions: ["focusedFirstInput"],
            },
          },
        },
        focused: {
          on: {
            BLUR: {
              target: "idle",
              actions: ["clearFocusedIndex"], // state focusedIndex => clear
            },
            INPUT: {
              actions: ["setFocusedValue", "focusNextInput"],
            },
            BACKSPACE: {
              actions: ["clearFocusedValue", "focusedPreviousInput"],
            },
            PASTE: {
              actions: ["setPastedValue", "focusLastEmptyInput"],
            },
          },
        },
      },
    },
    // this is function or action representation actions string from above the kind of the type of actions // representation function from action keys to execute to set the context
    {
      actions: {
        setFocusedIndex(context, event) {
          // fyi: event is receive from send function parameter
          context.focusedIndex = event.index;
        },
        clearFocusedIndex(context) {
          context.focusedIndex = -1;
        },

        //   action when input the string
        setFocusedValue(context, event) {
          // need focused index, set the value at index
          // logic to handle multipke character inputed even before / after

          const eventValue: string = event.value;
          const focusedValue = context.value[context.focusedIndex];
          const nextValue = getNextValue(focusedValue, eventValue); // function handle multiple
          context.value[context.focusedIndex] = nextValue;
        },
        focusNextInput(context) {
          // get the index, index ++
          // set the  focused index
          const nextIndex = Math.min(
            context.focusedIndex + 1,
            context.value.length - 1 // focus for index of value
          );

          context.focusedIndex = nextIndex;
        },
        //   Side effect function
        executeFocus(context) {
          const inputGroup = document.querySelector("[data-part=input-group]");
          // ignore if input group undifined & is a firs input which is focusindex equals -1
          if (!inputGroup || context.focusedIndex === -1) return;
          const inputElements = Array.from(
            inputGroup.querySelectorAll<HTMLInputElement>("[data-part=input]")
          );
          const input = inputElements[context.focusedIndex];

          // for scheduling set focus after all event previous executes & for handling multiple event call in the same time
          requestAnimationFrame(() => {
            input?.focus();
          });
        },

        //   action for backspace
        clearFocusedValue(context) {
          context.value[context.focusedIndex] = "";
        },
        focusedPreviousInput(context) {
          const previousIndex = Math.max(0, context.focusedIndex - 1);
          context.focusedIndex = previousIndex;
        },

        // action for paste
        setPastedValue(context, event) {
          const pastedValue: string[] = event.value
            .split("")
            .slice(0, context.value.length);

          pastedValue.forEach((value, index) => {
            context.value[index] = value;
          });
        },
        focusLastEmptyInput(context) {
          // find index empty
          const index = context.value.findIndex((value) => value === "");
          const lastIndex = context.value.length - 1;
          context.focusedIndex = index === -1 ? lastIndex : index; // ccheck if input filled also
        },
        // another acts
        invokeOnComplete(context) {
          if (!context.isCompleted) return;
          context.onComplete?.(Array.from(context.value));
        },
        // action label clicked
        focusedFirstInput(context) {
          context.focusedIndex = 0;
        },
      },
    }
  );
}

// "2", "29" => "9"
// "2", "92" => "9"
// "2", "2" => "2"
const getNextValue = (focusedValue: string, eventValue: string) => {
  let nextValue = eventValue; // last cases / default
  // case input after prev value
  if (focusedValue[0] === eventValue[0]) {
    nextValue = eventValue[1];
  } else if (focusedValue[0] === eventValue[1]) {
    nextValue = eventValue[0];
  }
  return nextValue;
};

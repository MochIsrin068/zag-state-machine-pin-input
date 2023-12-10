/* eslint-disable @typescript-eslint/no-explicit-any */
import { createMachine } from "@zag-js/core"

// State Information
export const machine : any = createMachine({
  // initial state
  initial: "active",
  // the finite states
  states: {
    active: {
      on: {
        CLICK: {
          // go to inactive
          target: "inactive",
        },
      },
    },
    inactive: {
      on: {
        CLICK: {
          // go to active
          target: "active",
        },
      },
    },
  },
})

// Connext and actions into components
export const connect = (state: {
    matches : (key: string) => void
}, send: (key: string) => void)  => {
    const active = state.matches("active")
    return {
      active,
      buttonProps: {
        type: "button",
        role: "switch",
        "aria-checked": active,
        onClick() {
          send("CLICK")
        },
      },
    }
  }
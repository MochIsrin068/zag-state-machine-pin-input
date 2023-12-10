/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMachine } from "@zag-js/react"
import { machine, connect } from "./toggle.state-machine"

function Toggle() {
  const [state, send] = useMachine(machine)
  const api : any = connect(state, send)

  return (
    <button
      {...api.buttonProps}
      style={{
        width: "40px",
        height: "24px",
        borderRadius: "999px",
        background: api.active ? "green" : "gray",
      }}
    >
      {api.active ? "ON" : "OFF"}
    </button>
  )
}


export default Toggle
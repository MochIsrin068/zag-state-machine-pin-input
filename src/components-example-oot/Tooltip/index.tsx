import * as tooltip from "@zag-js/tooltip"
import { useMachine, normalizeProps } from "@zag-js/react"

function Tooltip() {
  const [state, send] = useMachine(tooltip.machine({ id: "1" }))

  const api = tooltip.connect(state, send, normalizeProps)

  return (
    <>
      <button {...api.triggerProps}>Hover me</button>
      {api.isOpen && (
        <div {...api.positionerProps}>
          <div {...api.contentProps}>Tooltip</div>
        </div>
      )}
    </>
  )
}

export default Tooltip
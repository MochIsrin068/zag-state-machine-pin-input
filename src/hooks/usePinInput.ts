import { ComponentProps } from "react";
import { MachineOptions, machine } from "../machine";
import { useMachine } from "@zag-js/react";

type LabelProps = ComponentProps<"label"> & { "data-part": string }; // type component label & custome attribute data-part
type InputProps = ComponentProps<"input"> & { "data-part": string };

export default function usePinInput(options: MachineOptions) {
  const [state, send] = useMachine(machine(options));
  const { value, name } = state.context;
  const valueAsString = value.join("")

  return {
    value,
    valueAsString,
    state,
    
    getLabelProps(): LabelProps {
      return {
        "data-part": "label",
        onClick() {
          send({
            type: "LABEL_CLICK",
          });
        },
      };
    },
    getHiddenInputProps(): InputProps {
      return {
        "data-part": "hidden-input", // this property require on InputProps
        name,
        type: "hidden",
        value: value.join(""),
      };
    },
    getInputProps({ index }: { index: number }): InputProps {
      return {
        "data-part": "input",
        maxLength: 2,
        value: value[index],
        onChange(event) {
          const { value } = event.target;
          send({
            type: "INPUT",
            index,
            value,
          });
        },
        onFocus() {
          send({
            type: "FOCUS",
            index,
          });
        },
        onBlur() {
          send({
            type: "BLUR",
          });
        },
        onKeyDown(event) {
          const { key } = event;
          if (key === "Backspace") {
            send({
              type: "BACKSPACE",
              index,
            });
          }
        },
        onPaste(event) {
          event.preventDefault(); // to breal the default behavior that event
          const value = event.clipboardData.getData("Text").trim(); // makesure that value not have space / trim
          send({
            type: "PASTE",
            value,
            index,
          });
        },
      };
    },
  };
}

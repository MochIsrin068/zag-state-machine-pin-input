// source of code : https://github.com/segunadebayo/egghead-zagjs-course
import "./App.css";
import usePinInput from "./hooks/usePinInput";

function App() {
  // data-part jus for styling & define each components

  const { value, state, getLabelProps, getHiddenInputProps, getInputProps } =
    usePinInput({
      numberOfFields: 4,
      name: "pincode",
      onComplete(value) {
        console.log("input value is completed", { value });
      },
    });

  return (
    <>
      <div className="App">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            console.log(formData.get("pincode"));
          }}
        >
          <div data-part="container">
            <label {...getLabelProps()}>Enter Verification</label>
            {/* Input Hidden for provide to the form // value from value combining */}
            <input {...getHiddenInputProps()} />
            {/* End */}
            <div data-part="input-group">
              {value.map((_, index) => (
                <input key={index} {...getInputProps({ index })} />
              ))}
            </div>
          </div>
          {/* button to trigger form submit */}
          <button type="submit">Submit</button>
        </form>
        {/* for testing: just show the code & how it works */}
        <pre>{stringify(state)}</pre>
      </div>
    </>
  );
}

function stringify(state: Record<string, any>) {
  const { value, event, context } = state;
  return JSON.stringify({ state: value, event, context }, null, 2);
}

export default App;

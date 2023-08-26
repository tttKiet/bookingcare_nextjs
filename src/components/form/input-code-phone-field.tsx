import ReactCodeInput from "react-code-input";
export interface InputCodePhoneProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  isValid: boolean;
}

export function InputCodePhone({
  label,
  value,
  isValid,
  onChange,
}: InputCodePhoneProps) {
  // const props =
  const inputStyle = {
    // fontFamily: "monospace",
    margin: "4px",
    // MozAppearance: "textfield",
    borderRadius: "4px",
    fontSize: "14px",
    height: "26px",
    width: "30px",
    padding: "10px",
    // backgroundColor: "black",
    outline: "none",
    color: "black",
    border: "1px solid lightskyblue",
  };
  const inputStyleInvalid = {
    // fontFamily: "monospace",
    margin: "4px",
    // MozAppearance: "textfield",
    borderRadius: "4px",
    fontSize: "14px",
    height: "26px",
    width: "30px",
    padding: "10px",
    // backgroundColor: "black",
    outline: "none",
    color: "black",
    border: "1px solid red",
  };

  // };
  return (
    <div
      className={`border rounded-lg border-while py-2 pt-8 px-3 relative flex items-center justify-center`}
    >
      <label
        className="absolute top-1 text-sm font-medium flex items-center gap-2 left-3"
        htmlFor=""
      >
        {label}
      </label>
      <ReactCodeInput
        type="tel"
        value={value}
        onChange={onChange}
        fields={6}
        inputMode="numeric"
        name="tel"
        isValid={isValid}
        inputStyle={inputStyle}
        inputStyleInvalid={inputStyleInvalid}
      />
    </div>
  );
}

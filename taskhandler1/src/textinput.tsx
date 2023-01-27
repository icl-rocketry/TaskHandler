import React, {useState} from "react";

// Creat an ElementMaker component
function TextInput(props: { text: string, inputMode: boolean, returnFunction: ((value:string) =>void)}) {
    var defValue = props.text
    const [value, setValue] = useState(props.text);
    const [inputMode, setInputMode] = useState(false);
    return (
        <span>
            {
                inputMode ? (
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={(e) => {
                            setInputMode(false)
                            setValue(defValue)
                        }}
                        onKeyDown = {(e) => {
                            if (e.key === 'Enter'){
                                setInputMode(false)
                                props.returnFunction(value)
                            }
                        }}
                        autoFocus
                    />
                ) : (
                    <span
                        onClick={(e) => {
                            setInputMode(true)
                            defValue = value
                        }}
                        style={{
                            display: "inline-block",
                            height: "25px",
                            minWidth: "300px",
                        }}
                    >
                        {value}
                    </span>
                )
            }
        </span>
    );
}
export default TextInput;
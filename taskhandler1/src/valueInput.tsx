import './valueInput.css';

// Creat an ElementMaker component
function ValueInput(
    props:{ 
        id:number, 
        itemsById:any,
        handleInputMode:((show: boolean) => void),
        handleChange: ((title:any) =>void),
        handleTypeChange: ((type:number) => void)}
    ){
    const item = props.itemsById[props.id]
    const initialInputMode = item.valueInputMode
    const initialValue = item.contains
    return (
        <ul className="valueMenu">
            <li className={typeof(initialValue) === "boolean" ? "valueItem selected" : "valueItem wrong"}>
                <span
                onClick={(e) => {
                    if(typeof(initialValue) === "boolean"){
                        props.handleChange(!item.contains)
                    } else {
                        props.handleTypeChange(0)
                    }
                    //defValue = value
                }}
                >
                 {typeof(initialValue) === "boolean" ?  item.contains.toString() :"true"}   
                </span>
            </li>
            <li className={typeof(initialValue) === "number" ? "valueItem numberItem selected" : "valueItem numberItem wrong"}>
            {
                    initialInputMode && typeof(initialValue) === "number"? (
                        <input
                            type="number"
                            value={item.contains}
                            onChange={(e) => {
                                //const value: number = e.target.value
                                props.handleChange(+e.target.value)
                                console.log(e.target.value)}}
                                onBlur={(e) => {
                                    console.log("<<")
                                    props.handleInputMode(false)
                            }}
                            onKeyDown = {(e) => {
                                if (e.key === 'Enter'){
                                    props.handleInputMode(false)
                                }
                            }}
                            autoFocus
                        />
                    ) : (
                        <div className="valueItem"
                            onClick={(e) => {
                                props.handleTypeChange(1)
                                //defValue = value
                            }}
                        >
                            {typeof(initialValue) === "number" ? item.contains : 0}
                        </div>
                    )
                }
            </li>
            <li className={typeof(initialValue) === "string" ? "valueItem selected stringItem" : "valueItem wrong stringItem"}>
                {
                    initialInputMode && typeof(initialValue) === "string"  ? (
                        <input
                            type="text"
                            value={item.contains}
                            onChange={(e) => props.handleChange(e.target.value)}
                            onBlur={(e) => {
                                console.log(">>")
                                props.handleInputMode(false)
                            }}
                            onKeyDown = {(e) => {
                                if (e.key === 'Enter'){
                                    props.handleInputMode(false)
                                }
                            }}
                            autoFocus
                        />
                    ) : (
                        <div className="stringItem"
                                onClick={(e) => {
                                    props.handleTypeChange(2)
                                    //defValue = value
                                }}
                            >
                                {typeof(initialValue) === "string" ? item.contains : "Input"}
                        </div>
                    )
                }
            </li>
        </ul>
    );
}
export default ValueInput;
import "./titleInput.css"

// Creat an ElementMaker component
function TitleInput(
    props:{ 
        id:number, 
        itemsById:any,
        handleInputMode:((show: boolean) => void),
        handleChange: ((title:string) =>void)}
    ){
    const item = props.itemsById[props.id]
    const initialInputMode = item.inputMode
    return (
        <span className="titleComponent">
            {
                initialInputMode ? (
                    <input
                        type="text"
                        value={item.title}
                        onChange={(e) => props.handleChange(e.target.value)}
                        onBlur={(e) => {
                            props.handleInputMode(false)
                        }}
                        onKeyDown = {(e) => {
                            if (e.key === 'Enter'){
                                props.handleInputMode(false)
                            }
                        }}
                        autoFocus
                        style={{
                            display: "inline-block",
                            height: "25px",
                            minWidth: "300px",
                        }}
                    />
                ) : (
                    <span
                        onClick={(e) => {
                            props.handleInputMode(true)
                        }}
                                                style={{
                            display: "inline-block",
                            height: "25px",
                            minWidth: "300px",
                        }}
                    >
                        {item.title}
                    </span>
                )
            }
        </span>
    );
}
export default TitleInput;
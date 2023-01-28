//import React, { useState } from 'react';
import './Editor.css';
import { useState } from 'react';
import inputJson from './inputJson';
import TitleInput from './titleInput';
import ValueInput from './valueInput';

function Editor() {
    var initialIndex = 1
    const initItems: any = {
        0:{
            id: 0,
            title: '(Root)',
            contains: null,
            inputMode: false,
            childIds: []
        }
    }

    //Normalizes the input json for easy state use
    function populateInitItems(items: any, parentId: number): void {
        Object.keys(items).map((key, i) => {
            initItems[initialIndex] = {
                id: initialIndex,
                title: key,
                contains: items[key] instanceof Object ? null : items[key],
                inputMode: false,
                valueInputMode: false,
                childIds: []
            }
            initItems[parentId].childIds.push(initialIndex);
            initialIndex = initialIndex + 1
            if(items[key] instanceof Object) populateInitItems(items[key], initialIndex - 1)
            return null;
        })
    }
    populateInitItems(inputJson, 0);

    const [items, setItems] = useState(initItems)

    function formatJson(id: number): any{
        var newArray:any = {}
        items[id].childIds.map((id:number) => {
            if(items[id].childIds.length === 0){
                newArray[items[id].title] = items[id].contains   
            } else {
                newArray[items[id].title] = formatJson(id)
            }
            return null
        })
        return newArray
    }

    return (
        <div className="Editor">
            <div className="mainTable">
                <div className='tableElements'> <h1>Input</h1> <pre className="outputJson"><code>{JSON.stringify(inputJson, null, 2)}</code></pre></div>
                <div className='tableElements'>
                    <ul>
                        {items[0].childIds.map((id:number) =>
                            (
                                <ItemsTree
                                    id={id}
                                    parentId = {0}
                                    itemsById={items}
                                    setItems={setItems}
                                />
                            )
                        )}
                    </ul>
                </div>
                <div className='tableElements'> <h1>Output</h1> <pre className="outputJson"><code>{JSON.stringify(formatJson(0), null, 2)}</code></pre></div>
            </div>
        </div>
    );
}

function ItemsTree({ id, parentId, itemsById, setItems} : ({id:number, parentId:number, itemsById:any, setItems:React.Dispatch<any>})) {
    const item = itemsById[id];
    const childIds: number[] = item.childIds;

    const handleTitleInputMode = (show: boolean) => {
        setItems({...itemsById, [id]:{...itemsById[id], inputMode:show}})
    }
    const handleTitleChange = (title: string) => {
        setItems({...itemsById, [id]:{...itemsById[id], title:title}})
    }
    const handleValueInputMode = (show: boolean) => {
        setItems({...itemsById, [id]:{...itemsById[id], valueInputMode:show}})
    }
    const handleValueChange = (value: any) => {
        setItems({...itemsById, [id]:{...itemsById[id], contains:value}})
    }
    const handleTypeChange = (type: number) => {
        console.log(type)
        switch (type){
            case 0: 
                setItems({...itemsById, [id]:{...itemsById[id], contains:true}})
                break
            case 1:
                setItems({...itemsById, [id]:{...itemsById[id], contains:0, valueInputMode:true}})
                break
            case 2:
                setItems({...itemsById, [id]:{...itemsById[id], contains:"", valueInputMode:true}})
                break
        }
    }
    
    if (childIds.length > 0) {
        return (
            <li key={id} className="item parentItem">
                <TitleInput id={id} itemsById={itemsById} handleInputMode={handleTitleInputMode} handleChange={handleTitleChange} />
                <ul className='parentItem'>
                    {childIds.map(childId => (
                    <ItemsTree
                        id={childId}
                        parentId={id}
                        itemsById={itemsById}
                        setItems={setItems}
                    />
                    ))}
                </ul>
            </li>
        )
    } else {
        return <li key={id} className="item" draggable>
            <TitleInput id={id} itemsById={itemsById} handleInputMode={handleTitleInputMode} handleChange={handleTitleChange} />
            <ValueInput id={id} itemsById={itemsById} handleInputMode={handleValueInputMode} handleChange={handleValueChange} handleTypeChange={handleTypeChange} />

        </li>
    }
  }

export default Editor;
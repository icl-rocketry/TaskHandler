//import React, { useState } from 'react';
import logo from './logo.svg';
import './Editor.css';
import TextInput from './textinput';
import { useState } from 'react';

var debugText = `{
  "task_name": "fc_telemetry",
  "autostart": false,
  "poll_delta": 500,
  "running": true,
  "logger": true,
  "receiveOnly":false,
  "request_config": {
      "source": 1,
      "destination": 0,
      "destination_service": 2,
      "command_id": 8,
      "command_arg": 0
  },
  "packet_descriptor": {
      "pn": "float",
      "pe": "float",
      "pd": "float",
      "vn": "float",
      "ve": "float",
      "vd": "float",
      "an": "float",
      "ae": "float",
      "ad": "float",
      "roll": "float",
      "pitch": "float",
      "yaw": "float",
      "q0": "float",
      "q1": "float",
      "q2": "float",
      "q3": "float",
      "lat": "float",
      "lng": "float",
      "alt": "int",
      "sat": "uint8_t",
      "ax": "float",
      "ay": "float",
      "az": "float",
      "h_ax": "float",
      "h_ay": "float",
      "h_az": "float",
      "gx": "float",
      "gy": "float",
      "gz": "float",
      "mx": "float",
      "my": "float",
      "mz": "float",
      "baro_temp": "float",
      "baro_press": "float",
      "baro_alt": "float",
      "batt_voltage": "uint16_t",
      "batt_percent": "uint16_t",
      "launch_lat": "float",
      "launch_lng": "float",
      "launch_alt": "int",
      "system_status": "uint32_t",
      "system_time": "uint64_t",
      "rssi": "int16_t",
      "snr": "float"
  },
  "rxCounter": 0,
  "txCounter": 0,
  "connected": true,
  "lastReceivedPacket": ""
}`

class jsonItem {
  public value: string
  public nested: boolean
  public inside: jsonItem[]
  constructor(
    public key:string,
    public inputValue:any
    ){
      this.value = ""
      this.nested = false
      this.inside = []
      if(inputValue instanceof Object){
        this.nested = true
        Object.keys(inputValue).map(key =>
          this.inside.push(new jsonItem(key, inputValue[key]))
        )
        //console.log(this.inside)
      } else {
        this.value = String(inputValue)
      }
    }
}

function createList(items: jsonItem[], totalItems: jsonItem[], iter:number, setItemArray:((itemArray:jsonItem[]) => void)){
  return (
    <ul className={items !== totalItems ? "nestedList" : ""}>
    {items.map(function(item, i){
      if(!item.nested){
        var [key, setKey] = useState(item.key);
        var updateKey = (value:string) => {
          setKey(value)
          if(items === totalItems){
            totalItems[i].key = value
            setItemArray(totalItems)
          } else{
            totalItems[iter].inside[i].key = value
            setItemArray(totalItems)
          }
        }
        var [value, setValue] = useState(item.value);
        var updateValue = (value:string) => {
          setValue(value)
          if(items === totalItems){
            totalItems[i].value = value
            setItemArray(totalItems)
          } else{
            totalItems[iter].inside[i].value = value
            setItemArray(totalItems)
          }
        }
        return <li key={i} className="jsonListItem">
          <TextInput text={key} inputMode={false} returnFunction={updateKey}/> : 
          <TextInput text={value} inputMode={false} returnFunction={updateValue}/>
        </li>
      } else{
        return (
          <li key={i} className="jsonListItem jsonNestedListItem">{item.key}{createList(item.inside, totalItems, i ,setItemArray)}</li>
        )
      }
    }
    )}
  </ul>
  )
}

function Editor() {


  /*var curJson = JSON.parse(debugText, function(key, value) {
    jsonArray.push(new jsonItem(key, value));
    /*if(typeof(value)==="object"){
      console.log(value)
    }
  });*/

  var currentJson = JSON.parse(debugText)

  var startJson : jsonItem[] = []
  Object.keys(currentJson).map(key => startJson.push(new jsonItem(String(key), currentJson[key])))
  const [jsonArray, setJsonArray] = useState<jsonItem[]>(startJson)

  console.log(jsonArray)

  function rawJson(jsonArray : jsonItem[]): string {
    var newArray:any = {}
    jsonArray.map((item) => {
      if(!item.nested){
        newArray[item.key] = item.value
      } else {
        newArray[item.key] = {}
        item.inside.map((nestedItem) => {
          newArray[item.key][nestedItem.key] = nestedItem.value
        })
      }
    })
    return JSON.stringify(newArray, null, 2)
  }

  return (
    <div className="Editor">
      {/*<header className="Editor-header" >
        <img src={logo} className="App-logo" alt="logo" />
  </header>*/}
      <body>
        <div className="mainTable">
          <div className='tableElements'> <h1>Input</h1> <pre className="outputJson"><code>{debugText}</code></pre></div>
          <div className='tableElements'>{createList(jsonArray, jsonArray, 0, setJsonArray)}</div>
          <div className='tableElements'> <h1>Output</h1> <pre className="outputJson"><code>{rawJson(jsonArray)}</code></pre></div>
        </div>
      </body>
    </div>
  );
}

export default Editor;

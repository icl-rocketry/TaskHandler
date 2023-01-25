//import React, { useState } from 'react';
import logo from './logo.svg';
import './Editor.css';

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

function createList(items: jsonItem[]){
  return (
    <ul className="">
    {items.map(function(item, i){
      if(!item.nested){
        return <li key={i} className="jsonListItem">{item.key} : {item.value}</li>
      } else{
        return (
          <li key={i} className="jsonListItem jsonNestedListItem">{item.key}{createList(item.inside)}</li>
        )
      }
    }
    )}
  </ul>
  )
}

function Editor() {

  var jsonArray : jsonItem[] = [];

  /*var curJson = JSON.parse(debugText, function(key, value) {
    jsonArray.push(new jsonItem(key, value));
    /*if(typeof(value)==="object"){
      console.log(value)
    }
  });*/

  var currentJson = JSON.parse(debugText);

  Object.keys(currentJson).map(key =>
      jsonArray.push(new jsonItem(String(key), currentJson[key]))
    )

  //console.log(Object.values(JSON.parse(debugText)))

  return (
    <div className="Editor">
      <header className="Editor-header">
        <img src={logo} className="App-logo" alt="logo" />
        {createList(jsonArray)}
        <pre className="outputJson">
          <code>{debugText}</code>
        </pre>
      </header>
    </div>
  );
}

export default Editor;

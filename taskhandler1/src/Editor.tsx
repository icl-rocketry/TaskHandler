//import React, { useState } from 'react';
import './Editor.css';
import { useState } from 'react';
import inputJson from './inputJson';

function Editor() {
    const [task_name, set_task_name] = useState(inputJson.task_name);
    const [autostart, set_autostart] = useState(inputJson.autostart);
    const [poll_delta, set_poll_delta] = useState(inputJson.poll_delta);
    const [running, set_running] = useState(inputJson.running);
    const [logger, set_logger] = useState(inputJson.logger);
    const [receiveOnly, set_recieveOnly] = useState(inputJson.receiveOnly);
    const [rxCounter, set_rxCounter] = useState(inputJson.rxCounter);
    const [txCounter, set_txCounter] = useState(inputJson.txCounter);
    const [connected, set_connected] = useState(inputJson.connected);
    const [lastReceivedPacket, set_lastRecievedPacket] = useState(inputJson.lastReceivedPacket);
    const [request_config, set_request_config] = useState(inputJson.request_config)
    function init_descriptors(descriptors: any){
        const new_descriptor: any = {indicies:[]}
        var init_packetindex = 0
        Object.keys(descriptors).map(key => {
            new_descriptor[init_packetindex] = {
                id: init_packetindex,
                title: key,
                type: descriptors[key],
                open: false
            }
            new_descriptor["indicies"].push(init_packetindex)
            init_packetindex = init_packetindex + 1;
            return null
        })
        return new_descriptor
    }
    const [packet_descriptor, set_packet_descriptor] = useState(init_descriptors(inputJson.packet_descriptor))
    function outputJson() {
        const output = {
            task_name:task_name,
            autostart:autostart,
            poll_delta:poll_delta,
            running:running,
            logger:logger,
            receiveOnly:receiveOnly,
            request_config:{},
            packet_descriptor:{},
            rxCounter:rxCounter,
            txCounter:txCounter,
            connected:connected,
            lastReceivedPacket:lastReceivedPacket,
        }
        if(!receiveOnly) output.request_config=request_config

        packet_descriptor.indicies.map((id:number) => {
            output.packet_descriptor = {...output.packet_descriptor, [packet_descriptor[id].title]:packet_descriptor[id].type}
            return null
        })

        return output
    }
    return (
        <div className="Editor">
            <div className="mainTable">
                <div className='tableElements'> <h1>Input</h1> <pre className="outputJson"><code>{JSON.stringify(inputJson, null, 2)}</code></pre></div>
                <div className='tableElements editor-cell'>
                    <ul>
                        <Item title="task_name" state={task_name} setState={set_task_name}/>
                        <Item title="autostart" state={autostart} setState={set_autostart}/>
                        <Item title="poll_delta" state={poll_delta} setState={set_poll_delta}/>
                        <Item title="running" state={running} setState={set_running}/>
                        <Item title="logger" state={logger} setState={set_logger}/>
                        <Item title="recieveOnly" state={receiveOnly} setState={set_recieveOnly}/>
                        {!receiveOnly && <RequestConfig request_config={request_config} set_request_config={set_request_config}/>}
                        <PacketDescriptor packet_descriptor={packet_descriptor} set_packet_descriptor={set_packet_descriptor}/>
                        <Item title="rxCounter" state={rxCounter} setState={set_rxCounter}/>
                        <Item title="txCounter" state={txCounter} setState={set_txCounter}/>
                        <Item title="connected" state={connected} setState={set_connected}/>
                        <Item title="lastReceivedPacket" state={lastReceivedPacket} setState={set_lastRecievedPacket}/>
                    </ul>
                </div>
                <div className='tableElements'> <h1>Output</h1> <pre className="outputJson"><code>{JSON.stringify(outputJson(), null, 2)}</code></pre></div>
            </div>
        </div>
    )
}

function Item(props:{title:string, state:any, setState:any}){
    return (
        <li  className='item'>
            <div className='item-div'>
                {props.title}
            </div>
            <div className='item-div'>
                <GeneralSelect state={props.state} setState={props.setState}/>
            </div>
        </li>
    )
}
function GeneralSelect(props:{state: any, setState: any}){
    switch (typeof(props.state)){
        case "string":
            return(
            <input
                type="text"
                value={props.state}
                onChange={(e) => props.setState(e.target.value)}
            />)
        case "number":
            return(
            <input
                type="number"
                value={props.state}
                onChange={(e) => props.setState(e.target.value)}
            />
            )
        case "boolean":
            return (
            <button className="boolean-button"
                onClick={() => props.setState(!props.state)}
            >
                {props.state.toString()}
            </button>
            )
        default:
            console.error("Undefined type: " + typeof(props.state))
            return <></>
    }
}
function PacketDescriptor(props:{packet_descriptor:any, set_packet_descriptor:any}){
    return (
        <li className='item parentItem'>
            packet_descriptor
            <ul>
                {
                    props.packet_descriptor.indicies.map((id:number) => 
                        (
                        <li className='item' key={id}
                    draggable
                        
                        ><TypeSelect id={id} packet_descriptor={props.packet_descriptor} set_packet_descriptor={props.set_packet_descriptor}/></li>
                        )
                    )
                }
            </ul>
        </li>
    )
}
function RequestConfig(props:{request_config: any, set_request_config: React.Dispatch<React.SetStateAction<any>>}){
    const handle_source = (state: number):void => {props.set_request_config({...props.request_config, source:state})}
    const handle_destination = (state: number):void => {props.set_request_config({...props.request_config, destination:state})}
    const handle_destination_service = (state: number):void => {props.set_request_config({...props.request_config, destination_service:state})}
    const handle_command_id = (state: number):void => {props.set_request_config({...props.request_config, command_id:state})}
    const handle_command_arg = (state: number):void => {props.set_request_config({...props.request_config, command_arg:state})}
    return (
        <li className='item parentItem'>
            request_config
            <ul>
                <Item title="source" state={props.request_config["source"]} setState={handle_source}/>
                <Item title="destination" state={props.request_config["destination"]} setState={handle_destination}/>
                <Item title="destination_service" state={props.request_config["destination_service"]} setState={handle_destination_service}/>
                <Item title="command_id" state={props.request_config["command_id"]} setState={handle_command_id}/>
                <Item title="command_arg" state={props.request_config["command_arg"]} setState={handle_command_arg}/>
            </ul>
        </li>
    )
}
function TypeSelect(props:{id: number, packet_descriptor:any, set_packet_descriptor: any}){
    const handleSelectOpen = (open:boolean) => {
        console.log(open)
        props.set_packet_descriptor({...props.packet_descriptor, [props.id]:{...props.packet_descriptor[props.id], open:open
        }
    })}
    const handlePacketTitle = (title:string) => props.set_packet_descriptor({...props.packet_descriptor, [props.id]:{...props.packet_descriptor[props.id], title:title, open:false}})
    const handlePacketDescriptor: ((value:string) => void) = value => {
        props.set_packet_descriptor({...props.packet_descriptor, [props.id]:{...props.packet_descriptor[props.id], type:value, open:false}})}
    return (
        <div className='dropdown'>

            <div className='dropdown-top'>
                <input
                    type="text"
                    value={props.packet_descriptor[props.id].title}
                    onChange={(e) => handlePacketTitle(e.target.value)}
                />
            </div>
            <div className='dropdown-top'>
                <button 
                    className="dropbtn"
                    onClick={() => handleSelectOpen(!props.packet_descriptor[props.id].open)}
                >
                    {props.packet_descriptor[props.id].type}
                </button>
                {props.packet_descriptor[props.id].open ? (
                    <div className="dropdown-content">
                        <button onClick={e => handlePacketDescriptor("char")}>char</button>
                        <button onClick={e => handlePacketDescriptor("int8_t")}>int8_t</button>
                        <button onClick={e => handlePacketDescriptor("uint8_t")}>uint8_t</button>
                        <button onClick={e => handlePacketDescriptor("bool")}>bool</button>
                        <button onClick={e => handlePacketDescriptor("int16_t")}>int16_t</button>
                        <button onClick={e => handlePacketDescriptor("uint16_t")}>uint16_t</button>
                        <button onClick={e => handlePacketDescriptor("int")}>int</button>
                        <button onClick={e => handlePacketDescriptor("int32_t")}>int32_t</button>
                        <button onClick={e => handlePacketDescriptor("in64_t")}>in64_t</button>
                        <button onClick={e => handlePacketDescriptor("uint64_t")}>uint64_t</button>
                        <button onClick={e => handlePacketDescriptor("float")}>float</button>
                        <button onClick={e => handlePacketDescriptor("double")}>double</button>
                    </div>
                ) : (<></>)}
            </div>
            <div className='dropdown-button'>
                <button
                    className='itembtn'
                    onClick={() =>{
                        var indicies: number[] = props.packet_descriptor.indicies
                        console.log(indicies)
                        const newIndex = Math.max(indicies.length) + 1
                        indicies.splice(indicies.indexOf(props.id), 0, newIndex)
                        props.set_packet_descriptor({...props.packet_descriptor, indicies, [newIndex]:{
                            id: newIndex,
                            title: 'edit ' + newIndex,
                            type: "float",
                            open: false
                        }})
                    }}
                >
                    +
                </button>
            </div>
            <div className='dropdown-button'>
                <button
                    className='itembtn'
                    onClick={() =>{
                        var indicies: number[] = props.packet_descriptor.indicies
                        indicies.splice(indicies.indexOf(props.id), 1)
                        props.set_packet_descriptor({...props.packet_descriptor, indicies})}}
                >
                    -
                </button>
            </div>
        </div>
    )
}
export default Editor;
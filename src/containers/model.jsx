import React, { useEffect,  useState } from "react";
import './graph.css';
import { Navigation } from "../components/navigation";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Label, Brush } from 'recharts';
import { CircularProgress, createMuiTheme } from '@mui/material';
import FileSaver from "file-saver";
import { flexbox } from "@mui/system";




const Model = (props) => {

    const changeSelectedFile = file => props.setSelectedFile(file);

    var mouseOverData = "none"
    var isMouseOver = false
    
    var options = []
    var modelOptions = [{label: "ANN", value: "ann"}, {label: "CNN", value: "cnn"}]
    var modelSyncOptions = [{label: "Asynchronous", value: "Asynchronous"},{label: "Synchronous", value: "Synchronous"},]
    var leadTimeOptions = []
    var rMaxLagOptions = []
    var qMaxLagOptions = []
    var epochOptions = [{label: "10", value: "10"},{label: "50", value: "50"},{label: "100", value: "100"},{label: "200", value: "200"},{label: "400", value: "400"},{label: "500", value: "500"}]
    var optimizerOptions = [{label: "adam", value: "adam"},{label: "rmsprop", value: "rmsprop"},{label: "sgd", value: "sgd"},{label: "adagrad", value: "adagrad"}]
    var lossFunctionOptions = [{label: "Mean squared error", value: "mean_squared_error"},{label: "Mean absolute error", value: "mean_absolute_error"},{label: "Mean absolute percentage error", value: "mean_absolute_percentage_error"},{label: "Mean squared logarithmic error", value: "mean_squared_logarithmic_error"}]
    const [builder, setBuilder] = useState(false);
    const [rows, setRows] = useState(null);
    const [rowHeading, setRowHeading] = useState(null);
    const [FlexDirection, setFlexDirection] = useState("row");
    const [trainPlot, setTrainPlot] = useState([])
    const [corrPlot, setCorrPlot] = useState([])

    for (var i = 0; i < 11; i++ ) { 
        leadTimeOptions.push({label: i.toString(), value: i.toString()})
        rMaxLagOptions.push({label: i.toString(), value: i.toString()})
        qMaxLagOptions.push({label: i.toString(), value: i.toString()})
    }

    props.peaks.map(( e, index ) => {
        options.push({ label: "Peak" + (index+1).toString(), value: index })
    });

    const clickedGraph = (graph_id) => {

        var graphs = document.getElementsByClassName("graph-display-item")
        
        Array.from(graphs).forEach((graph) => {
            graph.classList.remove("graph-in-view");
        })

        var toDisplay = document.getElementById(graph_id)
        toDisplay.classList.add("graph-in-view")

    }

    const downloadGraph = (graph_id) => {
        var toDownload = document.getElementById(graph_id)
        var toDownloadSVG = toDownload.querySelector("svg")
        console.log(toDownloadSVG)

    }
    
    const [value, setValue] = React.useState(0);
    const [modelValue, setModelValue] = React.useState("ann");
    const [modelSyncValue, setModelSyncValue] = React.useState("Synchronous");
    const [leadTimeValue, setLeadTimeValue] = React.useState("0");
    const [rMaxLagValue, setRMaxLagValue] = React.useState("9");
    const [qMaxLagValue, setQMaxLagValue] = React.useState("2");
    const [epochValue, setEpochValue] = React.useState("100");
    const [optimizerValue, setOptimizerValue] = React.useState("rmsprop");
    const [lossFunctionValue, setLossFunctionValue] = React.useState("mean_squared_error");

    const handleChange = (event) => {
        setValue(event.target.value);
    };
    const handleModelChange = (event) => {
        setModelValue(event.target.value);
    };
    const handleModelSyncChange = (event) => {
        setModelSyncValue(event.target.value);
    };
    const handleLeadTimeChange = (event) => {
        setLeadTimeValue(event.target.value);
    };
    const handleRMaxLagChange = (event) => {
        setRMaxLagValue(event.target.value);
    };
    const handleQMaxLagChange = (event) => {
        setQMaxLagValue(event.target.value);
    };
    const handleEpochChange = (event) => {
        setEpochValue(event.target.value);
    };
    const handleOptimizerChange = (event) => {
        setOptimizerValue(event.target.value);
    };
    const handleLossFunctionChange = (event) => {
        setLossFunctionValue(event.target.value);
    };

    useEffect(() => {
        window.scrollTo(0, 0);

        var requestHeaders = {
            "model" : modelValue,
            "modelSync" : modelSyncValue,
            "leadTime" : leadTimeValue,
            "rMaxLag" : rMaxLagValue,
            "qMaxLag" : qMaxLagValue,
            "epoch" : epochValue,
            "optimizer" : optimizerValue,
            "lossFunction" : lossFunctionValue
        }
        var data = new FormData()
        data.append('file', props.selectedFile)
        const requestOptions = {
            method: 'PUT',
            body: data,
            headers: requestHeaders
        };



    }, []);
    
    
    

    return (
        <div className="model" style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", width: "100%"}}>
                            {
                                !builder ? <div /> : rows !== null && rowHeading !== null ? 
                                (<div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px"}}>
                                    <TabledData rows={rows} rowHeading={rowHeading} />
                                    <div className="graph-custom " id="train-pred">
                                    <div className="graph-title">Train Pred - Train True</div>
                                        <LineChart width={800} height={400} data={trainPlot} margin={{ left: 30, bottom: 40, top: 40, right: 30 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="x">
                                                <Label value="Train Pred" angle={0}  offset={-20} position="insideBottom"/>
                                            </XAxis>
                                            <YAxis yAxisId="left-axis">
                                                <Label value="Train True" angle={-90} position={{"x": 10, "y": 100}}/>
                                            </YAxis>
                                            <YAxis yAxisId="right-axis" orientation="right">
                                                <Label value="Train Pred" angle={-90} position={{"x": 30, "y": 100}}/>
                                            </YAxis>
                                            <Line yAxisId="left-axis" type="dashed" dataKey="y1"
                                            stroke="pink" strokeWidth={3} dot={false}/>
                                            <Line yAxisId="right-axis" type="dashed" dataKey="y2"
                                            stroke="blue" strokeWidth={1} dot={false}/>
                                            <Tooltip />
                                            <Brush dataKey="x" />
                                        </LineChart>
                                    </div>
                                </div>): 
                                <div><CircularProgress />Loading...</div>
                            }
                            -
                            <div style={{display: "flex", flexDirection: "column"}}>
                                <div style={{paddingTop: "10px", padding: "5px", display: "flex", flexDirection: FlexDirection}}>
                                <div className="dropdown">
                                    <Dropdown
                                        label="Model type : "
                                        options={modelOptions}
                                        value={modelValue}
                                        onChange={handleModelChange}
                                    />
                                </div>
                                <div className="dropdown">
                                    <Dropdown
                                        label="Model synchronization : "
                                        options={modelSyncOptions}
                                        value={modelSyncValue}
                                        onChange={handleModelSyncChange}
                                    />
                                </div>
                                <div className="dropdown">
                                    <Dropdown
                                        label="Lead Time : "
                                        options={leadTimeOptions}
                                        value={leadTimeValue}
                                        onChange={handleLeadTimeChange}
                                    />
                                </div>
                                <div className="dropdown">
                                    <Dropdown
                                        label="R Max Lag : "
                                        options={rMaxLagOptions}
                                        value={rMaxLagValue}
                                        onChange={handleRMaxLagChange}
                                    />
                                </div>
                                <div className="dropdown">
                                    <Dropdown
                                        label="Q Max Lag : "
                                        options={qMaxLagOptions}
                                        value={qMaxLagValue}
                                        onChange={handleQMaxLagChange}
                                    />
                                </div>
                                <div className="dropdown">
                                    <Dropdown
                                        label="Epoch : "
                                        options={epochOptions}
                                        value={epochValue}
                                        onChange={handleEpochChange}
                                    />
                                </div>
                                <div className="dropdown">
                                    <Dropdown
                                        label="Optimizer : "
                                        options={optimizerOptions}
                                        value={optimizerValue}
                                        onChange={handleOptimizerChange}
                                    />
                                </div>
                                <div className="dropdown">
                                    <Dropdown
                                        label="Loss Function : "
                                        options={lossFunctionOptions}
                                        value={lossFunctionValue}
                                        onChange={handleLossFunctionChange}
                                    />
                                </div>

                                </div>

                                <div  style={{alignItems: "center", display: "flex", justifyContent: "center", width: "100%", paddingTop: "10px"}}>
                                <div className="model_builder button"  onClick={() => {
                                    setFlexDirection("column")
                                    setBuilder(true)
                                    setRows(null)
                                    var requestHeaders = {
                                        "model" : modelValue,
                                        "modelSync" : modelSyncValue,
                                        "leadTime" : leadTimeValue,
                                        "rMaxLag" : rMaxLagValue,
                                        "qMaxLag" : qMaxLagValue,
                                        "epoch" : epochValue,
                                        "optimizer" : optimizerValue,
                                        "lossFunction" : lossFunctionValue
                                    }
                                    var data = new FormData()
                                    data.append('file', props.selectedFile)
                                    const requestOptions = {
                                        method: 'PUT',
                                        body: data,
                                        headers: requestHeaders
                                    };
                                    fetch('https://nischal-btp2.herokuapp.com/', requestOptions)
                                        .then(response => response.json())
                                        .then(response => {
                                            var tempRowHeading = []
                                            var tempRows = []
                                            Object.keys(response["model_results"]).forEach(( responseKey, index ) => {
                                                tempRowHeading.push(responseKey)
                                                var tempRow = []
                                                Object.keys(response["model_results"][responseKey]).forEach((value, col) => {
                                                    tempRow.push(response["model_results"][responseKey][value])
                                                })
                                                tempRows.push(tempRow)
                                            })

                                            var tempTrainPlot = []

                                            for (var i = 0; i < response["train_pred"].length; i++) {
                                                tempTrainPlot.push({x: i, y1: parseFloat(response["train_pred"][i]), y2: parseFloat(response["train_true"][i])})
                                            }

                                            
                                            setTrainPlot(tempTrainPlot)
                                            setRowHeading(tempRowHeading)
                                            setRows(tempRows)
                                            console.log(response)
                                            
                                        });

                                }} >
                                    Build Model
                                </div>
                                </div>
                            </div>
                        </div>
    )
}
export default Model;

const Dropdown = ({ label, value, options, onChange }) => {
    return (
      <label>
        {label}
        <select value={value} onChange={onChange}>
          {options.map((option) => (
            <option value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>
    );
  };

const TabledData = ({rowHeading, rows}) => {

    var parsedRows = []

    rows.forEach((currentRow, index) => {
        var tempRow = []
        currentRow.forEach((rowItem, index_r) => {
            var testValue = parseFloat(rowItem)

            if(isNaN(testValue)) {
                tempRow.push(rowItem)
            }
            else {
                tempRow.push(testValue.toFixed(2))
            }
        })
        parsedRows.push(tempRow)
    })


    return (<div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        {
                                            rowHeading.map((obj, index) => {
                                                return <th key={index}>{obj}</th>;
                                            })
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        parsedRows[0].map((rowItem, index) => {
                                                return <tr>
                                                    {
                                                        parsedRows.map((currentRow) => {
                                                            return <td>
                                                                {
                                                                    currentRow[index]
                                                                }
                                                            </td>
                                                        })
                                                    }
                                                </tr>
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
    );
}
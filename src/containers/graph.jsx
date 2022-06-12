import React, { useEffect,  useState } from "react";
import './graph.css';
import { Navigation } from "../components/navigation";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Label, Brush } from 'recharts';
import { CircularProgress, createMuiTheme } from '@mui/material';
import FileSaver from "file-saver";
import { flexbox } from "@mui/system";




const Graph = (props) => {

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
        const bars = document.querySelectorAll(".bar")
        const mouseOverDetails = document.querySelector(".mouse-over-details")
        bars.forEach((e, index) => {
            e.addEventListener("mouseover", ( event ) => {
                mouseOverData = props.buckets[index]["value"]
                isMouseOver = true;
                // setIsMouseOver(true);
            })

            e.addEventListener("mouseout", ( event ) => {
                mouseOverData = "none"
                isMouseOver = false;
                // setIsMouseOver(false);
            });
        })

        document.addEventListener("mousemove", ( e ) => {
            if (isMouseOver) {
                mouseOverDetails.style.display = "flex";
                mouseOverDetails.innerHTML = mouseOverData.toFixed(2) + "%"
                mouseOverDetails.style.top = (e.pageY + 15) + "px"
                mouseOverDetails.style.left = e.pageX
            }
            else {
                mouseOverDetails.style.display = "none"
            }
        })

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

        fetch('https://nischal-btp2.herokuapp.com/corr_plot', requestOptions)
                                        .then(response => response.json())
                                        .then(response => {
                                            var tempCorrelationPlot = []
                                            for(var i=0; i < response["cross_values"].length; i++) {
                                                tempCorrelationPlot.push({x: parseInt(response["cross_lags"][i]), y: parseFloat(response["cross_values"][i])})
                                            }

                                            setCorrPlot(tempCorrelationPlot)
                                            
                                        });


    }, []);
    
    
    

    return (
        <div className="graph-container">

            <div className="mouse-over-details"></div>

            <Navigation />

            <div className="statistics-data-container">

                <div className="statistics-container">
                    <div className="statistics-inner-container">
                        <div className="statistics-title">
                            Amount of Discharge
                        </div>
                        <div className="statistics">
                            <div className="statistics-category">
                                <div className="statistics-item">
                                    <div className="item-label">{props.buckets[0]["name"]}</div>
                                    <div className="bar">
                                        <div className="bar-progress" style={{backgroundColor: "#00f", left: (-1 * (100-props.buckets[0]["value"]).toString() + "%")}}></div>
                                    </div>
                                    <div className="invisible"></div>
                                </div>
                                <div className="statistics-item">
                                    <div className="item-label">{props.buckets[1]["name"]}</div>
                                    <div className="bar">
                                        <div className="bar-progress" style={{backgroundColor: "#0f0", left: (-1 * (100-props.buckets[1]["value"]).toString() + "%")}}></div>
                                    </div>
                                    <div className="invisible"></div>
                                </div>
                                <div className="statistics-item">
                                    <div className="item-label">{props.buckets[2]["name"]}</div>
                                    <div className="bar">
                                        <div className="bar-progress" style={{backgroundColor: "#ff0", left: (-1 * (100-props.buckets[2]["value"]).toString() + "%")}}></div>
                                    </div>
                                    <div className="invisible"></div>
                                </div>
                                <div className="statistics-item">
                                    <div className="item-label">{props.buckets[3]["name"]}</div>
                                    <div className="bar">
                                        <div className="bar-progress" style={{backgroundColor: "#f00", left: (-1 * (100-props.buckets[3]["value"]).toString() + "%")}}></div>
                                    </div>
                                    <div className="invisible"></div>
                                </div>
                            </div>
                            
                        </div>

                    </div>
                </div>
                
                <div className="data">

                    <div className="card">
                        <div className="card-info">
                            <div className="card-title">
                                Average Rainfall
                            </div>
                            <div className="card-value">
                                {props.data[0].toFixed(2) + "mm"}
                            </div>
                        </div>
                        <div className="card-img">
                            <img src="img/rain.png" />
                        </div>
                    
                    </div>
                    
                    <div className="card">
                        <div className="card-info">
                            <div className="card-title">
                                Average Discharge
                            </div>
                            <div className="card-value">
                                {props.data[1].toFixed(2) + "mm"}
                            </div>
                        </div>
                        <div className="card-img">
                            <img src="img/dam1.png" />
                        </div>
                    
                    </div>

                    <div className="card">
                        <div className="card-info">
                            <div className="card-title">
                                Maximum Rainfall
                            </div>
                            <div className="card-value">
                                {props.statistics["maxRain"] + "mm"}
                            </div>
                        </div>
                        <div className="card-img">
                            <img src="img/rain.png" />
                        </div>
                    
                    </div>

                    <div className="card">
                        <div className="card-info">
                            <div className="card-title">
                                Maximum Discharge
                            </div>
                            <div className="card-value">
                                {props.statistics["maxDischarge"] + "mm"}
                            </div>
                        </div>
                        <div className="card-img">
                            <img src="img/dam1.png" />
                        </div>
                    
                    </div>

                    <div className="card">
                        <div className="card-info">
                            <div className="card-title">
                                Minimum Rain
                            </div>
                            <div className="card-value">
                                {props.statistics["minRain"] + "mm"}
                            </div>
                        </div>
                        <div className="card-img">
                            <img src="img/rain.png" />
                        </div>
                    
                    </div>

                    <div className="card">
                        <div className="card-info">
                            <div className="card-title">
                                Minimum Discharge
                            </div>
                            <div className="card-value">
                                {props.statistics["minDischarge"] + "mm"}
                            </div>
                        </div>
                        <div className="card-img">
                            <img src="img/dam1.png" />
                        </div>
                    
                    </div>
                </div>
                
            </div>

            
            
            {/* <div className="graphs">

                
                <div className="graph-custom graph-first">
                    <div className="graph-title">Discharge Amount</div>

                    <LineChart width={800} height={400} data={props.plots[0]} margin={{ left: 30, bottom: 40, top: 40, right: 30}}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="x">
                            <Label value="Weeks" angle={0}  offset={-20} position="insideBottom"/>
                        </XAxis>
                        <YAxis yAxisId="left-axis">
                            <Label value="Discharge Amount" angle={-90} position={{"x": 10, "y": 100}}/>
                        </YAxis>
                        <YAxis yAxisId="right-axis" orientation="right" />
                        <Line yAxisId="left-axis" type="dashed" dataKey="y"
                        stroke="pink"  dot={false}/>
                        <Tooltip />
                        <Brush dataKey="x" />
                    </LineChart>
                </div>
                <div className="graph-custom">
                    <div className="graph-title">Amount of Rain</div>
                    <LineChart width={800} height={400} data={props.plots[1]} margin={{ left: 30, bottom: 40, top: 40, right: 30 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="x">
                            <Label value="Weeks" angle={0}  offset={-20} position="insideBottom"/>
                        </XAxis>
                        <YAxis yAxisId="left-axis">
                            <Label value="Amount of Rain (in mm)" angle={-90} position={{"x": 10, "y": 100}}/>
                        </YAxis>
                        <YAxis yAxisId="right-axis" orientation="right" />
                        <Line yAxisId="left-axis" type="dashed" dataKey="y"
                        stroke="pink"  dot={false}/>
                        <Tooltip />
                        <Brush dataKey="x" />
                    </LineChart>
                </div>
                <div className="graph-custom">
                    <div className="graph-title">Discharge Amount - Amount of Rain</div>
                    <LineChart width={800} height={400} data={props.plots[2]} margin={{ left: 30, bottom: 40, top: 40, right: 30 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="x">
                            <Label value="Discharge Amount" angle={0}  offset={-20} position="insideBottom"/>
                        </XAxis>
                        <YAxis yAxisId="left-axis">
                            <Label value="Amount of Rain (in mm)" angle={-90} position={{"x": 10, "y": 100}}/>
                        </YAxis>
                        <Line yAxisId="left-axis" type="dashed" dataKey="y"
                        stroke="pink"  dot={false}/>
                        <Tooltip />
                        <Brush dataKey="x" />
                    </LineChart>
                </div>
                <div className="graph-custom graph-select">
                    <div className="graph-title">Discharge Peaks</div>
                    <div className="dropdown">
                        <Dropdown
                            label="Graph : "
                            options={options}
                            value={value}
                            onChange={handleChange}
                        />
                
                    </div>
                    <LineChart width={800} height={400} data={props.peaks[value]} margin={{ left: 30, bottom: 40, top: 40, right: 30 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="x">
                            <Label value="Weeks" angle={0}  offset={-20} position="insideBottom"/>
                        </XAxis>
                        <YAxis yAxisId="left-axis">
                            <Label value="Discharge Amount" angle={-90} position={{"x": 10, "y": 100}}/>
                        </YAxis>
                        <Line yAxisId="left-axis" type="dashed" dataKey="y"
                        stroke="pink"  dot={false}/>
                        <Tooltip />Name
                    </LineChart>
                </div>
            </div> */}

            <div className="graph-selector-container">

                <div className="selector-inner-container">

                    <div className="controllers">
                        <div className="controller-item" onClick={() => {clickedGraph("discharge-plot")}}>Discharge plot</div>
                        <div className="controller-item" onClick={() => {clickedGraph("rainfall-plot")}}>Rainfall Plot</div>
                        <div className="controller-item" onClick={() => {clickedGraph("correlation-plot")}}>Cross Correlation</div>
                        <div className="controller-item" onClick={() => {clickedGraph("discharge-peak")}}>Discharge Peaks</div>
                        <div className="controller-item" onClick={() => {clickedGraph("model")}}>Build Models</div>
                        
                        
                        

                        


                    </div>

                    <div className="graph-display">


                        <div className="graph-custom graph-first graph-display-item graph-in-view" id="discharge-plot">
                            <div className="graph-title">Discharge Amount</div>

                            <LineChart width={1500} height={750} data={props.plots[0]} margin={{ left: 30, bottom: 40, top: 40, right: 30}}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="x">
                                    <Label value="Weeks" angle={0}  offset={-20} position="insideBottom"/>
                                </XAxis>
                                <YAxis yAxisId="left-axis">
                                    <Label value="Discharge Amount" angle={-90} position={{"x": 10, "y": 100}}/>
                                </YAxis>
                                <YAxis yAxisId="right-axis" orientation="right" />
                                <Line yAxisId="left-axis" type="dashed" dataKey="y"
                                stroke="pink" strokeWidth={3} dot={false}/>
                                <Tooltip />
                                <Brush dataKey="x" />
                            </LineChart>
                        </div>
                        <div className="graph-custom graph-display-item" id="rainfall-plot">
                            <div className="graph-title">Amount of Rain</div>
                            <LineChart width={1500} height={750} data={props.plots[1]} margin={{ left: 30, bottom: 40, top: 40, right: 30 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="x">
                                    <Label value="Weeks" angle={0}  offset={-20} position="insideBottom"/>
                                </XAxis>
                                <YAxis yAxisId="left-axis">
                                    <Label value="Amount of Rain (in mm)" angle={-90} position={{"x": 10, "y": 100}}/>
                                </YAxis>
                                <YAxis yAxisId="right-axis" orientation="right" />
                                <Line yAxisId="left-axis" type="dashed" dataKey="y"
                                stroke="pink" strokeWidth={3} dot={false}/>
                                <Tooltip />
                                <Brush dataKey="x" />
                            </LineChart>
                        </div>
                        <div className="graph-custom graph-display-item" id="correlation-plot">
                            <div className="graph-title">Correlation Plot</div>
                            <LineChart width={1500} height={750} data={corrPlot} margin={{ left: 30, bottom: 40, top: 40, right: 30 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="x">
                                    <Label value="Lags" angle={0}  offset={-20} position="insideBottom"/>
                                </XAxis>
                                <YAxis yAxisId="left-axis">
                                    <Label value="Correlation" angle={-90} position={{"x": 10, "y": 100}}/>
                                </YAxis>
                                <Line yAxisId="left-axis" type="dashed" dataKey="y"
                                stroke="pink" strokeWidth={3} dot={false}/>
                                <Tooltip />
                                <Brush dataKey="x" />
                            </LineChart>
                        </div>
                        <div className="graph-custom graph-select graph-display-item" id="discharge-peak">
                            <div className="graph-title">Discharge Peaks</div>
                            <div className="dropdown">
                                <Dropdown
                                    label="Graph : "
                                    options={options}
                                    value={value}
                                    onChange={handleChange}
                                />
                        
                            </div>
                            <LineChart width={1500} height={750} data={props.peaks[value]} margin={{ left: 30, bottom: 40, top: 40, right: 30 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="x">
                                    <Label value="Weeks" angle={0}  offset={-20} position="insideBottom"/>
                                </XAxis>
                                <YAxis yAxisId="left-axis">
                                    <Label value="Discharge Amount" angle={-90} position={{"x": 10, "y": 100}}/>
                                </YAxis>
                                <Line yAxisId="left-axis" type="dashed" dataKey="y"
                                stroke="pink" strokeWidth={3} dot={false}/>
                                <Tooltip />
                            </LineChart>
                        </div>

                        <div className="model graph-display-item" id="model" style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", width: "100%"}}>
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


                    </div>




                </div>




            </div>

            {/* <div className="model-builder options">
                <div className="dropdown">
                    <Dropdown
                        label="Model type : "
                        options={modelOptions}
                        value={value}
                        onChange={handleModelChange}
                    />
                </div>
                <div className="dropdown">
                    <Dropdown
                        label="Model synchronization : "
                        options={modelSyncOptions}
                        value={value}
                        onChange={handleModelSyncChange}
                    />
                </div>
            </div> */}

            
            

            {/* <div className="model_builder button" onClick={() => {
                setBuilder(true)
                setRows(null)
                var data = new FormData()
                data.append('file', props.selectedFile)
                const requestOptions = {
                    method: 'PUT',
                    body: data
                };
                fetch('https://nischalbtp.herokuapp.com/', requestOptions)
                    .then(response => response.json())
                    .then(response => {
                        var tempRowHeading = []
                        var tempRows = []
                        Object.keys(response).forEach(( responseKey, index ) => {
                            tempRowHeading.push(responseKey)
                            var tempRow = []
                            Object.keys(response[responseKey]).forEach((value, col) => {
                                tempRow.push(response[responseKey][value])
                            })
                            tempRows.push(tempRow)
                        })

                        setRowHeading(tempRowHeading)
                        setRows(tempRows)
                        
                    });

            }} >
                Build Model
            </div> */}

            

        </div>
    )
}
export default Graph;

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
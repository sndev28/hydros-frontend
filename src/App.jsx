import { useEffect, useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import SmoothScroll from "smooth-scroll";
import "./App.css";
import Graph from './containers/graph';
import Home from "./containers/home";
import Model from "./containers/model";

export const scroll = new SmoothScroll('a[href*="#"]', {
	speed: 1000,
	speedAsDuration: true,
});

const App = () => {
	const [selectedFile, setSelectedFile] = useState(null);
	const [average1, setAverage1] = useState(0);
	const [average2, setAverage2] = useState(0);
	const [plot1, setPlot1]= useState([])
	const [plot2, setPlot2]= useState([])
	const [plot3, setPlot3]= useState([])
	const [minRain, setMinRain]= useState(0)
	const [maxRain, setMaxRain]= useState(0)
	const [minDischarge, setMinDischarge]= useState(Number.MAX_VALUE)
	const [maxDischarge, setMaxDischarge]= useState(Number.MAX_VALUE)
	const [bucket0, setBucket0]= useState({"name": "dummy", "value": 0})
	const [bucket1, setBucket1]= useState({"name": "dummy", "value": 0})
	const [bucket2, setBucket2]= useState({"name": "dummy", "value": 0})
	const [bucket3, setBucket3]= useState({"name": "dummy", "value": 0})
	const [peaks, setPeaks] = useState([])


	var fr = new FileReader();

	fr.onload = function (e) {
		var rows = e.target.result.split("\n");
		var sum1 = 0;
		var sum2 = 0;
		var tempPlot1 = [];
		var tempPlot2 = [];
		var tempPlot3 = [];
		var tempMaxRain = 0;
		var tempMaxDischarge = 0;
		var tempMinRain =  Number.MAX_VALUE;
		var tempMinDischarge = Number.MAX_VALUE;
		
		for (let i = 0; i < 6000; i++) {
			var temp = rows[i].split("\t");
			if(tempMaxRain < parseFloat(temp[1])) {
				tempMaxRain = parseFloat(temp[1]);
			}
			if(tempMaxDischarge < parseFloat(temp[2])) {
				tempMaxDischarge = parseFloat(temp[2]);
			}
			if(tempMinRain > parseFloat(temp[1])) {
				tempMinRain = parseFloat(temp[1]);
			}
			if(tempMinDischarge > parseFloat(temp[2])) {
				tempMinDischarge = parseFloat(temp[2]);
			}

			sum1 += parseFloat(temp[1]);
			sum2 += parseFloat(temp[2]);
			tempPlot1.push({ x: i, y: parseFloat(temp[2]) });
			tempPlot2.push({ x: i, y: parseFloat(temp[1]) });
			tempPlot3.push({ x: parseFloat(temp[2]), y: parseFloat(temp[1]) });

		}


		setPlot1(tempPlot1);
		setPlot2(tempPlot2);
		setPlot3(tempPlot3);
		setAverage1(sum1/6000);
		setAverage2(sum2/6000);
		setMaxRain(tempMaxRain);
		setMinRain(tempMinRain);
		setMaxDischarge(tempMaxDischarge);
		setMinDischarge(tempMinDischarge);

		var Bucket0Count = 0;
		var Bucket1Count = 0;
		var Bucket2Count = 0;
		var Bucket3Count = 0;

		var tempPeaks = []

		for (let i = 0; i < 6000; i++) {
		
			var temp = rows[i].split("\t");
			var discharge = parseFloat(temp[2])
			
			if(i > 4 && i < 6000-5){
				if(discharge > 650 && discharge > parseFloat(rows[i-1].split("\t")[2]) && discharge > parseFloat(rows[i+1].split("\t")[2])) {
					var tempPeakPlot = []
					for (var j = i - 4; j < i + 5; j++) {
						tempPeakPlot.push({ x: j, y: parseFloat(rows[j].split("\t")[2]) })
					}
					tempPeaks.push(tempPeakPlot)
				}
			}
 
			if (discharge < 0.25*tempMaxDischarge) Bucket0Count += 1
			else if(discharge >= 0.25*tempMaxDischarge && discharge < 0.5*tempMaxDischarge) Bucket1Count += 1;
			else if(discharge >= 0.5*tempMaxDischarge && discharge < 0.75*tempMaxDischarge) Bucket2Count += 1;
			else if(discharge >= 0.75*tempMaxDischarge) Bucket3Count += 1;

		}

		setBucket0({"name": "0mm - " + (Math.round(0.25*tempMaxDischarge)).toString() + "mm", "value": 100*Bucket0Count/6000})
		setBucket1({"name": (Math.round(0.25*tempMaxDischarge)).toString() + "mm - " + (Math.round(0.5*tempMaxDischarge)).toString() + "mm", "value": 100*Bucket1Count/6000})
		setBucket2({"name": (Math.round(0.5*tempMaxDischarge)).toString() + "mm - " + (Math.round(0.75*tempMaxDischarge)).toString() + "mm", "value": 100*Bucket2Count/6000})
		setBucket3({"name": (Math.round(0.75*tempMaxDischarge)).toString() + "mm - " + (Math.round(tempMaxDischarge)).toString() + "mm", "value": 100*Bucket3Count/6000})
		setPeaks(tempPeaks)

	}

	
	useEffect(() => {
		if (selectedFile) {
			fr.readAsText(selectedFile);
		}
	}, [selectedFile]);

	return (
		<div>
			<Switch>
				<Route path="/graph">
					<Graph selectedFile={selectedFile} setSelectedFile={setSelectedFile} plots={[plot1, plot2, plot3]} data={[average1, average2]} peaks={peaks} buckets={[bucket0, bucket1, bucket2, bucket3]} statistics = {{
						"minRain" : minRain,
						"maxRain" : maxRain,
						"maxDischarge" : maxDischarge,
						"minDischarge" : minDischarge,
					}}/>
				</Route>
				<Route path="/model">
					<Model selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
				</Route>
				<Route path="/">
					<Home setSelectedFile={setSelectedFile} />
				</Route>
			</Switch>
		</div>
	);
};

export default App;

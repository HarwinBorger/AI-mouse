import {useState, useEffect, useRef} from 'react';
import './App.css';

function App() {
	const [parentScrollTop, setParentScrollTop] = useState();
	const [parentTime, setParentTime] = useState();
	const [scrollTop, setScrollTop] = useState();
	const [scrolling, setScrolling] = useState();

	const [percentage, setPercentage] = useState();
	const [performance, setPerformance] = useState();
	const [ptime, setPtime] = useState();
	const [dtime, setDtime] = useState();
	const target = useRef();

	let date = new Date().getTime();
	const difference = date - parentTime;
	useEffect(() => {
		const onScroll = e => {
			setParentScrollTop(scrollTop);
			setParentTime(date);
			setScrollTop(e.target.documentElement.scrollTop);
			setScrolling(e.target.documentElement.scrollTop > scrollTop);
		};
		window.addEventListener("scroll", onScroll);

		return () => window.removeEventListener("scroll", onScroll);
	},[]);

	useEffect(() => {
		let thresholds = [];
		let numSteps = 200;

		for (let i=1.0; i<=numSteps; i++) {
			let ratio = i/numSteps;
			thresholds.push(ratio);
		}

		thresholds.push(0);

		let options = {
			rootMargin: '0px',
			threshold: thresholds
		}

		let ptime = 0;
		let dtime = 0;
		let lastRatio = 0
		let timer;

		let callback = (entries, observer) => {
			entries.forEach(entry => {
				clearTimeout(timer);
				setPercentage(entry.intersectionRatio);
				setPerformance(entry.intersectionRatio);

				let time = new Date().getTime();
				if(ptime){
					setDtime(time - ptime);
					dtime = time - ptime;
				}
				let test = lastRatio;
				timer = setTimeout(()=>{
					setPerformance(entry.intersectionRatio + (entry.intersectionRatio-test)/2);
				},dtime/2);
				ptime = time;
				setPtime(time);
				lastRatio = entry.intersectionRatio;
			});
		};

		let observer = new IntersectionObserver(callback, options);
		observer.observe(target.current);
	},[]);

	return (
		<>
			<div style={{position: "sticky", top: 0, left: 0, width: "100%", background: '#cccccc'}}>
				parentScrollTop: {parentScrollTop} |
				scrollTop: {scrollTop} |
				difference: {parentScrollTop - scrollTop} |
				parentTime: {parentTime} |
				currentTime: {date} |
				difference: {difference} |
			</div>
			<div style={{position: "sticky", top: 20, left: 0, width: `${percentage * 100}%`, background: '#f90', height: 20}}/>
			<div style={{position: "sticky", top: 40, left: 0, width: `${performance * 100}%`, background: '#f90', height: 20}}/>
			<div className="App" style={{height: '300vh', padding: '200px', marginTop: '100vh'}}>
				<div ref={target} style={{background: '#AAA', height: '80vh'}}>
					<div style={{position: "sticky", top: 60, left: 0, width: "100%", background: '#cccccc'}}>
						parentScrollTop: {percentage}, dtime: {dtime}, ptime: {ptime}
					</div>
				</div>
			</div>
		</>
	);
}

export default App;

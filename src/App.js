import './App.css';
import React, { useEffect } from 'react';
import Map from './Map'

// ------------------------------------------------------------------
// data placeholders
// ------------------------------------------------------------------


// ------------------------------------------------------------------
// data placeholders end
// ------------------------------------------------------------------

function App() {

  useEffect(() => {
    // POST request using fetch inside useEffect React hook
    // async function fetchData(){
    //   const requestOptions = {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify({ title: 'React Hooks POST Request Example' })
    //   };
    //   const res = await fetch('https://reqres.in/api/posts', requestOptions)
    //       .then(response => response.json())
    //       .then(data => {
    //         // console.log(data)
    //         return data
    //       });
    //   console.log(res)
    // }
    // fetchData()
    // empty dependency array means this effect will only run once (like componentDidMount in classes)
  }, []);

  return (
    <div className="App">
		<div style={{height: '5vh', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#EA2718', color: 'white', fontWeight: 800, fontSize: '18pt'}}>
			<div style={{background: 'url("https://www.moveparallel.com/assets/parallel_systems.svg")', height: '100%', width: '200px', backgroundRepeat: 'no-repeat', backgroundPosition: 'center center'}}></div>
			<div>Test Fleet Overview</div>
			<div style={{background: 'transparent', height: '100%', width: '200px', backgroundRepeat: 'no-repeat', backgroundPosition: 'center center'}}></div>
		</div>
		<header className="App-header">
			<div style={{background: 'silver', height: '100%', width: '50vw'}}>
				<Map />
			</div>
		</header>
    </div>
  );
}

export default App;

import './App.css';
import React, { useEffect } from 'react';
import Map from './Map'

// ------------------------------------------------------------------
// data placeholders
// ------------------------------------------------------------------

const droneOverviewData = [
  {id: 1, position: [41.07930001, -85.13940001], inMotion: false, battery: 100, temperature: 30, velocity: 0},
  {id: 2, position: [41.07930002, -85.13940002], inMotion: false, battery: 100, temperature: 30, velocity: 0},
  {id: 3, position: [41.07930003, -85.13940003], inMotion: false, battery: 100, temperature: 30, velocity: 0},
  {id: 4, position: [41.07930004, -85.13940004], inMotion: false, battery: 100, temperature: 30, velocity: 0},
  {id: 5, position: [41.07930005, -85.13940005], inMotion: false, battery: 100, temperature: 30, velocity: 0},
  {id: 6, position: [41.07930006, -85.13940006], inMotion: false, battery: 100, temperature: 30, velocity: 0},
  {id: 7, position: [41.07930007, -85.13940007], inMotion: false, battery: 100, temperature: 30, velocity: 0},
  {id: 8, position: [41.07930008, -85.13940008], inMotion: false, battery: 100, temperature: 30, velocity: 0},
  {id: 9, position: [41.07930009, -85.13940009], inMotion: false, battery: 100, temperature: 30, velocity: 0},
  {id: 10, position: [41.07930010, -85.13940010], inMotion: false, battery: 100, temperature: 30, velocity: 0},
]


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
	<div style={{height: '5vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
		<h2>Overview</h2>
	</div>
      <header className="App-header">
        <div style={{background: 'silver', height: '95vh', width: '50vw'}}>
          <Map />
        </div>
      </header>
    </div>
  );
}

export default App;

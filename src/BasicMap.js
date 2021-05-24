import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
// import L from "leaflet";

function BasicMap() {
//     useEffect(function(){
//       // POST request using fetch inside useEffect React hook
//     //   async function fetchData(){
//     //     const requestOptions = {
//     //         method: 'POST',
//     //         headers: { 'Content-Type': 'application/json' },
//     //         body: JSON.stringify({ title: 'React Hooks POST Request Example' })
//     //     };
//     //     const res = await fetch('https://reqres.in/api/posts', requestOptions)
//     //         .then(response => response.json())
//     //         .then(data => {
//     //           // console.log(data)
//     //           return data
//     //         });
//     //     console.log(res)
//     //   }
//     //   fetchData()
//     // empty dependency array means this effect will only run once (like componentDidMount in classes)
//         console.log(this)
//         outerBounds = this.refs.map.leafletElement.getBounds
// }, []);
    const position = [41.0793, -85.2094];

    // get list of positions for drones
    // group them in pairs
    // group them in chains of pairs

    // send emergency stop
    // pull up video feed, get most recent image from cameras?









    
    const droneOverviewData = [
        {
            id: 1,
            position: [41.09308855538089,-85.2545766765252],
            inMotion: false,
            battery: 100,
            temperature: 30,
            velocity: 0,
        },
        {
            id: 2,
            position: [41.09302386967857,-85.25429772678763],
            inMotion: false,
            battery: 100,
            temperature: 30,
            velocity: 0,
        },
        {
            id: 3,
            position: [41.0929915268035,-85.25419],
            inMotion: false,
            battery: 100,
            temperature: 30,
            velocity: 0,
        },
        {
            id: 4,
            position: [41.09294,-85.25397586170584],
            inMotion: false,
            battery: 100,
            temperature: 30,
            velocity: 0,
        },
        {
            id: 5,
            position: [41.092908,-85.253866],
            inMotion: false,
            battery: 100,
            temperature: 30,
            velocity: 0,
        },
        {
            id: 6,
            position: [41.092875,-85.2536754],
            inMotion: false,
            battery: 100,
            temperature: 30,
            velocity: 0,
        },
        {
            id: 7,
            position: [41.092844,-85.2535754],
            inMotion: false,
            battery: 100,
            temperature: 30,
            velocity: 0,
        },
        {
            id: 8,
            position: [41.092794,-85.25335358921438],
            inMotion: false,
            battery: 100,
            temperature: 30,
            velocity: 0,
        },
        {
            id: 9,
            position: [41.092765,-85.25325],
            inMotion: false,
            battery: 100,
            temperature: 30,
            velocity: 0,
        },
        {
            id: 10,
            position: [41.092699,-85.25299],
            inMotion: false,
            battery: 100,
            temperature: 30,
            velocity: 0,
        },
    ];

    const clickMarker = () => {
        console.log("click marker")
    }

    const handleClick = (e) => {
        console.log("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng)
    }

    const buildMarkerList = () => {
        console.log("build marker list");
        return droneOverviewData.map((item) => {
            const {position, id, inMotion, battery, temperature, velocity} = item
            return (<Marker 
                key={'marker'+id} 
                position={position} 
                onClick={() => {
                    clickMarker()}
                }>
                    <Popup>drone_{item.id}</Popup>
            </Marker>)
        })
    };

    return (
        <MapContainer 
            center={droneOverviewData[0].position} 
            zoom={16} 
            scrollWheelZoom={false}
            onClick={handleClick}
        >
            <TileLayer
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
                maxZoom={20}
                attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
            />
            <TileLayer
                attribution='&copy; <a href="http://www.openrailwaymap.org/">OpenRailwayMap</a>'
                url="http://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png"
                maxZoom={20}
            />
            {/* <Marker
                position={position}
                onMouseOver={(e) => {
                    console.log("mouseover");
                    e.target.openPopup();
                }}
                onMouseOut={(e) => {
                    console.log("mouseout");
                    e.target.closePopup();
                }}
            >
                <Popup>Sydney</Popup>
            </Marker> */}
            {buildMarkerList()}
            {/* <Marker position={position}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker> */}
        </MapContainer>
    );
}

export default BasicMap;

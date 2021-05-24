import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, FeatureGroup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { makeKey } from "./lib/makeKey";
import geojson from "./data/geojson.json";
import "react-leaflet-markercluster/dist/styles.min.css";
import "./lib/map.css";
import L from "leaflet";
import GetVisibleMarkers from "./lib/get-visible-markers";
import UpdateMapPosition from "./lib/update-map-position";
import DataTable, { createTheme } from 'react-data-table-component';
import styled from 'styled-components'

import LineChart from './LineChart';

const Table = (data, setCenterPoint, setInitialZoom) => {

	createTheme('solarized', {
		text: {
		  primary: '#333',
		  secondary: 'silver',
		},
		background: {
		  default: '#eee',
		},
		context: {
		  background: '#aaa',
		  text: '#FFFFFF',
		},
		divider: {
		  default: '#073642',
		},
		action: {
		  button: 'rgba(0,0,0,.54)',
		  hover: 'rgba(0,0,0,.08)',
		  disabled: 'rgba(0,0,0,.12)',
		},
	  });

    const columns = [
        {
            name: "id",
            selector: "id",
            sortable: true,
        },
        {
            name: "Charging",
            selector: "isCharging",
            sortable: true,
            right: true,
			cell: (row) => <div>{row.isCharging ? "Yes" : "No"}</div>,
        },
        {
            name: "Battery",
            selector: "battery",
            sortable: true,
            right: true,
			cell: (row) => <div>{row.battery}%</div>,
        },
        {
            name: "In Motion",
            selector: "inMotion",
            sortable: true,
            right: true,
            cell: (row) => <div>{row.inMotion ? row.velocity + 'm/s': "No"}</div>,
        },
        {
            name: "Temperature",
            selector: "temperature",
            sortable: true,
            right: true,
            cell: (row) => <div>{row.temperature} &deg;C</div>,
        },
    ];

	const ExpandableComponent = ({ data }) => {
		// console.log(data)
		const history = data.history || []
		setInitialZoom(true)
		return (
			<div style={{display: 'flex', flexDirection: 'row', minHeight: '400px'}}>
				<div style={{width: '100%', maxWidth: '100%', overflow: 'auto', minHeight: '100px', display: 'flex', flexDirection: 'column', margin: '10px', marginRight: '50px'}}>
					<button style={{background: 'red', color: 'white', borderRadius: '4px', border: 'none', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', cursor: 'pointer'}}>STOP Drone {data.id}</button>
					<button onClick={() => {
						return setCenterPoint(data.position)
					}} style={{background: 'white', color: '#333', borderRadius: '4px', border: 'none', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', cursor: 'pointer'}}>Show on Map</button>
				</div>
				<div>
					{LineChart(history)}
				</div>
			</div>
		)
	}

    return (
		<DataTable 
			title={`Showing ${data.length} Drones`}
			columns={columns} 
			data={data}
			expandableRows
			expandableRowsComponent={<ExpandableComponent />}
			// theme={'solarized'}
			fixedHeader
			fixedHeaderScrollHeight={'65vh'}
		/>
	);
};

const controlScreen = (set, reset, drone) => {
    const {
        properties: { id, inMotion, temperature, battery, position, velocity },
    } = drone;
    return (
        <div style={{ textAlign: "left" }}>
            <h2 style={{ cursor: "pointer" }} onClick={() => reset()}>
                Back
            </h2>

            <div>Drone {id}</div>
            <div>In motion: {inMotion ? velocity + "m/s" : "No"}</div>
            <div>Temperature: {temperature} &deg;C</div>
            <div>Charge: {battery}</div>
            <div>
                Position: {position[0].toFixed(4)}, {position[1].toFixed(4)}
            </div>
            <div>Velocity: {velocity}</div>

            {/* controls */}
            <div>
                <h2>Control</h2>
                <button>STOP</button>
                <button>Approve Warrant</button>
            </div>
        </div>
    );
};

const Toggle = styled.button`
	color: #323432;
	margin: 5px;
	border: 2px solid #323432;
	border-radius: 3px;
	transition: 0.2s;
	background: #fff;
`

const Map = () => {
    // REFS
    // Initiate refs to the feature group and cluster group
    const groupRef = useRef();
    const clusterRef = useRef();

    // STATE

    const [initialZoom, setInitialZoom] = useState(false)
    const [centerPoint, setCenterPoint] = useState([41.09302386967857, -85.25429772678763])
    const [selectedDrone, setSelectedDrone] = useState({
        properties: { id: 0 },
    });
    // const [showClusters, setShowClusters] = useState(false);
    const [showInMotion, setShowInMotion] = useState(false);
    const [showCharging, setShowCharging] = useState(false);
    const [showNeedsCharging, setShowNeedsCharging] = useState(false);
    const [showWarrantReqs, setShowWarrantReqs] = useState(false);
    // GeoJson Key to handle updating geojson inside react-leaflet
    const [geoJsonKey, setGeoJsonKey] = useState("initialKey123abc");



    //Track which markers are being actively displayed on the map
    const [displayedMarkers, setDisplayedMarkers] = useState(geojson);
	const appliedFilterData = displayedMarkers.filter((item) => {
		let returnVal = true

		if(showCharging){
			returnVal = item.properties.isCharging === true
		}
		if(returnVal && showNeedsCharging){
			returnVal = item.properties.battery < 30
		}
		if(returnVal && showInMotion){
			returnVal = item.properties.inMotion === true || item.properties.velocity > 0
		}
		if(returnVal && showWarrantReqs){
			returnVal = item.properties.warrants?.length > 0
		}


		return returnVal
	})

    //Track which markers are visible on the map
    const [visibleMarkers, setVisibleMarkers] = useState(geojson);

    // FUNCTIONS
    // Generate a new key to force an update to GeoJson Layer
    useEffect(() => {
        const newKey = makeKey(10);
        setGeoJsonKey(newKey);
    }, [displayedMarkers, showInMotion, showCharging, showNeedsCharging, showWarrantReqs]);

    //Creating popups for the map
    const createPopups = (feature = {}, layer) => {
		return
        // const { properties = {} } = feature;
        // const { velocity, temperature, inMotion, battery, id } = properties;
        // const popup = L.popup();
        // const html = `
		// 	<div style="text-align: left;">
		// 		<h3>Drone ${id}</h3>
		// 		<ul>
		// 			<li><strong>Charge:</strong> ${battery}%</li>
		// 			<li><strong>Temperature:</strong> ${temperature} &deg;C</li>
		// 			<li><strong>In Motion:</strong>${inMotion ? velocity + "m/s" : "No"}</li>
		// 		</ul>
		// 	</div>
		// `;
        // popup.setContent(html);
        // layer.bindPopup(popup);
    };

    // Handle creation of clusters and change styles
    const createClusters = (cluster) => {
        const childCount = cluster.getChildCount();
        let size = "";
        if (childCount < 10) {
            size = "small";
        } else if (childCount < 25) {
            size = "medium";
        } else {
            size = "large";
        }
        return L.divIcon({
            html: `<div><span><b>${childCount}</b></span></div>`,
            className: `custom-marker-cluster custom-marker-cluster-${size}`,
            iconSize: new L.point(40, 40),
        });
    };

    const selectDrone = (marker) => {
        setSelectedDrone(marker);
    };

    const resetSelectedDrone = () => {
        setSelectedDrone({ properties: { id: 0 } });
    };
	
	function ChangeView({ center, zoom }) {
		const map = useMap();
		map.setView(center, zoom);
		return null;
	}

	return (
        <div
            style={{
                width: "100vw",
                height: "100%",
                display: "flex",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "50vw",
                    flexWrap: "wrap",
                    alignContent: "flex-start",
                }}
            >
                {selectedDrone.properties.id === 0 && (
                    <div style={{display: 'flex', flexDirection: 'column', width: '100%', height: '95vh'}}>
						<div style={{display: 'flex', flexDirection: 'column', width: '200px', height: '30vh'}}>
							<h4>Filters</h4>
							{/* <Toggle 
								onClick={(e) => {
									setShowCharging(true)
									setShowNeedsCharging(true)
									setShowInMotion(true)
									setShowWarrantReqs(true)
									setShowClusters(false)
								}}
							>Show All</Toggle> */}
							<Toggle 
								className={showCharging ? 'selectedButton' : ''}
								onClick={(e) => {
									setShowCharging(!showCharging)
								}}
							>Charging</Toggle>
							<Toggle 
								className={showNeedsCharging ? 'selectedButton' : ''}
								onClick={(e) => {
									setShowNeedsCharging(!showNeedsCharging)
								}}
							>Needs Charging</Toggle>
							<Toggle 
								className={showInMotion ? 'selectedButton' : ''}
								onClick={(e) => {
									setShowInMotion(!showInMotion)
								}}
							>In Motion</Toggle>
							<Toggle 
								className={showWarrantReqs ? 'selectedButton' : ''}
								onClick={(e) => {
									setShowWarrantReqs(!showWarrantReqs)
								}}
							>Warrant Requests</Toggle>
							{/* <Toggle 
								onClick={(e) => {
									setShowClusters(!showClusters)
								}}
							>Use {showClusters ? 'Single' : 'Clusters'}</Toggle> */}
						</div>
						<div style={{width: '100%', display: 'flex', flexDirection: 'column'}}>
							{Table(appliedFilterData.map(item => item.properties), setCenterPoint, setInitialZoom)}
						</div>
					</div>
                )}
                {/* show control space */}
                {selectedDrone.properties.id > 0 &&
                    controlScreen(
                        selectDrone,
                        resetSelectedDrone,
                        selectedDrone
                    )}
            </div>

            <div style={{ height: "100%", width: "50vw" }}>
                <MapContainer
                    center={[41.0930, -85.2542]}
                    zoom={12}
                    scrollWheelZoom={false}
                >
					{initialZoom && <ChangeView center={centerPoint} zoom={19} />}
                    <TileLayer
                        url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
                        maxZoom={20}
                        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
                    />
                    <TileLayer
                        attribution='&copy; <a href="http://www.openrailwaymap.org/">OpenRailwayMap</a>'
                        url="https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png"
                        maxZoom={20}
                    />

                    {/* at some point, we should be able to use this to filter companies leasing drones */}
                    {false && (
                        <FeatureGroup ref={groupRef} name="Drones">
                            <MarkerClusterGroup
                                ref={clusterRef}
                                iconCreateFunction={createClusters}
                            >
                                <GeoJSON
                                    data={appliedFilterData}
                                    key={geoJsonKey}
                                    onEachFeature={createPopups}
                                />
                            </MarkerClusterGroup>
                        </FeatureGroup>
                    )}
                    {true && (
                        <GeoJSON
                            data={appliedFilterData}
                            key={geoJsonKey}
                            onEachFeature={createPopups}
							
                        />
                    )}
                    <UpdateMapPosition
                        geoJsonKey={geoJsonKey}
                        groupRef={groupRef}
                        displayedMarkers={appliedFilterData}
                    />
                    <GetVisibleMarkers
                        geoJsonKey={geoJsonKey}
                        groupRef={groupRef}
                        clusterRef={clusterRef}
                        setVisibleMarkers={setVisibleMarkers}
                    />
                </MapContainer>
            </div>
        </div>
    );
};

export default Map;

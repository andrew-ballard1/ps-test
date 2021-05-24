import React from 'react';
import './App.css';
import '../node_modules/react-vis/dist/style.css';
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  LineSeries,
  DiscreteColorLegend
} from 'react-vis';


export default function LineChart(data){

  let formattedTempData = data.map((item, index) => {
    return {x: index, y: item.temperature}
  })

  let formattedChargingData = data.map((item, index) => {
    return {x: index, y: item.isCharging * 100}
  })

  let formattedBatteryData = data.map((item, index) => {
    return {x: index, y: item.battery}
  })

  return (
    <div className="LineChart" style={{display: 'flex', flexDirection: 'row'}}>
      <XYPlot height={300} width={500}>
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis title={'Time'}/>
        <YAxis left={15} title={'Temperature'} tickFormat={v => `${v} (C)`} />
        {/* <YAxis title={'Charging'} left={410} tickValues={[]}/> */}
        <LineSeries 
          title={'Temp (C)'}
          data={formattedTempData} 
          curve={'curveMonotoneX'}
        />
        <LineSeries 
            title={'Charging State'}
            data={formattedChargingData} 
            stroke={'#aa0000'}
        />
        <LineSeries 
            title={'Battery Level'}
            data={formattedBatteryData} 
            stroke={'#00aa00'}
        />
        <DiscreteColorLegend
          items={[{title: "Temp (C)", strokeWidth: 4}, {title: "Charging State", color:"#aa0000", strokeWidth: 4}, {title: "Battery level", color: "#00aa00", strokeWidth: 4}]}
          orientation={"horizontal"}
        />
      </XYPlot>
    </div>
  );
}
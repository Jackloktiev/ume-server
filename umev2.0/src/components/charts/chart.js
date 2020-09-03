import React from 'react';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryLine, VictoryLabel } from 'victory';
import "./chart.css";

function Chart(props) {
    const norm =
        [
            { x: 1, y: props.norm },
            { x: 2, y: props.norm },
            { x: 3, y: props.norm }
        ]


    const consumption =
        [
            { x: 1, y: 0 },
            { x: 2, y: props.consumption },
            { x: 3, y: 0 }
        ]

    const style = {
        textColor:"white",
        backgroundCol:"#2e279d",
        lineColor:"firebrick",
        barColor:"#dff6f0"
    }

    return (
        <div className="Chart">

            <VictoryChart
                domainPadding={10}
                style={{
                    parent: { backgroundColor: style.backgroundCol}
                }}
            >

                <VictoryAxis dependentAxis crossAxis
                    orientation="left"
                    style={{
                        axis: { stroke: style.textColor },
                        tickLabels: { fill: style.textColor }
                    }}
                />
                <VictoryAxis crossAxis
                    orientation="bottom"
                    tickFormat={() => ''}
                    style={{
                        axis: { stroke: style.textColor },
                        axisLabelComponent: { fill: style.textColor }
                    }}
                />
                <VictoryLine
                    data={norm}
                    style={{
                        data: { stroke: style.lineColor }
                    }}
                />

                <VictoryBar
                    data={consumption}
                    barWidth={30}
                    domainPadding={0}
                    style={{
                        data: { fill: style.barColor }
                    }}

                />
                
                <VictoryLabel 
                
                text = {props.nutrient.charAt(0).toUpperCase() + props.nutrient.substring(1)}
                x = {20} y={20}
                style={{fill:style.textColor}}
                />

            </VictoryChart>



        </div>
    )
}
export default Chart;

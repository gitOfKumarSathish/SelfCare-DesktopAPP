import React from "react";
import { Gauge } from ".";

export default class RadialGauges extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  // componentWillUnmount() {
  //   window.clearInterval(this.state.intervalHandler);
  // }
  render() {
    return (
      <div className="radialGauge">
        <Gauge
          key="radialGauge"
          width={400}
          height={400}
          //   title= {true}
          colorMajorTicks="rgb(75, 192, 192)"
          colorMinorTicks="rgb(53, 162, 235)"
          colorBarStroke="red"
          minValue={0}
          maxValue={220}
          minorTicks={10}
          majorTicks={[
            0, 10, 20, 30, 50, 60, 80, 100, 120, 140, 160, 180, 200, 220,
          ]}
          value={this.props.data}
          valueInt = '2'
          gaugeType="RADIAL"
          units="ms"
          highlights={[{ from: 140, to: 220, color: "rgba(200, 50, 50, .75)" }]}
          //   highlights={[
          //     { from: 0, to: 50, color: "rgba(0,255,0,.15)" },
          //     { from: 50, to: 100, color: "rgba(255,255,0,.15)" },
          //     { from: 100, to: 150, color: "rgba(255,30,0,.25)" },
          //     { from: 150, to: 200, color: "rgba(255,0,225,.25)" },
          //     { from: 200, to: 220, color: "rgba(0,0,255,.25)" },
          //   ]}
          // colorNumbers="blue"
          colorPlate="#fff"
          //   borderShadowWidth={0}
          borders={false}
          needleType="arrow"
          needleWidth={3}
          needleCircleSize={7}
          needleCircleOuter={true}
          needleCircleInner={false}
          animationDuration={500}
          animationRule="bounce"
          animationValue={true}
        />
      </div>
    );
  }
}

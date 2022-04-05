import { RadialGauge } from "canvas-gauges";
import React from "react";

class ReactCanvasGauge extends React.Component {
  componentDidMount() {
    const options = { ...this.props, renderTo: this.canvasRef };
    this.gauge = new RadialGauge(options).draw();
  }

  componentWillReceiveProps(props) {
    if (this.gauge) {
      this.gauge.update({ value: props.value });
    }
  }
  render() {
    return <canvas ref={node => (this.canvasRef = node)} />;
  }
}

export default ReactCanvasGauge;

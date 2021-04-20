import React, {Component, RefObject} from 'react';
import World from "./World";
import Color from "color";
import {RouteComponentProps} from "react-router-dom";

type TParams = { id?: string | undefined };

export default class App extends Component<RouteComponentProps<TParams>, {}> {
  canvas: React.Ref<HTMLCanvasElement>;
  cellSize: number;
  world: World;
  updateRate: number;
  tick: number;
  hue: number;
  hueStep: number;

  constructor(props: RouteComponentProps<TParams>) {
    super(props);
    this.canvas = React.createRef();
    this.cellSize = 5;

    let rule = 30;
    if (this.props.match.params.id ) {
      rule = parseInt(this.props.match.params.id, 10);
    }

    this.world = new World(1024,  rule);
    this.updateRate = 5;
    this.tick = 0;
    this.hue = 0;
    this.hueStep = 1;
  }

  componentDidMount() {
    this.resize();
    this.draw();
  }

  draw() {
    if (this.tick++ % this.updateRate == 0) {
      this.world.step(new Color('hsl(' + this.hue + ', 100%, 80%)'));

      let canvas = this.getCanvas();
      if (canvas) {
        this.resize();
        this.world.draw(canvas, this.cellSize, (window.innerHeight/2) / this.cellSize,false, true);
      }

      this.hue += this.hueStep;
      this.hue %= 360;
    }

    requestAnimationFrame(() => this.draw());
  }

  resize() {
    let canvas = this.getCanvas();
    if (canvas) {
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        this.world.resize(window.innerWidth / this.cellSize);
        this.world.set(
          Math.floor(this.world.width / 2),
          new Color('hsl(' + this.hue + ', 100%, 80%)')
        );
      }
    }
  }

  render() {
    return (
      <div>
        <canvas ref={this.canvas}/>
      </div>
    )
  }

  private getCanvas(): HTMLCanvasElement | null {
    let ref = this.canvas as RefObject<HTMLCanvasElement>;
    return ref.current;
  }
}
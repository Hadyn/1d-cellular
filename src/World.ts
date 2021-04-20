import Color from "color";

export default class World {
  width: number;
  rule: number;
  table: Map<number, number>;
  states: Array<Array<number>>;
  epoch: number;

  constructor(width: number, rule: number) {
    this.width = width;
    this.rule = rule;
    this.table = World.tableForRule(rule);
    this.states = new Array<Array<number>>();
    let state = new Array<number>(this.width);
    state.fill(0);
    this.states.push(state);
    this.epoch = 0;
  }

  set(x: number, color: Color) {
    let state = this.states[this.epoch];
    state[x] = color.rgbNumber();
  }

  setRule(rule: number) {
    this.rule = rule;
    this.table = World.tableForRule(rule);
  }

  step(color: Color) {
    let previousState = this.states[this.epoch];
    let state = new Array<number>(this.width);
    state.fill(0);

    for (let x = 0; x < this.width; x++) {
      let l = previousState[(((x - 1) % this.width) + this.width) % this.width] !== 0 ? 1 : 0;
      let c = previousState[x] !== 0 ? 1 : 0;
      let r = previousState[(x + 1) % this.width] !== 0 ? 1 : 0;

      let n = l << 2 | c << 1 | r;

      state[x] = this.table.get(n)! ? color.rgbNumber() : 0;
    }

    this.states.push(state);
    this.epoch++;
  }

  resize(width: number) {
    this.width = width;
    this.states = new Array<Array<number>>();
    let states = new Array<number>(this.width);
    states.fill(0);
    this.states.push(states);
    this.epoch = 0;
  }

  draw(canvas: HTMLCanvasElement, cellSize: number, window: number, flip: boolean, clear: boolean) {
    let ctx = canvas.getContext("2d")!;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let y = (canvas.height / 2) / cellSize - 1;

    for (let epoch = this.epoch; epoch >= Math.max(this.epoch - window, 0); epoch--) {
      let state = this.states[epoch];

      for (let x = 0; x < state.length; x++) {
        let value = state[x];
        if (value) {
          ctx.fillStyle = "#" + value.toString(16);
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
      y--;
    }

    y = (canvas.height / 2) / cellSize;

    for (let epoch = this.epoch; epoch >= Math.max(this.epoch - window, 0); epoch--) {
      let state = this.states[epoch];

      for (let x = 0; x < state.length; x++) {
        let value = state[x];
        if (value) {
          ctx.fillStyle = "#" + value.toString(16);
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
      y++;
    }
  }

  private static tableForRule(rule: number): Map<number, number> {
    let table = new Map<number, number>();
    for (let i = 0; i < 8; i++) {
      table.set(i, (rule & (1 << i)) != 0 ? 1 : 0);
    }
    return table;
  }
}

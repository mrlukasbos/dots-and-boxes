export const PlayerType = {
  HUMAN: 'human',
  GREEDY: 'greedy',
  MINMAX: 'minmax',
  RANDOM: 'random',
}

export default class Player {
    constructor(name, color, type) {
      this._name = name;
      this._color = color;
      this._type = type;
      this._score = 0;
    }
  
    incrementScore() { this._score++; }
    get score() { return this._score; }
    resetScore() { this._score = 0; }
    get color() { return this._color; }
    set color(color) { this._color = color }
    get name() { return this._name; }
    set name(name) { this._name = name }
    get type() { return this._type }
    set type(type) { this._type = type}

    get style() {
        return {
          background: this.color,
        }  
    }
  }

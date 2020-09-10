export default class Player {
    constructor(name, color) {
      this._name = name;
      this._color = color;
      this._score = 0;
    }
  
    incrementScore() { this._score++; }
    get score() { return this._score; }
    get color() { return this._color; }
    set color(color) { this._color = color }
    get name() { return this._name; }
    set name(name) { this._name = name }

    get style() {
        return {
          background: this.color,
        }  
    }
  }

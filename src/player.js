export default class Player {
    constructor(name, color, ai) {
      this._name = name;
      this._color = color;
      this._ai = ai;
      this._score = 0;
    }
  
    incrementScore() { this._score++; }
    get score() { return this._score; }
    set score(score) { this._score = score; }
    resetScore() { this._score = 0; }
    get color() { return this._color; }
    set color(color) { this._color = color }
    get name() { return this._name; }
    set name(name) { this._name = name }
    get ai() { return this._ai }
    set ai(ai) { this._ai = ai}

    get style() {
        return {
          background: this.color,
        }  
    }
  }

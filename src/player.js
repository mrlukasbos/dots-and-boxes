class Player {
    constructor(name, color) {
      this._name = name;
      this._color = color;
      this._score = 0;
    }
  
    incrementScore() {
      this._score++;
    }
  
    get score() {
      return this._score;
    }
    
    get color() {
      return this._color;
    }

    get name() {
      return this._name;
    }
  }
export default Player
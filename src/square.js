import Constants from './constants'

export const Direction = {
    TOP: 'top',
    BOTTOM: 'bottom',
    LEFT: 'left',
    RIGHT: 'right'
}

export function OppositeDirection(direction) {
    switch(direction) {
        case Direction.BOTTOM: return Direction.TOP;
        case Direction.TOP: return Direction.BOTTOM;
        case Direction.LEFT: return Direction.RIGHT;
        case Direction.RIGHT: return Direction.LEFT;
    }
}

export default class Square {
    constructor (pos) {
      this._pos = pos;
      this._edges = new Map();
      this._player = null;
    }

    get x() { return this._pos.x; }
    get y() { return this._pos.y; }
    set player(player) { this._player = player; }
    get player() { return this._player; }
    get edges() { return this._edges; }
    set edges(edges) { this._edges = edges; }

    setEdge(direction, edge) {
        this._edges.set(direction, edge);
    }

    getEdge(direction) {
        return this._edges.get(direction);
    }

    isFull() {
        return Array.from(this._edges.values()).every(value => {
            return value.clicked != null;
        })
    }
  
    get style() {
      return {
        left: (this._pos.x) * Constants.TILE_WIDTH + Constants.TILE_WIDTH/3 + "px",
        top: (this._pos.y) * Constants.TILE_HEIGHT + Constants.TILE_HEIGHT/3 + "px",
        width: Constants.TILE_WIDTH/2 + "px",
        height: Constants.TILE_HEIGHT/2 + "px",
        backgroundColor: this._player ? this._player.color : "transparent",
      }
    }

    copy() {
        let copy = new Square(this._pos);
        copy.edges = this._edges;
        copy.player = this._player;
        copy.edges = this._edges;
        return copy;
    }
  }
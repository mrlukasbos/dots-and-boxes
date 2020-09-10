import Constants from './constants'

export default class Edge {
  constructor(pos, vertical, squares) {
    this._pos = pos;
    this._clicked = null;
    this._vertical = vertical;
    this._squares = squares;
  }

  get x() { return this._pos.x; }
  get y() { return this._pos.y; }
  get clicked() { return this._clicked; }
  set clicked(player) { this._clicked = player; }
  get vertical() { return this._vertical; }
  get squares() { return this._squares; }
  
  get style() {
    let style = {};

    // vertical and horizontal edges are rendered differently 
    style.left = this.vertical ? this.x * Constants.TILE_WIDTH + "px" : this.x * Constants.TILE_WIDTH + Constants.BORDER_WIDTH + "px";
    style.top = this.vertical ? this.y * Constants.TILE_HEIGHT + Constants.BORDER_WIDTH + "px" : this.y * Constants.TILE_HEIGHT + "px";
    style.width = this.vertical ? Constants.BORDER_WIDTH + "px" : Constants.TILE_WIDTH - Constants.BORDER_WIDTH + "px";
    style.height = this.vertical ? Constants.TILE_HEIGHT - Constants.BORDER_WIDTH + "px" : Constants.BORDER_WIDTH + "px";
    
    if (this.clicked) {
        style.backgroundColor = this.clicked.color;
    }
    return style;
  }
}
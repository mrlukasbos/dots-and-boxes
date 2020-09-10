import Square, {Direction, OppositeDirection} from './square'
import Edge from './edge'
import Coord from './coord'

export default class Board {
    constructor(width, height, players) {
        this._width = width;
        this._height = height;
        this._players = players; 
        this._squares = [];
        this._edges = [];
        this._currentPlayerIndex = 0;
        this._winner = null;
        this._draw = false
        
        this.createSquares();
        this.createEdges();    
    }

    get width() { return this._width; }
    get height() { return this._height; }
    get edges() { return this._edges }
    get squares() { return this._squares }
    get currentPlayer() { return this.getCurrentPlayer() }
    get players() { return this._players }
    get winner() { return this._winner; }
    get draw() { return this._draw } 

    getSquare(x, y) {
        let column = this.squares[x];
        if (column == null) return null;
        return column[y];
    }
  
    getAllSquares() {
        return this.squares.flat();
    }

    goToNextPlayer() {
        this._currentPlayerIndex = (this._currentPlayerIndex + 1) % this._players.length;
    }

    getCurrentPlayer() {
        return this._players[this._currentPlayerIndex]
    }

    selectEdge(edge) {
        if (edge.clicked) return;

        edge.clicked = this.currentPlayer;
        let didFillSquare = false;
        edge.squares.forEach(square => {
        if (square.isFull()) {
            square.player = this.currentPlayer;
            this.currentPlayer.incrementScore();
            didFillSquare = true;
        }
        })
        
        if (!didFillSquare) { 
            this.goToNextPlayer()
        } else {
            this.checkWinner();
        }
    }

    gameIsFinished() {
        return this.getAllSquares().every(square => {
            return square.player != null;
        });
    }

    getPlayersSortedByScore() {
        return this.players.slice().sort((p1, p2) => { 
            return p1.score < p2.score
        })
    }

    gameIsDrawn() {
        let players = this.getPlayersSortedByScore();
        return this.gameIsFinished() && players[0].score == players[1].score
    }

    hasWinner() {
       return this.gameIsFinished() && !this.gameIsDrawn()
    }

    checkWinner() {
        if (this.hasWinner()) {
            this._winner = this.getPlayersSortedByScore()[0]  
        } else if (this.gameIsDrawn()) {
            this._draw = true;
        } else {
            this._winner = null;
            this._draw = false;
        }
    }

    createSquares() {
        // initialize all squares
        for (let x = 0; x < this.width; x++) {
            let row = [];
            for (let y = 0; y < this.height; y++) {
                row.push(new Square(new Coord(x,y)));
            }
            this._squares.push(row);
        }
    }

    createEdges() {
        // generate edges from squares
        this._squares.forEach(square_array => {
            square_array.forEach(square => {
            let directionalSquares = [
                {direction: Direction.TOP, square: this.getSquare(square.x, square.y - 1)},
                {direction: Direction.LEFT, square: this.getSquare(square.x - 1, square.y)},
            ];

            directionalSquares.forEach((direction_and_square) => {
                let directional_square = direction_and_square.square;
                let direction = direction_and_square.direction;
                if (directional_square == null) {
                let edge = new Edge(new Coord(square.x, square.y), direction === Direction.LEFT, [square]);
                square.setEdge(direction, edge);
                this._edges.push(edge);
                } else {
                square.setEdge(direction, directional_square.getEdge(OppositeDirection(direction)));
                }
            })
            
            directionalSquares = [
                {direction: Direction.RIGHT, square: this.getSquare(square.x + 1, square.y)},
                {direction: Direction.BOTTOM, square:this.getSquare(square.x, square.y + 1)},
            ];

            directionalSquares.forEach(direction_and_square => {
                let directional_square = direction_and_square.square;
                let direction = direction_and_square.direction;
                let edgesquares = [square];
                if (directional_square != null) edgesquares.push(directional_square);

                let edge; 
                if (direction === Direction.RIGHT ){ 
                edge = new Edge(new Coord(square.x+1, square.y), true, edgesquares);
                } else {
                edge = new Edge(new Coord(square.x, square.y+1), false, edgesquares);
                }             
                square.setEdge(direction, edge);
                this._edges.push(edge);
            })
        })
    })
    }
}
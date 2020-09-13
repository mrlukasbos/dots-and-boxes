import Square, {Direction, OppositeDirection} from './square'
import Edge from './edge'
import Coord from './coord'
import Ai from './ai';
import { PlayerType } from './player';

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
    }

    get width() { return this._width; }
    get height() { return this._height; }
    get edges() { return this._edges }
    get squares() { return this._squares }
    get currentPlayer() { return this.getCurrentPlayer() }
    get players() { return this._players }
    get winner() { return this._winner; }
    get draw() { return this._draw } 

    // return square at a given coordinate, null if it does not exist
    getSquare(x, y) {
        let column = this.squares[x];
        if (column == null) return null;
        return column[y];
    }

    getEdge(x, y, vertical) {
        return this.edges.find(edge => {
            return edge.x === x && edge.y === y && edge.vertical === vertical;
        })
    }

    getPlayerByName(name) {
        return this.players.find(player => {
            return player.name === name
        })
    }

    // returns a single array containing all squares
    getAllSquares() {
        return this.squares.flat();
    }

    checkForAIMove() {
        switch (this.getCurrentPlayer().type) {
            case PlayerType.RANDOM: {
                this.selectEdge(Ai.getRandomMove(this));
                break;
            }
            case PlayerType.MINMAX: {
                this.selectEdge(Ai.getBestMove(this));
                break;
            }
            case PlayerType.GREEDY: {
                this.selectEdge(Ai.getGreedyBestMove(this));
                break;
            }
            default: break;
        }
    }

    start() {
        this.players.forEach(player => {
            player.resetScore();
        })
        this.checkForAIMove();
    }

    goToNextPlayer() {
        this._currentPlayerIndex = (this._currentPlayerIndex + 1) % this._players.length;
        this.checkForAIMove();
    }

    getCurrentPlayer() {
        return this._players[this._currentPlayerIndex]
    }

    // Handle the selection of an edge. To be called by the current player.
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
            if (!this.gameIsFinished()) this.checkForAIMove();
        }
    }

    // the game is finished when all squares are 'taken' by a player
    gameIsFinished() {
        return this.getAllSquares().every(square => {
            return square.player != null;
        });
    }

    // returns a copy of the players array, sorted on score
    getPlayersSortedByScore() {
        return this.players.slice().sort((p1, p2) => { 
            return p1.score < p2.score
        })
    }

    // returns true if the game is finished and it is a draw
    gameIsDrawn() {
        let players = this.getPlayersSortedByScore();
        return this.gameIsFinished() && players[0].score === players[1].score
    }

    hasWinner() {
       return this.gameIsFinished() && !this.gameIsDrawn()
    }

    // to be called to update the winner variables
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

    create() {
        this.createSquares();
        this.createEdges();    
    }

    // construct the squares of the board
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

    // construct the edges of the board using the squares
    // To prevent duplicate edges, the top and left edges are defined by their neighbours right-and bottom edges.
    // the bottom and right edges are always created for each square. 
    createEdges() {
        this._squares.forEach(square_array => {
            square_array.forEach(square => {
                this.createTopAndLeftEdges(square);
                this.createBottomAndRightEdges(square);
        })
    })
    }

    createTopAndLeftEdges(square) {
        let directionalSquares = [
            {direction: Direction.TOP, square: this.getSquare(square.x, square.y - 1)},
            {direction: Direction.LEFT, square: this.getSquare(square.x - 1, square.y)},
        ];
        
        directionalSquares.forEach(direction_and_square => {
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
    }

    createBottomAndRightEdges(square) {
        let directionalSquares = [
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
    }
}
import Square, {Direction, OppositeDirection} from './square'
import Edge from './edge'
import Coord from './coord'
import Ai from './ai';
import Player from './player';

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
        if (this.getCurrentPlayer().ai) {
            let randomMove = Ai.getBestMove(this);
            this.selectEdge(randomMove);
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
        
        console.log("selected new edge: ", edge);

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
        return this.gameIsFinished() && players[0].score == players[1].score
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

    copy() {

        let simulatedPlayers = [];
        this.players.forEach(player => {
            let new_player = new Player(player.name, player.color);
            new_player.score = player.score;
            simulatedPlayers.push(new_player);
        });

        let clone = new Board(this.width, this.height, simulatedPlayers);
        clone._currentPlayerIndex = this._currentPlayerIndex;
        
        // copy all edges
        this.edges.forEach(real_edge => { 
            let copy = real_edge.copy();
            if (copy.clicked) {
                copy.clicked = clone.getPlayerByName(real_edge.clicked.name); // refresh reference
            } else {
                copy.clicked = null;
            }
            clone.edges.push(copy);
        });

        // copy all squares
        this.squares.forEach(row => { 
            let cloned_row = [];
            row.forEach(real_square => {
                let copy = real_square.copy();
                if (real_square.player) {
                    copy.player = clone.getPlayerByName(real_square.player.name); // refresh reference
                }
                cloned_row.push(copy) 
            })
            clone.squares.push(cloned_row);           
        });

        // for each cloned edge, we must replace the references of the squares with a cloned square
        clone.edges.forEach(cloned_edge => { 
            return cloned_edge.squares.map(square => {
                return clone.getSquare(square.x, square.y);
            })
        });

        // for each cloned square, we must replace references to the edges with cloned edges
        clone.getAllSquares().forEach(square => { 
            Array.from(square.edges.keys()).forEach(direction => { // for each direction
                let ref_edge = square.getEdge(direction);
                square.edges[direction] = clone.getEdge(ref_edge.x, ref_edge.y, ref_edge.vertical);
            })
        });

        clone.checkForAIMove = function() {
            // do nothing
        }

        return clone;
    }
}
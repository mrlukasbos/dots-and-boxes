<template>
  <div id="app">
    <div class="game">
      <div class="board-wrapper">
        <div class="board" :style="boardStyle">
          <div v-for="(row, index) in squares" :key="'row'+index">
            <div v-for="(square, index) in row" :key="'square'+index">
              <div class="bg-square" :style="square.style"/>
            </div>
          </div>
          <div v-for="edge in edges" :key="edge.clicked + '-' + edge.vertical + '-' + edge.x + ',' + edge.y " class="edge" :style="edge.style" v-on:click="clickEdge(edge)"> </div>
        </div>
      </div>

      <div class="controls">
        <div class="players"> 
          <div v-for="player in players" :key="player.name" class="player">
            <div class="player-indicator" :class="{'current': (player === currentPlayer)}" :style="player.style"/>
            {{player.name}} ({{player.score}})
          </div>
        </div>

        <div v-if="winner"> 
          Game finished! The winner is <strong> {{winner.name}} </strong>
        </div>
        <div v-if="draw"> 
          Game finished! It is a <strong> Draw </strong>
        </div>
        
        <button class="button" v-on:click="init">Restart game</button>
      </div>

    </div>
  </div>
</template>

<script>
import Player from './player';
import Square, {Direction, OppositeDirection} from './square';
import Edge from './edge'
import Coord from './coord'
import constants from './constants';

export default {
  name: 'App',
  data: function() {
    return {
      amount_horizontal_tiles: 3,
      amount_vertical_tiles: 3,
      squares: [],
      edges: [],
      winner: null,
      draw: false,
      players: [],
      currentPlayerIndex: 0,
    }
  },

  computed: {
    currentPlayer: function() {
      return this.players[this.currentPlayerIndex]
    },
    gameFinished: function() {
      return this.squares.every(square => {
        return square.player != null;
      })
    },
    boardStyle: function() {
      return {
        width: this.amount_horizontal_tiles * constants.TILE_WIDTH + constants.BORDER_WIDTH + "px",
        height: this.amount_vertical_tiles * constants.TILE_HEIGHT + constants.BORDER_WIDTH + "px",
      }
    }
  },

  beforeMount: function() {
   this.init();
  },
  
  methods: {
    clickEdge: function(edge) {
      if (edge.clicked) return;
      edge.clicked = this.currentPlayer;
      let didFillSquare = false;
      edge.squares.forEach(square => {
        if (square.isFull()) {
          this.currentPlayer.incrementScore();
          square.player = this.currentPlayer;
          didFillSquare = true;
        }
      })
        
      if (!didFillSquare) { 
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
      } else {
        this.checkForWinner();
      }
    },

    getSquare: function(x, y) {
      let column = this.squares[x];
      if (column == null) return null;
      return column[y];
    },

    getAllSquares() {
      return this.squares.flat();
    },

    checkForWinner() {
      if (this.getAllSquares().every(square => {
          return square.player != null;
      })) { 
      // non-descructive sort
      let playersSortedByScore = this.players.slice().sort((p1, p2) => { 
        return p1.score < p2.score
      })

      if (playersSortedByScore[0].score === playersSortedByScore[1].score) {
        this.winner = null;
        this.draw = true;
      } else {
        this.winner = playersSortedByScore[0];
      }

      } else {
        this.winner = null;
        this.draw = false;
      }
    },
  

    init: function() {
      this.squares = [];
      this.players = [new Player("Player one", "purple"), new Player("Player two", "green"), new Player("Player three", "blue")]

      // initialize all squares
      for (let x = 0; x < this.amount_horizontal_tiles; x++) {
        let row = [];
        for (let y = 0; y < this.amount_vertical_tiles; y++) {
          row.push(new Square(new Coord(x,y)));
        }
        this.squares.push(row);
      }

      // generate edges from squares
      this.squares.forEach(square_array => {
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
              this.edges.push(edge);
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
            this.edges.push(edge);
          })
        })
      })
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.game {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  background-color: whitesmoke;
  border: 3px solid gray;
  padding: 24px;
  margin-top: 50px;
}

.board-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 24px;
  background-color: white;
  margin-right: 12px;
}

.board {
  position: relative;
}

.squares {
  left: 0;
  right: 0;
  position: absolute;
  display: flex;
}

.edges {
  left: 0;
  right: 0;
  position: absolute;
}

.bg-square {
  position: absolute;
  display: flex;
  justify-content: center;
  flex-direction: column;
  border-radius: 50%;
}

.edge {
  background: lightgray;
  position: absolute;
  border-radius: 4px;
  cursor: pointer;
  transition: background .3s;
}

.players {
  position: relative;
}

.player {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.player-indicator {
  width: 20px;
  height: 20px;
  margin: 8px;
  border: 3px solid whitesmoke;
}

.player-indicator.current {
  border: 3px solid red;
}

.controls {
  position: relative;
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.button {
  width: 100%;
  background-color: teal;
  border: none;
  height: 54px;
  color: white;
}
</style>

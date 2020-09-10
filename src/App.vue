<template>
  <div id="app">
    <div class="game">

      <div class="board">
        <div v-for="(row, index) in squares" :key="'row'+index">
          <div v-for="(square, index) in row" :key="'square'+index">
            <div class="bg-square" :style="squareStyle(square)"/>
          </div>
        </div>
        <div v-for="edge in edges" :key="edge.clicked + '-' + edge.vertical + '-' + edge.x + ',' + edge.y " class="edge" :style="edgeStyle(edge)" v-on:click="clickEdge(edge)"> </div>
      </div>

      <div class="controls">
        <h3> Dots and Boxes </h3>
        <div class="players"> 
          <div v-for="player in players" :key="player.name" class="player">
            <div class="player-indicator" :class="{'current': (player == currentPlayer)}" :style="playerStyle(player)"/>
            {{player.name}} ({{getAmountOfSquares(player)}})
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

// global constants
const TILE_WIDTH = 50; // px
const TILE_HEIGHT = 50; // px
const BORDER_WIDTH = 8; // px

export default {
  name: 'App',
  data: function() {
    return {
      amount_horizontal_tiles: 5,
      amount_vertical_tiles: 5,
      squares: [],
      edges: [],
      winner: null,
      draw: false,
      players: [{
        name: "Player one",
        color: "green"
      }, {
        name: "Player two",
        color: "blue"
      },
      {
        name: "Player three",
        color: "purple"
      }],
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
  },

  beforeMount: function() {
   this.init();
  },
  
  methods: {
    clickEdge: function(edge) {
      edge.clicked = this.currentPlayer;

      let didFillSquare = false;
      edge.squares.forEach(square => {
        if (this.isFull(square)) {
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

    isFull(square) {
      return square && square.left_edge.clicked && square.top_edge.clicked && square.right_edge.clicked && square.bottom_edge.clicked;
    },

    squareStyle: function(square) {
      return {
        left: (square.x) * TILE_WIDTH + TILE_WIDTH/3 + "px",
        top: (square.y) * TILE_HEIGHT + TILE_HEIGHT/3 + "px",
        width: TILE_WIDTH/2 + "px",
        height: TILE_HEIGHT/2 + "px",
        backgroundColor: square.player ? square.player.color : "transparent",
      }
    },

    playerStyle: function(player) {
      return {
        background: player.color,
      }
    },

    edgeStyle: function(edge) {
      let style = {};
      style.left = edge.vertical ? edge.x * TILE_WIDTH + "px" : edge.x * TILE_WIDTH + BORDER_WIDTH + "px";
      style.top = edge.vertical ? edge.y * TILE_HEIGHT + BORDER_WIDTH + "px" : edge.y * TILE_HEIGHT + "px";
      style.width = edge.vertical ? BORDER_WIDTH + "px" : TILE_WIDTH - BORDER_WIDTH + "px";
      style.height = edge.vertical ? TILE_HEIGHT - BORDER_WIDTH + "px" : BORDER_WIDTH + "px";
      if (edge.clicked) {
          style.backgroundColor = edge.clicked.color;
      }
      return style;
    },

    getSquare: function(x, y) {
      let column = this.squares[x];
      if (column == null) return null;
      return column[y];
    },

    getAllSquares() {
      return this.squares.flat();
    },

    getAmountOfSquares(player) {
        return this.getAllSquares().filter(square => {
          return square.player === player;
        }).length
    },

    checkForWinner() {
      if (this.getAllSquares().every(square => {
          return square.player != null;
      })) { 

      // non-descructive sort
      let playersSortedByScore = this.players.slice().sort((p1, p2) => { 
        return this.getAmountOfSquares(p1) < this.getAmountOfSquares(p2)
      })

      if (this.getAmountOfSquares(playersSortedByScore[0]) === this.getAmountOfSquares(playersSortedByScore[1])) {
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

      // initialize all squares
      for (let x = 0; x < this.amount_horizontal_tiles; x++) {
        let row = [];
        for (let y = 0; y < this.amount_vertical_tiles; y++) {
          let new_square = {
            x: x, 
            y: y,
          };
          row.push(new_square);
        }
        this.squares.push(row);
      }

    // generate edges from squares
    this.squares.forEach(square_array => {
      square_array.forEach(square => {

      let topSquare = this.getSquare(square.x, square.y - 1);
      let bottomSquare = this.getSquare(square.x, square.y + 1);
      let leftSquare = this.getSquare(square.x-1, square.y);
      let rightSquare = this.getSquare(square.x +1, square.y);

      if (topSquare == null) {
        square.top_edge = {
          x: square.x,
          y: square.y,
          vertical: false,
          clicked: false,
          squares: [square]
        }
        this.edges.push(square.top_edge);
      } else {
        square.top_edge = topSquare.bottom_edge;
      }

      if (leftSquare == null) {
        square.left_edge = {
          x: square.x,
          y: square.y,
          vertical: true,
          clicked: false,
          squares: [square]
        }
        this.edges.push(square.left_edge);
      } else {
        square.left_edge = leftSquare.right_edge;
      }
      
      square.right_edge = {
        x: square.x + 1,
        y: square.y,
        vertical: true,
        clicked: false,
        squares: [square, rightSquare]
      }
      this.edges.push(square.right_edge);
      
      square.bottom_edge = {
        x: square.x,
        y: square.y + 1,
        vertical: false,
        clicked: false,
        squares: [square, bottomSquare]
      }
      this.edges.push(square.bottom_edge);
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
  width: 600px;
  margin-top: 50px;
}

.board {
  position: relative;
  width: 300px;
  height: 300px;
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
}

.edge:hover {
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

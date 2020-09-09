<template>
  <div id="app">
    <div v-for="(row, index) in squares" :key="'square'+index">
      <div v-for="(square, index) in row" :key="'square'+index">
        <div class="bg-square" :style="squareStyle(square)"> 
          <!-- {{square.x}} {{square.y}}  -->
        </div>
      </div>
    </div>
    <div v-for="edge in edges" :key="edge.clicked + '-' + edge.vertical + '-' + edge.x + ',' + edge.y " class="edge" :style="edgeStyle(edge)" v-on:click="clickEdge(edge)"> </div>
    <button v-on:click="init">Restart game</button>
  </div>
</template>

<script>

// global constants
const TILE_WIDTH = 100;
const TILE_HEIGHT = 100;

export default {
  name: 'App',
  data: function() {
    return {
      amount_horizontal_tiles: 5,
      amount_vertical_tiles: 5,
      squares: [],
      edges: [],
    }
  },

  beforeMount: function() {
   this.init();
  },
  
  methods: {
    clickEdge: function(edge) {
      edge.clicked = true;        
    },
    squareStyle: function(square) {
      console.log(square);
      let full = square.left_edge.clicked && square.top_edge.clicked && square.right_edge.clicked && square.bottom_edge.clicked;
      return {
        left: (square.x) * TILE_WIDTH + 8 + "px",
        top: (square.y) * TILE_HEIGHT + 8 + "px",
        width: TILE_WIDTH - 8 + "px",
        height: TILE_HEIGHT - 8 + "px",
        backgroundColor: full ? "red" : "white",
      }
    },
    edgeStyle: function(edge) {
      let edge_width = 8; // px
      return {
        left: edge.vertical ? edge.x * TILE_WIDTH + "px" : edge.x * TILE_WIDTH + edge_width + "px",
        top: edge.vertical ? edge.y * TILE_HEIGHT + edge_width + "px" : edge.y * TILE_HEIGHT + "px",
        width: edge.vertical ? edge_width +"px" : TILE_WIDTH - edge_width + "px",
        height: edge.vertical ? TILE_HEIGHT - edge_width + "px" : edge_width + "px",
        backgroundColor: edge.clicked ? "blue" : "red"
      }
    },
    getSquare: function(x, y) {
      let column = this.squares[x];
      if (column == null) return null;
      return column[y];
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
          bottom_square: square,
          top_square: null,
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
          left_square: null,
          right_square: square,
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
        left_square: square,
        right_square: rightSquare,
      }
      this.edges.push(square.right_edge);
      
      square.bottom_edge = {
        x: square.x,
        y: square.y + 1,
        vertical: false,
        clicked: false,
        top_square: square,
        bottom_square: bottomSquare,
      }
      this.edges.push(square.bottom_edge);

        console.log(square.x, square.y);

      if(square.top_edge == null ) {
        console.log("top not defined")
      }

      if(square.left_edge == null ) {
        console.log("left not defined")
      }
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
}

html, body {
  margin: 0;
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
}


.bg-square.selected {
 background-color: red;
}

.edge {
  background: blueviolet;
  position: absolute;
  border-radius: 4px;
}

.edge:hover {
  background: pink;
}

.vertical-edge {
  width: 10px;
  height: 100px;
  position: fixed;
}

.horizontal-edge {
  height: 10px;
  width: 100px;
}

.row{
  display: flex;
  flex-direction: row;
}

</style>

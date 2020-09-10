<template>
  <div id="app">
    <div class="game">
      <board-view :board="board"/>
      <div class="controls">
        <players-view :board="board"/>
        <div v-if="board.winner"> 
          Game finished! The winner is <strong> {{board.winner.name}} </strong>
        </div>
        <div v-if="board.gameIsDrawn()"> 
          Game finished! It is a <strong> Draw </strong>
        </div>
        <button class="button" v-on:click="init"> Restart game </button>
      </div>
    </div>
  </div>
</template>

<script>
import PlayersView from './components/players'
import BoardView from './components/board'
import Player from './player'
import Board from './board'

export default {
  name: 'App',
  components: {
    'players-view': PlayersView,
    'board-view': BoardView,
  },
  data: function() {
    return {
      board: null,
      config: {
        width: 5,
        height: 5,
      },
    }
  },

  beforeMount: function() {   
    this.init();     
  },
  
  methods: {
    init: function() {
      this.players = [
        new Player("player 1", "purple"),
        new Player("player 2", "green"),
        new Player("player 3", "blue"),
      ]
      this.board = new Board(this.config.width, this.config.height, this.players);
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

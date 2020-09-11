<template>
  <div id="app">
    <config-view :visible="showConfigModal" v-on:apply="init" v-on:closeModal="showConfigModal = false" :config="config"/>
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
        <div class="buttons">
          <button class="button secondary" v-on:click="showConfigModal = true"> Configuration </button>
          <button class="button" v-on:click="init"> Restart game </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PlayersView from './components/players'
import BoardView from './components/board'
import ConfigView from './components/config'

import Player, {PlayerType} from './player'
import Board from './board'
 
export default {
  name: 'App',
  components: {
    'players-view': PlayersView,
    'board-view': BoardView,
    'config-view': ConfigView,
  },
  data: function() {
    return {
      board: null,
      showConfigModal: false,
      config: {
        width: 2,
        height: 2,
        players: [
          new Player("John", "purple", PlayerType.MINMAX),
          new Player("Mike", "orange", PlayerType.GREEDY),
        ]
      },
    }
  },

  beforeMount: function() {   
    this.init();     
  },
  
  methods: {
    init: function() {
      this.board = new Board(this.config.width, this.config.height, this.config.players);
      this.board.create();
      this.board.start();
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
  border-radius: 12px;
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
  background-color: slateblue;
  border: none;
  height: 46px;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  margin: 2px;
}


.button.small {
  width: auto;
  height: 32px;
}

.link {
  color: slateblue;
  font-weight: bold;
  font-size: 1.2rem;
  border-radius: 16px;
  cursor: pointer;
  padding: 4px 10px;
}

.link:hover {
  background-color: #efefef;
  
}

.link.danger {
  color: orangered; 
}

.button.secondary {
  background-color: gray;
}

.button:hover {
  opacity: .8;
  transition: opacity 0.3s;
}

.buttons {
  display: flex;
  flex-direction: row;
}
</style>

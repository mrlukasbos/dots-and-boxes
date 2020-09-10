<template>
<div class="board-wrapper">
    <div class="board" :style="boardStyle">
        <div v-for="(row, index) in board.squares" :key="'row'+index">
            <div v-for="(square, index) in row" :key="'square'+index">
                <div class="bg-square" :style="square.style"/>
            </div>
        </div>
        <div v-for="edge in board.edges" :key="edge.clicked + '-' + edge.vertical + '-' + edge.x + ',' + edge.y " class="edge" :style="edge.style" v-on:click="board.selectEdge(edge)"/>
    </div>
</div>
</template>

<script>
import constants from '../constants'


export default {
  name: 'board',
  props: [
    'board',
  ],
  computed: {
    boardStyle: function() {
      return {
        width: this.board.width * constants.TILE_WIDTH + constants.BORDER_WIDTH + "px",
        height: this.board.height * constants.TILE_HEIGHT + constants.BORDER_WIDTH + "px",
      }
    }
  }
}
</script>

<style scoped>
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
</style>

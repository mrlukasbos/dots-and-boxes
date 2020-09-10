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
.board-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 24px;
  background-color: white;
  margin-right: 12px;
  border-radius: 4px;
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
</style>

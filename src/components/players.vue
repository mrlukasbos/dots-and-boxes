<template>
    <div class="players"> 
        <div v-for="player in board.players" :key="player.name" class="player">
        <div class="player-indicator" :class="{'current': (player === board.currentPlayer)}" :style="player.style"/>
        <span :class="{'current': (player === board.currentPlayer)}">{{player.name}} ({{player.score}}) </span>
        </div>
    </div>
</template>

<script>
export default {
  name: 'players',
  props: [
    'board',
  ]
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

.current {
    font-weight: bold;    
}
</style>

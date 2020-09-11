<template>
    <div class="players"> 
        <div v-for="player in board.players" :key="player.name" class="player">
          <div class="player-indicator" :class="{'current': (player === board.currentPlayer)}" :style="player.style"/>
          <span :class="{'current': (player === board.currentPlayer)}">{{player.name}} </span>
          <span class="player-type"> {{player.type}} </span>
          <span>({{player.score}}) </span>
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

.player-type {
  background: black;
  color: white;
  font-weight: bold;
  font-size: 0.7rem;
  margin: 0px 6px;
  padding: 0px 4px;
  border-radius: 4px;
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

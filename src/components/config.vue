<template>
    <div v-if="visible" class="config-modal" v-on:click.self="closeModal"> 
       <div class="modal-box">
            <h1> Configuration </h1>
            <div class="game-settings">
                <h4> Game dimensions </h4>
                Width <input class="number-input" type="number" v-model="config.width" placeholder="0"/>
                Height <input class="number-input" type="number" v-model="config.height" placeholder="0"/>
            </div>

            <div class="player-settings">
                <h4> Players </h4>
                <div v-for="(player,index) in config.players" :key="index" class="player"> 
                    <span> <input v-model="player.name" type="text" placeholder="Name"/> </span>
                    <select v-model="player.color">
                        <option disabled value="">Please select one</option>
                        <option v-for="color in available_colors" :key="color"> {{color}}</option>
                    </select>                    
                    <select v-model="player.type">
                        <option disabled value="">Please select one</option>
                        <option v-for="type in availabe_player_types()" :key="type"> {{type}}</option>
                    </select>        
                    <span> <a class="link small danger" v-on:click="removePlayer(player)"> ✕ </a> </span>
                </div> 
                <hr> 
                <div class="player new">
                    <span> <input v-model="new_player.name" type="text" placeholder="Name"/> </span>
                    <select v-model="new_player.color">
                        <option disabled value="">Please select one</option>
                        <option v-for="color in available_colors" :key="color"> {{color}}</option>
                    </select>
                    <select v-model="new_player.type">
                        <option disabled value="">Please select one</option>
                        <option v-for="type in availabe_player_types()" :key="type"> {{type}}</option>
                    </select>                    
                    <span> <a class="link small" v-on:click="addPlayer"> &#43; </a> </span>
                </div>
            </div>

            <div class="buttons">
                <button class="button secondary" v-on:click="closeModal"> Cancel </button>
                <button class="button" v-on:click="apply"> Start </button>
            </div>
        </div>
    </div>
</template>

<script>
import Player, {PlayerType} from '../player'
export default {
  name: 'config',
  props: ['config', 'visible'],
  data: function() {
      return {
          new_player: new Player("", "", PlayerType.HUMAN),
          available_colors: ["magenta", "salmon", "gold", "blue", "steelblue", "aquamarine", "blueviolet", "coral", "dodgerblue", "purple", "orange"].sort()
    }
  },
  methods: {
      availabe_player_types() {
        var all = [];
        for(let key in PlayerType){
            all.push(PlayerType[key]);
        }
        return all;
      },
      addPlayer() {
          this.config.players.push(this.new_player)
          this.new_player = new Player("", "", PlayerType.HUMAN)
      },
      removePlayer(player) {
            const index = this.config.players.indexOf(player);
            if (index > -1) {
                this.config.players.splice(index, 1);
            }
      },
      closeModal() {
          this.$emit("closeModal");
      },
      apply() {
          this.$emit("apply")
          this.closeModal();
      }
  }
}
</script>

<style scoped>
.config-modal {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 1;
    display: flex;
    justify-content: center;
}

.modal-box {
    border-radius: 12px;
    position: relative;
    background-color: white;
    margin-top: 200px;
    width: 600px;
    height: 600px;
    padding: 12px 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.number-input {
    width: 40px;
    font-size: 1.2rem;
}

input {
    border: none;
    font-size: 1rem;
    width: 120px;
    outline: none;
}

select {
    border: none;
    font-size: 1rem;
    width: 120px;
    outline: none;
    margin-right: 24px;
}

.game-settings {
    display: block;
}

.player-settings {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.player { 
    display: flex;
    flex-direction: row;
}


</style>

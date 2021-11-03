import player from './player.js';

export default class Team {
  constructor(teamID) {
    this.id = teamID;
    this.players = [];
  }

  addPlayer(player) {
    this.players.push(player);
  }

  removePlayer(nickName) {
    for (let index = 0; index < this.players.length; index++) {
      if (this.players[index].nickname === nickName) {
        this.players.splice(index, 1);
      }
    }
  }

  findPlayer(playerNickname) {
    for (let index = 0; index < this.players.length; index++) {
      if (this.players[index].nickname === playerNickname) {
        return this.players[index];
      }
    }
  }
}

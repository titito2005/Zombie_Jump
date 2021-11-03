import team from './team.js';
import Message from './message.js';
import timer from './timer.js';
import Timer from './timer.js';

export default class Session {
  constructor() {
    this.timer = new Timer();
    this.timer.on('timeout', ()=>{
      this.skipTurn();
    });
    this.turnDuration = 15;
    this.sessionId;
    this.team = [new team(1), new team(2), new team(3), new team(4)];
    this.teamId = 5;
    this.playersConnectedCount = 0;
    this.currentTurn = 0;
  }

  removeTeam(teamID) {
    for (let index = 0; index < this.team.length; index++) {
      if (this.team[index].id == teamID) {
        this.team.splice(index, 1);
      }
    }
  }

  addTeam() {
    this.team.push(new team(teamId));
    this.teamId++;
  }

  addPlayer(player, teamId) {
    for (let index = 0; index < this.team.length; index++) {
      if (this.team[index].id === teamId) {
        this.team[index].addPlayer(player);
        this.playersConnectedCount++;
      }
    }
  }

  findPlayer(playerNickname) {
    for (let index = 0; index < this.team.length; index++) {
      return this.team[index].findPlayer(playerNickname);
    }
  }

  deletePlayer(playerNickname) {
    for (let index = 0; index < this.team.length; index++) {
      this.team[index].removePlayer(playerNickname);
      this.playersConnectedCount--;
    }
  }

  increasePlayersConnectedCount() {
    this.playersConnectedCount++;
  }

  expectedConnectionsCount() {
    let expectedConnections = 0;
    for (let teamIndex = 0; teamIndex < this.team.length; teamIndex++) {
      expectedConnections += this.team[teamIndex].players.length;
    }
    return expectedConnections;
  }

  generateTurnOrder() {
    this.turnOrder = [];
    // todo: pensar bien en este algoritmo para generar el orden de los turnos
    for (let teamIndex = 0; teamIndex < this.team.length; teamIndex++) {
      for (let playerIndex = 0; playerIndex < this.team[teamIndex].players.length; playerIndex++) {
        this.turnOrder.push(this.team[teamIndex].players[playerIndex].nickname);
      }
    }
  }
  //empieza un turno
  getWhosTurn() {
    return this.turnOrder[this.currentTurn++ % this.turnOrder.length];
  }
  skipTurn(){
    let msg = new Message('SkipTurn');
    msg.whosTurn = this.getWhosTurn();
    msg.teamTurnId = this.findPlayer(msg.whosTurn).id;
    this.timer.timeRemaining = this.turnDuration;
    this.broadcastToAllPlayers(JSON.stringify(msg));
  }

  // Envia un mensaje a todos los jugadores que esten en esta sesi�n.
  broadcastToAllPlayers(jsonMessage) {
    for (let teamIndex = 0; teamIndex < this.team.length; teamIndex++) {
      for (let playerIndex = 0; playerIndex < this.team[teamIndex].players.length; playerIndex++) {
        this.team[teamIndex].players[playerIndex].socket.send(jsonMessage);
      }
    }
  }
}

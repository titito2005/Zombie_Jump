export default class Player {
  constructor(nickname, id, socket, host = false) {
    this.id = id;
    this.nickname = nickname;
    this.score = 0;
    this.socket = socket;
    this.host = host;
  }

  addScore(points) {
    this.score += points;
  }

  getRivals() {
    const rivals = [];
    const players = Player.getAllPlayers();
    for (let index = 0; index < players.length; ++index) {
      if (players[index].nickname !== this.nickname) {
        rivals.push[players[index]];
      }
    }
    return rivals;
  }

  getRivalsFunctional() {
    return Player.getAllPlayers().filter((player) => player.nickname !== this.nickname);
  }

  /* Arreglo de jugadores rivales para ejemplo de plantillas */
  static getAllPlayers() {
    const players = [
      new Player('Diego'),
      new Player('Juan'),
      new Player('Pedro'),
    ];
    return players;
  }

  setSocket(socket) {
    this.socket;
  }

  deleteSocket() {
    this.socket = null;
  }
}

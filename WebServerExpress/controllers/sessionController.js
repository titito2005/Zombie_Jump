import player from '../models/player.js';
import session from '../models/session.js';
import team from '../models/team.js';


class SessionController {
  constructor() {
    this.sessions = [];
    this.sessionId = 0;
    this.playersConnectedToGame = {};
  }

  addSession(session) {
    session.sessionId = this.sessionId++;
    this.sessions.push(session);
  }

  findSession(id) {
    for (let i = 0; i < this.sessions.length; i++) {
      if (this.sessions[i].sessionId === id) {
        return this.sessions[i];
      }
    }
    return null;
  }

  addTeam(team) {
  }

  addPlayer(player) {
  }
}

const sessionController = new SessionController();
export default sessionController;

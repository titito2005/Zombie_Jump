import Player from '../models/player.js';
import sessionController from './sessionController.js';

class GameController {
  constructor(){
    this.turnDuration = 30;
  }
  
  getGameBoard(req, res) {
    this.id = parseInt(req.query.id);
    this.session = sessionController.findSession(this.id);
    if (this.session) {
      res.render('GameScreen', {
        sessionID: this.session.sessionId,
        players: this.session.team[0].players,
        teams: this.session.team,
      });
    }
  }

  generateGameboard() {
    // todo: generar un gameboard aleatorio aqui y enviarselo a los jugadores
  }
}
// Singleton
const game = new GameController();
export default game;

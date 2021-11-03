import sessionController from './sessionController.js';

class LobbyController {
  getLobbyPage(req, res) {
    this.id = parseInt(req.query.id);
    this.session = sessionController.findSession(this.id);
    if (this.session) {
      res.render('Lobby', {
        sessionID: this.session.sessionId,
        players: this.session.team[0].players,
        teams: this.session.team,
      });
    }
  }
}

const lobby = new LobbyController();
export default lobby;

import player from '../models/player.js';
import session from '../models/session.js';
import Message from '../models/message.js';
import sessionController from './sessionController.js';
import gameController from './gameController.js';



class RequestController{
  constructor() {

    this.playerCount = 0;
    this.messageHandler = {
      CreateSession: (socket, message) => {
        this.handleCreateSession(socket, message);
      },
      JoinSession: (socket, message) => {
        this.handleJoinSession(socket, message);
      },
      PlayerAnnouncement: (socket, message) => {
        this.handlePlayerAnnouncement(socket, message);
      },
      StartSession: (socket, message) => {
        this.handleStartGame(socket, message);
      },
      PlayerLeftSession: (socket, message) => {
        this.handlePlayerLeftSession(socket, message);
      },
      PlayerJoinedGame: (socket, message) => {
        this.handlePlayerJoinedGame(socket, message);
      },
      PlayerMove: (socket, message) => {
        this.handlePlayerMove(socket, message);
      },
      CardSelected: (socket, message) =>{
        this.handleCardSelected(socket, message);
      },
      ChangeTeam: (socket, message) =>{
        this.handleChangeTeam(socket, message);
      },EndMatch:(socket, message) =>{
        this.handleEndMatch(socket, message);
      },
    };
  }

  handleEndMatch(socket, message){

    let msg = new Message('EndMatch');
    msg.nickname = message.nickname;
    const idSession = parseInt(message.idSession);
    const session = sessionController.findSession(idSession);

    console.log("Entre a enviar el mensja a server");

    const jsonMessage = JSON.stringify(msg);
    /* Enviamos mensaje */
    session.broadcastToAllPlayers(jsonMessage);

  }

  handleCardSelected(socket, message){    
        const idSession = parseInt(message.idSession);
        const session = sessionController.findSession(idSession);
        const msg = message;
        delete msg.idSession;
        const json = JSON.stringify(msg);
        session.broadcastToAllPlayers(json);
  }

  handleCreateSession(socket, message) {
    const nickname = message.playerName;
    const newPlayer = new player(nickname, 1, socket, true);

    const newSession = new session();
    newSession.addPlayer(newPlayer, 1);
    sessionController.addSession(newSession);

    /* Creamos mensaje y lo llenamos */
    const msg = new Message('CreatedSession');
    msg.playerName = newPlayer.nickname;
    msg.idSession = newSession.sessionId;

    const jsonMessage = JSON.stringify(msg);
    /* Enviamos mensaje */
    socket.send(jsonMessage);
    this.playerCount++;
  }

  handleJoinSession(socket, message) {
    const nickname = message.playerName;
    const idSession = parseInt(message.idSession);

    const session = sessionController.findSession(idSession);
    /* Verificamos que se encuentre la partida */
    if (session) {
      if(session.playersConnectedCount < 8)
      {
        const findPlayer = session.findPlayer(nickname);
        if (findPlayer) {
          /* Jugador encontrado, enviamos error */
          const msg = new Message('NickNameFound');
          const json = JSON.stringify(msg);
          /* Enviamos mensaje */
          socket.send(json);
        } else {
          /* Jugador no encontrado, procedemos con el registro */
          const newPlayer = new player(nickname, 1, socket, false);
          /* Se agrega el nuevo jugador */
          session.addPlayer(newPlayer, 1);
          /* Creamos mensajes de unión a partida */
          const msg = new Message('JoinedSession');
          msg.playerName = nickname;
          msg.idSession = idSession;
  
          const json = JSON.stringify(msg);
  
          /* Enviamos mensaje */
          socket.send(json);
        }
      }
      else/*SESION LLENA*/
      {
        let msg2 = new Message('FullSession');
        let json2 = JSON.stringify(msg2);
        /* Enviamos mensaje */
        socket.send(json2);
      }
    } else {
      /* No encuentra la sesión, enviamos error */
      const msg = new Message('SessionNotFound');
      const json = JSON.stringify(msg);
      /* Enviamos mensaje */
      socket.send(json);
    }
  }

  handlePlayerAnnouncement(socket, message)
  {
        let playerName = message.playerName;
        let idSession = parseInt(message.idSession);
        let session = sessionController.findSession(idSession);
        if (session)
        {
            let player = session.findPlayer(playerName);
            if (player)
            {
                player.socket = socket;
                /*Prueba*/
                /*
                let msgprueba = new Message("prueba");
                let jsonPrueba = JSON.stringify(msgprueba);
                player.socket.send(jsonPrueba);
                */
                
                let msg = new Message("NewPlayer");
                msg.playerName = player.nickname;
                let json = JSON.stringify(msg);
                session.broadcastToAllPlayers(json);
            }
        }      
    }

    handlePlayerLeftSession(socket, message)
    {
        let nickname = message.playerName;
        let idSession = parseInt(message.idSession);
        let session = sessionController.findSession(idSession);
        if (session) {
            session.deletePlayer(nickname);
            let msg = new Message("LeftPlayer");
            msg.playerName = nickname;
            let json = JSON.stringify(msg);
            session.broadcastToAllPlayers(json);
        }
    }

  handleStartGame(socket, message) {
    const nickname = message.playerName;
    const idSession = parseInt(message.idSession);
    const session = sessionController.findSession(idSession);
    if (session) {
      const player = session.findPlayer(nickname);
      if (player) {
        if (player.host) {
          const msg = new Message('StartGame');
          msg.idSession = message.idSession;
          const json = JSON.stringify(msg);
          session.broadcastToAllPlayers(json);
        } else {
          const msg = new Message('WaitHost');
          const json = JSON.stringify(msg);
          socket.send(json);
        }
      }
    }
  }

  handlePlayerLeftSession(socket, message) {
    const nickname = message.playerName;
    const idSession = parseInt(message.idSession);
    const session = sessionController.findSession(idSession);
        if (session) {
        session.deletePlayer(nickname);
        const msg = new Message('LeftPlayer');
        msg.playerName = nickname;
        const json = JSON.stringify(msg);
        session.broadcastToAllPlayers(json);
        }
    }

  handlePlayerJoinedGame(socket, message) {
    const { playerName } = message;
    const idSession = parseInt(message.idSession);
    const session = sessionController.findSession(idSession);
    const player = session.findPlayer(playerName);
    if (player) {
      player.socket = socket;
      session.increasePlayersConnectedCount();
      if (session.playersConnectedCount === session.expectedConnectionsCount()) {
        session.timer.startTimer(session.turnDuration);
        session.generateTurnOrder();
        const msg = new Message('FirstTurn');
        msg.whosTurn = session.getWhosTurn();
        msg.teamTurnId = session.findPlayer(msg.whosTurn).id;
        msg.turnDuration = session.turnDuration;
        const json = JSON.stringify(msg);
        session.broadcastToAllPlayers(json);
      }
    }
  }

  handlePlayerMove(socket, message) {
    const idSession = parseInt(message.idSession);
    const session = sessionController.findSession(idSession);
    session.timer.timeRemaining = session.turnDuration;
    const msg = message;
    msg.whosTurn = session.getWhosTurn();
    msg.teamTurnId = session.findPlayer(msg.whosTurn).id;
    const json = JSON.stringify(msg);
    session.broadcastToAllPlayers(json);
  }

  handleChangeTeam(socket, message) {
    let idSession = parseInt(message.idSession);
    let nickname = message.playerName;
    let team = message.team;

    let session = sessionController.findSession(idSession);
    if (session)
    {
        let player = session.findPlayer(nickname);
        if (player)
        {
            if(team == 'blue')
            {
              player.id = 1;
            } else
            { 
              if(team == 'red')
              {
                player.id = 2;
              }
            }
            
            /*Creamos mensaje para broadcast*/
            let msg = new Message('HostChangedTeam');
            msg.playerName = nickname;
            msg.idSession = idSession;
            msg.team = team;
            let json = JSON.stringify(msg);
            session.broadcastToAllPlayers(json);
        }
    }
  }
}

const requestController = new RequestController();
export default requestController;

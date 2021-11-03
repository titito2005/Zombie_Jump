// import PlayerModel from '../../models/player.js';
import * as common from './Common.js';
import * as deck from './Deck.js';
import * as player from './Player.js';
import * as scoreboard from './Scoreboard.js';
import Carta from './Card.js';
const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("closeModal")[0];
/*
Cambios en el deck
*/
let numberplayers=0;
class Message {
  constructor(inputType) {
    this.typeMessage = inputType;
  }
}

span.onclick = function() {
  modal.style.display = "none";
  window.location.assign(`http://${window.location.host}/HomePage`);
}
const urlWs = `ws://${window.location.host}`;
const socket = new WebSocket(urlWs);
export default class Game {
  constructor() {
    this.currentState = 'waitingForTurn';
    this.selected_player = null;
    this.player_list = [];
    this.buildGameboard();
    this.active_cells = [];
    this.zombie = null;
    this.userPickedCard = false;
    this.nickname = window.localStorage.getItem('nickname');
    this.sessionId = window.localStorage.getItem('sessionId');
    this.teamId = parseInt(window.localStorage.getItem('teamId'));
    this.currentCard = null;
    this.tipoCarta = null;
    this.deck = null;
    this.scoreboard = new scoreboard.Scoreboard();
    this.multiplierElement = document.getElementById('current-multiplier');
    this.multiplierElement.innerHTML = '2.0x';

    this.playerCreationAllowance = 4;
    this.lastPlayerId = 0;
    this.turnDuration = 0;
    this.timeRemaining = 0;
    this.teamTurnId;
    

    /* CAMBIAR NOMBRES */
    const playerNameElement = document.getElementById('player-name');
    if (playerNameElement) {
      playerNameElement.innerHTML = this.nickname;
    }

      /* TIMER */
  const l = document.getElementById('time');
  window.setInterval(() => {
    l.innerHTML = `${Math.floor(this.timeRemaining)} segs`;
    if(this.timeRemaining>0.1){
      this.timeRemaining -= 0.1;
    }
  }, 100);

  }

  setupEvents() {
    console.log(`nickame: ${this.nickname}`);

    socket.addEventListener('open', () => {
      /* Anuncia su llegada al servidor */
      const msg = new Message('PlayerJoinedGame');
      msg.playerName = this.nickname;
      msg.idSession = this.sessionId;
      const json = JSON.stringify(msg);
      socket.send(json);
    });

    socket.addEventListener('message', () => {
      const messageObject = JSON.parse(event.data);
      if (messageObject) {
        this.responseHandler(messageObject);
      }
    });

    // Click event de Deck
    // Requisito: Estado actual es 'WaitingForCard'
    // Casos:
    // - jugador clickea el deck para sacar una carta => pasa al estado 'playerPickedCard'

    this.deck = new deck.Deck();

    
    const espacioCarta = document.querySelector('.cardZone');
    this.colorActual = '';
    this.deck.mezclarDeck();
    const buttonDeckCard = document.getElementById('deck-cartas');
    // buttonDeckCard.classList.add('deck-button-active');
    buttonDeckCard.addEventListener('click', () => {
      console.log("Entre a click");
      if (this.currentState === 'waitingForCard') {
        const elem = document.getElementById('cartaJugador');
        if (elem) {
          elem.parentNode.removeChild(elem);
        }
        espacioCarta.appendChild(this.deck.cartas[0].getHTML());
        this.currentCard = this.deck.cartas[0];
        this.colorActual = this.deck.cartas[0].color;
        this.tipoCarta = this.deck.cartas[0].jugador;
        this.userPickedCard = true;
        const msg = new Message('CardSelected');

        msg.currentCard = this.deck.cartas[0];
        msg.colorActual = this.deck.cartas[0].color;
        msg.tipoCarta = this.deck.cartas[0].jugador;
        msg.idSession = this.sessionId;
        msg.nickname= this.nickname;
        
        const json = JSON.stringify(msg);

    socket.send(json);
    


        buttonDeckCard.classList.remove('deck-button-active');

        if(this.deck.cartas[0] === null){
          this.deck = new deck.Deck();
          this.deck.mezclarDeck();
        }
        this.activateStartCell();

        // todo: cambiarlo para que seleccione solo los del equipo correspondiente
        if (this.tipoCarta === 'PLAYER') {
          this.player_list.forEach((player) => {
            player.select();
          });
        } else { // tipoCarta==='ZOMBIE'
          if (this.zombie !== null) {
            this.zombie.select();
          }
        }

        document.addEventListener('click', () => {
          console.log(this.playerCreationAllowance, this.teamId, this.teamTurnId);
        });

        this.setCurrentState('playerPickedCard');
      }
    });

    // Click event de Players

    // for (let i = 0; i < 3; i += 1) {
    //   const player = new player.Player(`player${i}`, 2, 11, false);
    //   player.element.addEventListener('click', () => {
    //     this.selectPlayer(player, colorActual, tipoCarta);
    //   });

    //   this.player_list.push(player);
    // }

    // Click event del zombie
    // this.zombie = new player.Player('zombie', 3, 11, true);
    // this.zombie.element.addEventListener('click', () => {
    //   this.selectZombie(this.zombie, colorActual, tipoCarta);
    // });

    // Click event para cada casilla
    // Requisito: Estado actual es 'playerSelectedCharacter' o 'playerSelectedStartingCell'
    // Casos:
    // - clickea celda activa despues de haber seleccioando un jugador => jugador seleccionado se mueve a la celda clickeada. Pasa al estado 'waitingForTurn'
    // - clickea celda activa despues de haber seleccionado la celda inicial => se crea un nuevo jugador en la celda inicial y se mueve a la celda clickeada. Pasa al estado 'waitingForTurn'
    // - clickea celda no activa => se deselecciona todas las celdas. Pasa al estado 'playerPickedCard'

    this.gameboard_cell_list = document.getElementsByClassName('gameboard-cell');
    for (let index = 0; index < this.gameboard_cell_list.length; index += 1) {
      const cell = this.gameboard_cell_list[index];
      cell.addEventListener('click', () => {
        const column = cell.cellIndex;
        const row = cell.parentElement.rowIndex;

        if (this.currentState === 'playerSelectedCharacter') {
          // mueve la ficha a la celda activada clickeada
          if (cell.classList.contains('cell-active')) {
            this.selected_player.saveLastPosition();
            this.selected_player.move(row - this.selected_player.row,
              column - this.selected_player.col);

            // todo: sumar score al equipo correspondiente
            if (this.selected_player.id !== 'zombie' && common.gameBoard[row][column] !== 'safe-cell') {
                this.scoreboard.addScore(this.nickname,parseInt(cell.innerHTML));
            }

            // Encuentra la ultima celda del camino que uso para moverse, para evitar que se pueda mover para atras
            if (!this.selected_player.allow_back_move) {
              this.selected_player.findNoReturn(this.selected_player.row,
                this.selected_player.col, this.selected_player.anteriorRow,
                this.selected_player.anteriorCol, 0, 0);
            }
            this.verifyKill();
            this.verifySafe(this.nickname);
            this.selected_player.deselect();
            // this.selected_player = null;
            this.clearActiveCells();
            this.endTurn();
          }
        }

        if (this.currentState === 'playerSelectedStartingCell') {
          if (cell.classList.contains('cell-active')) {
            // Crea un nuevo jugador y lo mueve a la celda activada clickeada

            let newPlayer = null;
            if (this.tipoCarta === 'PLAYER') {
              newPlayer = this.createPlayer();
            } else { // crea el zombie
              newPlayer = this.createZombie();
            }
            this.selected_player = newPlayer;
            newPlayer.move(row - newPlayer.row, column - newPlayer.col);

            // todo: sumar score al equipo correspondiente
            if (newPlayer.id !== 'zombie' && common.gameBoard[row][column] !== 'safe-cell') {
              this.scoreboard.addScore(this.nickname, parseInt(cell.innerHTML));
            }

            // Encuentra la ultima celda del camino que uso para moverse, para evitar que se pueda mover para atras
            if (!newPlayer.allow_back_move) {
              newPlayer.findNoReturn(newPlayer.row,
                newPlayer.col, newPlayer.anteriorRow,
                newPlayer.anteriorCol, 0, 0);
            }
            this.verifyKill();
            this.verifySafe(this.nickname);
            // this.selected_player = null;
            this.clearActiveCells();
            this.endTurn();
          }
        }
        if (this.currentState === 'playerSelectedStartingCell' || this.currentState === 'playerSelectedCharacter') {
        // deselecciona todas las celdas y vuelve a seleccionar la celda inicial
          this.clearActiveCells();
          this.activateStartCell();
          this.setCurrentState('playerPickedCard');
        }
      });
    }

     //click event de la celda inicial (bandera)
     this.startCell.addEventListener('click', () =>{
      if(this.startCell.classList.contains('cell-active')){
        this.verifyNextPositionInit(common.playerStartRow,common.playerStartCol,common.playerStartRow, common.playerStartCol, this.colorActual, false);
        this.setCurrentState('playerSelectedStartingCell');
        this.startCell.classList.remove('cell-active');
        // actua como selected player
      }
    });
  }

  createPlayer() {
    const newPlayerElement = this.createPlayerElement(`player${this.lastPlayerId++}`, 'player');
    this.gameboardElement.appendChild(newPlayerElement);
    const newPlayer = new player.Player(newPlayerElement.id, common.playerStartRow, common.playerStartCol, false);

    this.player_list.push(newPlayer);
    numberplayers++;
    newPlayer.element.addEventListener('click', () => {
      this.selectPlayer(newPlayer, this.colorActual, this.tipoCarta);
    });
    //Baja el allowance si alguien del equipo creo la ficha
    if(this.teamTurnId === this.teamId){
      this.playerCreationAllowance--;
    }
    newPlayer.saveLastPosition();
    return newPlayer;
  }

  createZombie() {
    const newPlayerElement = this.createZombieElement();
    this.gameboardElement.appendChild(newPlayerElement);
    const newPlayer = new player.Player(newPlayerElement.id, common.playerStartRow, common.playerStartCol, true);
    this.zombie = newPlayer;
    newPlayer.element.addEventListener('click', () => {
      this.selectZombie(newPlayer, this.colorActual, this.tipoCarta);
    });
    newPlayer.saveLastPosition();
    return newPlayer;
  }

  activateStartCell() {
    // activa la celda de inicio
    if (this.tipoCarta === 'PLAYER') {
      if (this.playerCreationAllowance > 0) {
        this.startCell.classList.add('cell-active');
      }
    }
    if (this.tipoCarta === 'ZOMBIE') {
      if (this.zombie === null) {
        this.startCell.classList.add('cell-active');
      }
    }
  }

  clearActiveCells() {
    this.active_cells.forEach((cell) => { cell.classList.remove('cell-active'); });
    this.active_cells = [];
  }

  endTurn() {
    
    console.log("Player creation:",this.playerCreationAllowance);
    console.log("Player list:",this.player_list.length);
    this.deck.cartas.shift();
    if (numberplayers === 0 && this.playerCreationAllowance === 0) {
      this.endMatch();
    }
    this.scoreboard.updateScoreElements();
    this.timeRemaining = this.turnDuration;

    // Envia un mensaje al servidor con el movimiento que se hizo
    const msg = new Message('PlayerMove');
    msg.idSession = this.sessionId;
    msg.nickname = this.nickname;
    msg.createdCharacter = this.currentState === 'playerSelectedStartingCell';
    msg.createdZombie = msg.createdCharacter && this.selected_player.id === 'zombie';
    msg.prevRow = this.selected_player.anteriorRow;
    msg.prevCol = this.selected_player.anteriorCol;
    msg.newRow = this.selected_player.row;
    msg.newCol = this.selected_player.col;
    // todo: agregar contenido del mensaje de PlayerMove
    const json = JSON.stringify(msg);
    socket.send(json);
    this.setCurrentState('waitingForTurn');
    this.player_list.forEach((player) => {
      player.deselect();
    });
  }

  handleServerMessage() {
    // si recibe un mensaje que especifica el nuevo whosTurn,
    // y ese whosTurn equivale con el turn del dueño de este cliente,
    // entonces se cambia al estado a 'WaitingForCard'

    // this.currentState = 'WaitingForCard';
  }

  endMatch() {
    // manda mensaje?
   
    modal.style.display = "block";
    this.setCurrentState('matchEnded');
    const msg = new Message('EndMatch');
    msg.idSession = this.sessionId;
    msg.nickname = this.nickname;
    const json = JSON.stringify(msg);
    socket.send(json);
    
  }

  verifyKill() {
    if (this.zombie) {
      for (let i = 0; i < this.player_list.length; i += 1) {
        const player = this.player_list[i];
        if (this.zombie.row === player.row && this.zombie.col === player.col) {
          console.log('zombie kills player');
          player.element.remove();
          // this.activePlayersCount -= 1;
          numberplayers--;
          this.player_list.splice(i, 1);
          // console.log(this.player_list);
        }
      }
    }
  }

  verifySafe(playerName) {
    if (common.gameBoard[this.selected_player.row][this.selected_player.col] === 'safe-cell') {
      setTimeout(() => { 
        this.selected_player.element.remove();
        for (let i = 0; i < this.player_list.length; i += 1) {
          if(this.player_list[i] === this.selected_player){
            this.player_list.splice(i,1);
          }
        }
       }, 1000);
       if(this.selected_player.id=== 'zombie'){
        this.endMatch();
      }else {
      console.log('player reached safe house');
      numberplayers--;
      const multiplier = parseFloat(this.multiplierElement.innerHTML);
      this.scoreboard.multScore(playerName, multiplier);
      const newMultiplierRaw = multiplier * 0.9;
      const newMultiplier = newMultiplierRaw.toFixed(2);
      if (newMultiplier > 0) {
        this.multiplierElement.innerHTML = `${newMultiplier}x`;
      } else {
        this.multiplierElement.innerHTML = `${0}x`;
      }
    }
      
    }
  }

  buildGameboard() {
    const rows = 6;
    const cols = 12;
    this.gameboardElement = document.getElementsByClassName('gameboard')[0];

    // to do: que lea la matriz de un .json para no tenerlo quemado en el codigo
    common.gameBoard.push([3, 0, 0, 1, 1, 1, 1, 1, 1, 3, 0, 0]);
    common.gameBoard.push([1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0]);
    common.gameBoard.push([0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 2]);
    common.gameBoard.push([0, 0, 1, 0, 0, 0, 0, 0, 3, 0, 0, 1]);
    common.gameBoard.push([0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1]);
    common.gameBoard.push([0, 3, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0]);

    let colorCounter = 0;
    let scoreCounter = 0;
    for (let row = 0; row < rows; row += 1) {
      const tableRowElement = document.createElement('tr');
      for (let col = 0; col < cols; col += 1) {
        const tableDataElement = document.createElement('td');
        tableRowElement.appendChild(tableDataElement);
        const boardCellClassAttribute = document.createAttribute('class');

        const cell = common.gameBoard[row][col];
        switch (cell) {
          case 0:
            boardCellClassAttribute.value = 'gameboard-cell';
            common.gameBoard[row][col] = 'empty';
            break;
          case 1:
            const randomColor = colorCounter++ % 4;
            const randomPoints = (scoreCounter++ % 5)+1;
            boardCellClassAttribute.value = `gameboard-cell ${common.CELL_COLOR[randomColor]}`;
            tableDataElement.innerHTML = `${randomPoints}`;

            common.gameBoard[row][col] = common.CELL_COLOR[randomColor];

            break;
          case 2:
            boardCellClassAttribute.value = 'gameboard-cell start-cell';
            tableDataElement.innerHTML = '🚩';
            common.gameBoard[row][col] = 'start-cell';
            this.startCell = tableDataElement;
            break;
          case 3:
            boardCellClassAttribute.value = 'gameboard-cell safe-cell';
            tableDataElement.innerHTML = '🏠';
            common.gameBoard[row][col] = 'safe-cell';
            break;
          default:
            break;
        }
        tableDataElement.setAttributeNode(boardCellClassAttribute);
      }
      this.gameboardElement.appendChild(tableRowElement);
    }
  }

  /* Creates the zombie */
  createZombieElement() {
    const zombie = document.createElement('img');
    const zombieAtributeID = document.createAttribute('id');
    zombieAtributeID.value = 'zombie';
    const zombieAtributeRow = document.createAttribute('data-row');
    zombieAtributeRow.value = common.playerStartRow;
    const zombieAtributeCol = document.createAttribute('data-col');
    zombieAtributeCol.value = common.playerStartCol;
    const zombieAtributeClass = document.createAttribute('class');
    zombieAtributeClass.value = 'player';
    const srcZombie = document.createAttribute('src');
    srcZombie.value = '../Images/Images-horror/svg/006-clown-1.svg';
    const zombieAtributeAlt = document.createAttribute('alt');
    zombieAtributeAlt.value = 'zombie';
    const zombieAtributeStyle = document.createAttribute('style');
    zombieAtributeStyle.value = 'top: 80%; left: 50%;';

    zombie.setAttributeNode(zombieAtributeID);
    zombie.setAttributeNode(zombieAtributeRow);
    zombie.setAttributeNode(zombieAtributeCol);
    zombie.setAttributeNode(zombieAtributeClass);
    zombie.setAttributeNode(srcZombie);
    zombie.setAttributeNode(zombieAtributeAlt);
    zombie.setAttributeNode(zombieAtributeStyle);

    return zombie;
  }

  /* Creates new token */
  createPlayerElement(playerID, Type) {
    const element = document.createElement('img');
    element.id = playerID;

    const playerAtributeID = document.createAttribute('id');
    playerAtributeID.value = playerID;
    const playerAtributeRow = document.createAttribute('data-row');
    playerAtributeRow.value = common.playerStartRow;
    const playerAtributeCol = document.createAttribute('data-col');
    playerAtributeCol.value = common.playerStartCol;
    const playerAtributeClass = document.createAttribute('class');
    
    const src = document.createAttribute('src');
    if(this.teamTurnId === 1){
      playerAtributeClass.value = `${Type} team1`;
      src.value = '../Images/Images-pokemon/svg/001-aaron.svg';
    }
    else{
      playerAtributeClass.value = `${Type} team2`;
      src.value = '../Images/Images-pokemon/svg/002-avatar.svg';
    }
    const playerAtributeAlt = document.createAttribute('alt');
    playerAtributeAlt.value = playerID;
    const playerAtributeStyle = document.createAttribute('style');
    playerAtributeStyle.value = 'top: 80%; left: 50%;';

    element.setAttributeNode(playerAtributeID);
    element.setAttributeNode(playerAtributeRow);
    element.setAttributeNode(playerAtributeCol);
    element.setAttributeNode(playerAtributeClass);
    element.setAttributeNode(src);
    element.setAttributeNode(playerAtributeAlt);
    element.setAttributeNode(playerAtributeStyle);

    return element;
  }

  getcelda(row, col) {
    const gameboardRows = this.gameboardElement.getElementsByTagName('tr');
    const cell = gameboardRows[row].getElementsByTagName('td')[col];
    return cell;
  }

  verifyNextPositionInit(row, col, noRow, noCol, color, verifyPlayer) {

    let colorBuscar = '';

    if (color === 'RED') {
      colorBuscar = 'red-cell';
    }
    if (color === 'BLUE') {
      colorBuscar = 'blue-cell';
    }
    if (color === 'GREEN') {
      colorBuscar = 'green-cell';
    }
    if (color === 'YELLOW') {
      colorBuscar = 'yellow-cell';
    }
    console.log(`buscando:${colorBuscar}`);

    this.verifyNextPosition(row + 1, col, row, col, noRow, noCol, colorBuscar, verifyPlayer);
    this.verifyNextPosition(row - 1, col, row, col, noRow, noCol, colorBuscar, verifyPlayer);
    this.verifyNextPosition(row, col + 1, row, col, noRow, noCol, colorBuscar, verifyPlayer);
    this.verifyNextPosition(row, col - 1, row, col, noRow, noCol, colorBuscar, verifyPlayer);
  }

    verifyNextPosition(actualRow, actualCol, anteriorRow, anteriorCol, noRow, noCol, color, verifyPlayer) {
    /* Verificar casilla actual */
    if (!(actualRow === noRow && actualCol === noCol)) {
      if (actualRow >= 0 && actualRow < common.gameBoardRows
          && actualCol >= 0 && actualCol < common.gameBoardCols) {
        if (common.gameBoard[actualRow][actualCol] !== 'empty') {
          if (common.gameBoard[actualRow][actualCol] === color || common.gameBoard[actualRow][actualCol] === 'safe-cell') {
          /* Encender celda */

              /*ES UN JUGADOR*/
              if (verifyPlayer === false) {

                  let findPlayers = false;
                  for (let i = 0; i < this.player_list.length && findPlayers === false; i++) {
                      if (this.player_list[i].row === actualRow && this.player_list[i].col === actualCol) {
                          findPlayers = true;
                      }
                  }

                  if (this.zombie && findPlayers === false) {
                      if (this.zombie.row === actualRow && this.zombie.col === actualCol) {
                          findPlayers = true
                      }
                  }
                  if (findPlayers === false) {
                      const cell = this.getcelda(actualRow, actualCol);
                      this.active_cells.push(cell);
                      cell.classList.add('cell-active');
                  } else {
                      /* Si no se ha encontrado casilla */
                      /* Verificamos Casilla de arriba */
                      if (!(actualRow - 1 === anteriorRow && actualCol === anteriorCol)) {
                          this.verifyNextPosition(actualRow - 1, actualCol,
                              actualRow, actualCol, noRow, noCol, color, verifyPlayer);
                      }

                      /* Verificamos casilla de abajo */
                      if (!(actualRow + 1 === anteriorRow && actualCol === anteriorCol)) {
                          this.verifyNextPosition(actualRow + 1, actualCol,
                              actualRow, actualCol, noRow, noCol, color, verifyPlayer);
                      }

                      /* Verificamos casilla de derecha */
                      if (!(actualRow === anteriorRow && actualCol + 1 === anteriorCol)) {
                          this.verifyNextPosition(actualRow, actualCol + 1,
                              actualRow, actualCol, noRow, noCol, color, verifyPlayer);
                      }

                      /* Verificamos casilla de la izquierda */
                      if (!(actualRow === anteriorRow && actualCol - 1 === anteriorCol)) {
                          this.verifyNextPosition(actualRow, actualCol - 1,
                              actualRow, actualCol, noRow, noCol, color, verifyPlayer);
                      }
                  }
              }
              else
              {
                   /*ES UN ZOMBIE*/
                  const cell = this.getcelda(actualRow, actualCol);
                  this.active_cells.push(cell);
                  cell.classList.add('cell-active');
              }
          } else {
            /* Si no se ha encontrado casilla */
            /* Verificamos Casilla de arriba */
            if (!(actualRow - 1 === anteriorRow && actualCol === anteriorCol)) {
              this.verifyNextPosition(actualRow - 1, actualCol,
                  actualRow, actualCol, noRow, noCol, color, verifyPlayer);
            }

            /* Verificamos casilla de abajo */
            if (!(actualRow + 1 === anteriorRow && actualCol === anteriorCol)) {
              this.verifyNextPosition(actualRow + 1, actualCol,
                  actualRow, actualCol, noRow, noCol, color, verifyPlayer);
            }

            /* Verificamos casilla de derecha */
            if (!(actualRow === anteriorRow && actualCol + 1 === anteriorCol)) {
              this.verifyNextPosition(actualRow, actualCol + 1,
                  actualRow, actualCol, noRow, noCol, color, verifyPlayer);
            }

            /* Verificamos casilla de la izquierda */
            if (!(actualRow === anteriorRow && actualCol - 1 === anteriorCol)) {
              this.verifyNextPosition(actualRow, actualCol - 1,
                  actualRow, actualCol, noRow, noCol, color, verifyPlayer);
            }
          }
        }
      }
    }
  }

  // when an user selects a player to move
  selectPlayer(player, color, tipo) {
    if (this.currentState === 'playerPickedCard') {
      if (tipo === 'PLAYER') {
        this.player_list.forEach((selectedPlayer) => selectedPlayer.deselect());
        this.startCell.classList.remove('cell-active');
        this.selected_player = player;
        player.select();

        this.verifyNextPositionInit(player.row, player.col, player.noX, player.noY, color, player.allow_back_move);
        this.setCurrentState('playerSelectedCharacter');
      }
    }
  }

  selectZombie(zombie, color, tipo) {
    if (this.currentState === 'playerPickedCard') {
      if (tipo === 'ZOMBIE') {
        this.player_list.forEach((selectedPlayer) => selectedPlayer.deselect());
        this.startCell.classList.remove('cell-active');
        this.selected_player = zombie;
        zombie.select();

        this.verifyNextPositionInit(zombie.row, zombie.col, zombie.noX, zombie.noY, color, zombie.allow_back_move);
        this.currentState = 'playerSelectedCharacter';
      }
    }
  }

  selectCharacterByCoord(row, col) {
    for (let playerIndex = 0; playerIndex < this.player_list.length; playerIndex++) {
      const currentPlayer = this.player_list[playerIndex];
      if (currentPlayer.row === row && currentPlayer.col === col) {
        return currentPlayer;
      }
    }
    if (this.zombie) {
      if (this.zombie.row === row && this.zombie.col === col) {
        return this.zombie;
      }
    }
    throw 'Couldn\'t find a character in the specified coordinates sent remotely';
  }

  setCurrentState(newState) {
    console.log(`State change from ${this.currentState} to ${newState}`);
    this.currentState = newState;
  }

  setWhosTurn(newWhosTurn) {
    this.whosTurn = newWhosTurn;
    this.updateWhosTurnElement(newWhosTurn);
    if (this.nickname === this.whosTurn) {
      this.setCurrentState('waitingForCard');
      const buttonDeckCard = document.getElementById('deck-cartas');
      buttonDeckCard.classList.add('deck-button-active');
      const elem = document.getElementById('cartaJugador');
      // elem.classList.add('usedCard');
    }
  }

  deselectAll(){
    this.player_list.forEach((player)=>{
      player.deselect();
    });
    if(this.zombie!== null){
      this.zombie.deselect();
    }
      this.clearActiveCells();
      const buttonDeckCard = document.getElementById('deck-cartas');
      buttonDeckCard.classList.remove('deck-button-active');
      this.startCell.classList.remove('cell-active');
  }

  responseHandler(messageObject) {
    console.log(messageObject);
    switch (messageObject.typeMessage) {
      case 'FirstTurn':
        const newWhosTurn = messageObject.whosTurn;
        this.turnDuration = messageObject.turnDuration;
        this.timeRemaining = this.turnDuration;
        this.handleNewTurn(newWhosTurn);
        this.teamTurnId = messageObject.teamTurnId;

        break;
      case 'PlayerMove':
        this.timeRemaining = this.turnDuration;
        this.handlePlayerMove(messageObject);
        break;
      case 'SkipTurn':
        if(this.nickname === this.whosTurn){
          this.setCurrentState('waitingForTurn');
          this.deselectAll();
        }
        this.timeRemaining = this.turnDuration;
        this.teamTurnId = messageObject.teamTurnId;
        this.handleNewTurn(messageObject.whosTurn);
        break
      case 'CardSelected':
        this.handleCardSelected(messageObject);
        break;
      case 'EndMatch':
        this.handleEndMatch(messageObject);
      break;
      default:
        alert('Error.');
        break;
    }
  }

  updateWhosTurnElement(newWhosTurn) {
    const whosTurnElement = document.getElementById('whos-turn');
    whosTurnElement.innerHTML = `It's ${newWhosTurn}'s turn`;
  }

  handleNewTurn(newWhosTurn) {
    this.setWhosTurn(newWhosTurn);
  }

  handlePlayerMove(messageObject) {
    if (messageObject.nickname !== this.nickname) {
      // procesa la informacion del mensaje y realiza los cambios correspondientes
      if (messageObject.createdCharacter) {
        if (messageObject.createdZombie) {
          this.selected_player = this.createZombie();
        } else {
          this.selected_player = this.createPlayer();
        }
        this.selected_player.move(parseInt(messageObject.newRow) - this.selected_player.row,
          parseInt(messageObject.newCol) - this.selected_player.col);
          let cell = this.getcelda(this.selected_player.row, this.selected_player.col);
          if (this.selected_player.id !== 'zombie' && common.gameBoard[this.selected_player.row][this.selected_player.col] !== 'safe-cell') {
            this.scoreboard.addScore(messageObject.nickname,parseInt(cell.innerHTML));
          }
        this.verifyKill();
        this.verifySafe(messageObject.nickname);
        
      } else {
        try {
          this.selected_player = this.selectCharacterByCoord(messageObject.prevRow, messageObject.prevCol);
          this.selected_player.move(parseInt(messageObject.newRow) - this.selected_player.row,
            parseInt(messageObject.newCol) - this.selected_player.col);
          let cell = this.getcelda(this.selected_player.row, this.selected_player.col);
          if (this.selected_player.id !== 'zombie' && common.gameBoard[this.selected_player.row][this.selected_player.col] !== 'safe-cell') {
            this.scoreboard.addScore(messageObject.nickname,parseInt(cell.innerHTML));
          }
          this.verifyKill();
          this.verifySafe(messageObject.nickname);
        } catch (e) {
          console.error(e);
        }
      }
    }
    this.scoreboard.updateScoreElements();
    this.teamTurnId = messageObject.teamTurnId;
    this.setWhosTurn(messageObject.whosTurn);
  }

  handleEndMatch(messageObject){
    if(messageObject.nickname !== this.nickname){
      modal.style.display = "block";
      this.setCurrentState('matchEnded');
    }

  }


  handleCardSelected(messageObject){
    if(messageObject.nickname !== this.nickname){
      const elem = document.getElementById('cartaJugador');
      if (elem) {
        elem.parentNode.removeChild(elem);
      }
   
    const espacioCarta = document.querySelector('.cardZone');
    let cardPlayer = new Carta(messageObject.colorActual,messageObject.tipoCarta);
    console.log(cardPlayer);
    espacioCarta.appendChild(cardPlayer.getHTML());
    }
  }
}


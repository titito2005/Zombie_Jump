class Message {
  constructor(inputType, playerName, idSession) {
    this.typeMessage = inputType;
    this.playerName = playerName;
    this.idSession = idSession;
  }
}

const urlWs = `ws://${window.location.host}`;
let socket;

function setupEvents() {
    socket = new WebSocket(urlWs);
    /*Realizo primero el player announcement*/
    let playerName = window.localStorage.getItem('nickname');
    let sessionId = window.localStorage.getItem('sessionId');
    let host = window.localStorage.getItem('host');

    socket.onopen = function(event) {
        /*Preparo mensaje*/
        let msg = new Message("PlayerAnnouncement", playerName, sessionId);
        let json = JSON.stringify(msg);

        /*Envio el mensaje*/
        socket.send(json);

        const startButton = document.getElementById("start-game");
        const endButton = document.getElementById("end-session");
        
        startButton.addEventListener("click", startSession);
        endButton.addEventListener("click", endSession);
    
    
        socket.addEventListener('message', (event) => {
            let jsonMessage = JSON.parse(event.data);
            if (jsonMessage) {
              console.log("hola");
                responseHandler(jsonMessage, playerName, host);
            }
        })
        
        if(host==='true')
        {
          let jugadorElement = document.getElementById(playerName);
          if(jugadorElement)
          {
            jugadorElement.addEventListener('click', (event) =>
            {
              changeTeam(jugadorElement, playerName)
            })
          }
        }
    };
}

function startSession() {
  const playerName = window.localStorage.getItem('nickname');
  const sessionId = window.localStorage.getItem('sessionId');

  /* Preparamos mensaje */
  const msg = new Message('StartSession', playerName, sessionId);
  const json = JSON.stringify(msg);

    /*Envío el mensaje*/
    socket.send(json);
}

function endSession() {
  const playerName = window.localStorage.getItem('nickname');
  const sessionId = window.localStorage.getItem('sessionId');

  /* Preparamos mensaje */
  const msg = new Message('PlayerLeftSession', playerName, sessionId);
  const json = JSON.stringify(msg);

    /*Envío el mensaje*/
    socket.send(json);
    window.location.assign(`http://${window.location.host}/HomePage`);
}

function responseHandler(jsonMessage, playerName, host) {
    /*Manejo de mensajes*/
    /*Manejo de mensajes*/
    switch (jsonMessage.typeMessage) {
        case "NewPlayer":
            if (jsonMessage.playerName !== playerName)
            {
                addNewPlayer(jsonMessage.playerName, host);
            }
            break;

        case "LeftPlayer":
            deletePlayer(jsonMessage.playerName);
            break;

        case "StartGame":
            window.localStorage.setItem('teamId', getTeamId());
            window.location.assign(`http://${window.location.host}/GameScreen?id=${jsonMessage.idSession}`);
            break;

        case "WaitHost":
            alert("Por favor espere al host.");
            break;

        case "HostChangedTeam":
            if(host==='false')
            {
              changePlayerTeam(jsonMessage);              
            }
            break;

        default:
            alert("Error.");
            break;
    }
}

function addNewPlayer(playerNickname, host) {
  const playerTable = document.getElementsByClassName('players-table')[0];

  const playerBlock = document.createElement('div');
  const playerBlockId = document.createAttribute('id');
  playerBlockId.value = playerNickname;
  const playerBlockClass = document.createAttribute('class');
  playerBlockClass.value = 'player-block-blue';

  const playerImg = document.createElement('img');
  const playerImgClass = document.createAttribute('class');
  playerImgClass.value = 'players-image';
  const playerImgSrc = document.createAttribute('src');
  playerImgSrc.value = '/Images/Images-pokemon/svg/001-aaron.svg';
  const playerImgAlt = document.createAttribute('alt');
  playerImgAlt.value = 'Imagen de Logo';

  const playerName = document.createElement('h3');
  playerName.innerText = playerNickname;

  playerBlock.appendChild(playerImg);
  playerBlock.appendChild(playerName);

  playerImg.setAttributeNode(playerImgClass);
  playerImg.setAttributeNode(playerImgSrc);
  playerImg.setAttributeNode(playerImgAlt);

  playerTable.appendChild(playerBlock);

  playerBlock.setAttributeNode(playerBlockClass);
  playerBlock.setAttributeNode(playerBlockId);

  if(host==='true')
  {
    let jugadorElement = document.getElementById(playerNickname);
    if(jugadorElement)
    {
      jugadorElement.addEventListener('click', (event) =>
      {
        changeTeam(jugadorElement, playerNickname);
      })
    }
  }
}

function deletePlayer(playerNickname) {
  const playerElement = document.getElementById(playerNickname);
  if (playerElement) {
    playerElement.remove();
  }
}

function changeTeam(jugadorElement, playerName)
{
  let sessionId = window.localStorage.getItem('sessionId');
  if(jugadorElement.classList.contains('player-block-blue'))
  {
    jugadorElement.classList.remove('player-block-blue');
    jugadorElement.classList.add('player-block-red');
    let playerImage= jugadorElement.getElementsByClassName('players-image')[0];
    playerImage.src = '/Images/Images-pokemon/svg/002-avatar.svg';

    /*Creamos mensaje*/
    let msg = new Message("ChangeTeam", playerName, sessionId);
    msg.team = "red";
    const json = JSON.stringify(msg);
    /*Envío el mensaje*/
    socket.send(json);

  }else{
    if(jugadorElement.classList.contains('player-block-red'))
    {
      jugadorElement.classList.remove('player-block-red');
      jugadorElement.classList.add('player-block-blue');
      let playerImage= jugadorElement.getElementsByClassName('players-image')[0];
      playerImage.src = '/Images/Images-pokemon/svg/001-aaron.svg';

      /*Creamos mensaje*/
      let msg = new Message("ChangeTeam", playerName, sessionId);
      msg.team = "blue";
      const json = JSON.stringify(msg);
      /*Envío el mensaje*/
      socket.send(json);
    }
  }
}

function changePlayerTeam(jsonMessage) {
  let playerName = jsonMessage.playerName;
  let team = jsonMessage.team;

  let jugadorElement = document.getElementById(playerName);
  if(jugadorElement)
  {
    if(team === 'red')
    {
      jugadorElement.classList.remove('player-block-blue');
      jugadorElement.classList.add('player-block-red');
      let playerImage= jugadorElement.getElementsByClassName('players-image')[0];
      playerImage.src = '/Images/Images-pokemon/svg/002-avatar.svg';
    }else{
      if(team === 'blue')
      {
        jugadorElement.classList.remove('player-block-red');
        jugadorElement.classList.add('player-block-blue');
        let playerImage= jugadorElement.getElementsByClassName('players-image')[0];
        playerImage.src = '/Images/Images-pokemon/svg/001-aaron.svg';
      }
    }
  }
}

function getTeamId(){
  const playerName = window.localStorage.getItem('nickname');
  const jugadorElement = document.getElementById(playerName);
  if(jugadorElement.classList.contains('player-block-blue')){
    return 1;
  }
  else{
    return 2;
  }

  
}

window.addEventListener('load', setupEvents);

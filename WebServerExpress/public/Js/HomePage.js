class Message{
    constructor(inputType, playerName, idSession){
        this.typeMessage = inputType;
        this.playerName = playerName;
        this.idSession = idSession;
    }
}

const urlWs = `ws://${window.location.host}`;
let socket;

function setupEvents() {
    socket = new WebSocket(urlWs);
    /* Si existe un local storage lo seteamos en el input */
    let playerName = window.localStorage.getItem('nickname');
    let sessionId = window.localStorage.getItem('sessionId');
    if (playerName)
    {
        const nickNameElement = document.getElementById('nickname');
        nickNameElement.value = playerName;
    }

    if (sessionId)
    {
        const sessionIdElement = document.getElementById('sessionId');
        sessionIdElement.value = sessionId;
    }

    socket.onopen = function(event) {
        const createSessionButton = document.getElementById("new_create_session");
        const joinSessionButton = document.getElementById("new_join_session");

        createSessionButton.addEventListener("click", createSession);
        joinSessionButton.addEventListener("click", joinSession);

        socket.addEventListener('message', (event) => {
            let jsonMessage = JSON.parse(event.data);
            if (jsonMessage) {
                responseHandler(jsonMessage);
            }
        })
    };
}

function createSession() {
  const playerName = document.getElementById('nickname').value;
  if (playerName) {
    const msg = new Message('CreateSession', playerName, '');
    const json = JSON.stringify(msg);
    socket.send(json);
  } else {
    alert('Ingrese un nombre de usuario.');
  }
}

function joinSession() {
  const playerName = document.getElementById('nickname').value;
  const sessionId = document.getElementById('sessionId').value;

  if (playerName && sessionId) {
    const msg = new Message('JoinSession', playerName, sessionId);
    const json = JSON.stringify(msg);
    socket.send(json);
  } else {
    alert('Debe rellenar los campos.');
  }
}

function responseHandler(jsonMessage)
{
    switch (jsonMessage.typeMessage) {
        case "JoinedSession":
            socket.close();
            window.localStorage.setItem('nickname', jsonMessage.playerName);
            window.localStorage.setItem('sessionId', jsonMessage.idSession);
            window.localStorage.setItem('host', false);
            window.location.assign(`http://${window.location.host}/Lobby?id=${jsonMessage.idSession}`);

            break;
        case "SessionNotFound":
            alert("Sesión no encontrada.");

      break;
    case 'NickNameFound':
      alert('Nombre de usuario en uso.');

            break;
        case "CreatedSession":
            socket.close();
            window.localStorage.setItem('nickname', jsonMessage.playerName);
            window.localStorage.setItem('sessionId', jsonMessage.idSession);
            window.localStorage.setItem('host', true);
            window.location.assign(`http://${window.location.host}/Lobby?id=${jsonMessage.idSession}`);

      break;

      case "FullSession":
        alert("Sesión llena");
      break;
      
    default:
      alert('Error.');
      break;
  }
}
window.addEventListener('load', setupEvents);

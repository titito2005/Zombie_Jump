/*Enrutador*/
import express from 'express';
import * as eta from 'eta';
import ws from 'ws';
import router from './routes/routes.js';
import player from './models/player.js';
import session from './models/session.js';
import team from './models/team.js';

/*Controlador de sesiones para el juego*/
import requestController from './controllers/requestController.js';

const app = express();

/*Definimos a eta como render engine*/
app.engine('Eta', eta.renderFile);
/*No muestra que es express*/
app.disable('x-powered-by');
/*Seteamos eta como view engine*/
app.set('view engine', 'eta');

const wsServer = new ws.Server({ noServer: true });

let messageHandler = requestController.messageHandler;

wsServer.on('connection', (socket) => {

    socket.on('message', (message) => {
        let jsonMessage = JSON.parse(message);
        if (jsonMessage)
        {
            let typeMessage = jsonMessage.typeMessage;
            if (messageHandler.hasOwnProperty(typeMessage)){
                return messageHandler[typeMessage](socket,jsonMessage); 
            }
        }
    });

    socket.on('close', () => {
        console.log(`closed the connection`);
    });
});

app.use(router);
const webServer = app.listen(3000);

webServer.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, socket => {
        wsServer.emit('connection', socket, request);
    });
});
console.log(`board_game listening on 3000....`);

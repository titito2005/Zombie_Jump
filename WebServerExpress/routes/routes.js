import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import log from '../controllers/logController.js';
import error from '../controllers/errorController.js';
import game from '../controllers/gameController.js';
import homepage from '../controllers/homeController.js';
import lobby from '../controllers/lobbyController.js';

/* Enrutador unico de express */

const router = express.Router();

/*Definimos la ruta pública*/
const publicMiddleware = express.static(path.join(process.cwd(), 'public'));

/*Bitácora*/
router.use((req, res, next) => {log.logHttpRequest(req, res, next);});

/*Espera el cuerpo del mensaje o solicitud*/
//router.use(bodyParser.urlencoded({ extend: false }));

router.use(express.json());
router.use(express.urlencoded({
  extended: true
}));

router.get('/', (req, res) => {
  homepage.getHomePage(req, res);
});

router.get('/HomePage', (req, res) => {
    homepage.getHomePage(req, res);
});

router.get('/Lobby', (req, res) => {
    lobby.getLobbyPage(req, res);
});

/*Manejo de /game_session*/
router.get("/GameScreen", (req, res) => {
    game.getGameBoard(req, res);
});

/*Archivos públicos*/
console.log(publicMiddleware);

/*Usa el middleware página estética*/
router.use(publicMiddleware);

/* Manejo de errrores si no encuentra respuesta */
router.use((req, res) => { error.getNotFound(req, res); });

/* Exporta el router */
export default router;

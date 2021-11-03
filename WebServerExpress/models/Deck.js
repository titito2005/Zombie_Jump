import Card from './Card.js';

const COLOR = ['RED', 'BLUE', 'GREEN', 'YELLOW'];
const JUGADOR = ['ZOMBIE', 'PLAYER', 'PLAYER', 'PLAYER', 'PLAYER', 'ZOMBIE'];

export default class Deck {
  constructor(cartas = generarDeck()) {
    this.cartas = cartas;
  }

  get numeroCartas() {
    return this.cartas.length;
  }

  mezclarDeck() {
    for (let i = 0; i < this.numeroCartas - 1; i += 1) {
      const posicionNueva = Math.floor(Math.random() * (i + 1));
      const posicionVieja = this.cartas[posicionNueva];
      this.cartas[posicionNueva] = this.cartas[i];
      this.cartas[i] = posicionVieja;
    }
  }
}

export function generarDeck() {
  return COLOR.flatMap((color) => JUGADOR.map((jugador) => new Card(color, jugador)));
}

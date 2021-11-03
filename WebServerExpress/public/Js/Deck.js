import * as common from './Common.js';
import Carta from './Card.js';

export class Deck {
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
  return common.COLOR.flatMap((color) => common.JUGADOR.map((jugador) => new Carta(color, jugador)));
}

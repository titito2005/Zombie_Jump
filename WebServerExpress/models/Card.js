export default class Card {
  constructor(color, jugador) {
    this.color = color;
    this.jugador = jugador;
    this.used = false;
  }

  get Color() {
    return this.color;
  }
// eslint-disable-next-line linebreak-style
}

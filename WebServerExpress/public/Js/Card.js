export default class Carta {
  constructor(color, jugador) {
    this.color = color;
    this.jugador = jugador;
    this.used = false;
  }

  getHTML() {
    const cardDiv = document.createElement('div');
    cardDiv.innerText = this.jugador;
    cardDiv.id = 'cartaJugador';
    cardDiv.classList.add('carta', this.color);
    return cardDiv;
  }

  get Color() {
    return this.color;
  }
}

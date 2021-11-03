import Game from './Game.js';

function main() {
  const game = new Game();
  game.setupEvents();



  /* PRUEBA DE MODALES */
  let modal = null;
  let btn = null;
  let span = null;
  let body = null;
  if (document.getElementById('btnModalSonido')) {
    modal = document.getElementById('tvesModalSonido');
    btn = document.getElementById('btnModalSonido');
    span = document.getElementsByClassName('close')[0];
    body = document.getElementsByTagName('body')[0];

    btn.onclick = function btnSonido() {
      modal.style.display = 'block';
      body.style.position = 'static';
      body.style.overflow = 'hidden';
      body.style.height = '100%';
    };

    span.onclick = function btnSapn() {
      modal.style.display = 'none';
      body.style.position = 'inherit';
      body.style.overflow = 'visible';
    };

    window.onclick = function windowClick(event) {
      if (event.target === modal) {
        modal.style.display = 'none';
        body.style.overflow = 'visible';
      }
    };
  }
  let modal2 = null;
  let btn2 = null;
  let span2 = null;
  let body2 = null;

  if (document.getElementById('btnModalAyuda')) {
    modal2 = document.getElementById('tvesModalAyuda');
    btn2 = document.getElementById('btnModalAyuda');
    span2 = document.getElementsByClassName('close')[1];
    body2 = document.getElementsByTagName('body')[0];

    btn2.onclick = function btnAyuda() {
      modal2.style.display = 'block';
      body2.style.position = 'static';
      body2.style.overflow = 'hidden';
      body2.style.height = '100%';
    };

    span2.onclick = function btnSapn2() {
      modal2.style.display = 'none';
      body2.style.position = 'inherit';
      body2.style.overflow = 'visible';
    };

    window.onclick = function btnOnclick(event) {
      if (event.target === modal) {
        modal2.style.display = 'none';
        body2.style.overflow = 'visible';
      }
    };
  }
}

window.addEventListener('load', main);

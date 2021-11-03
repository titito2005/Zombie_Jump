import * as commonInclude from './Common.js';

export class Player {
  constructor(id, startingRow, startingCol, backMove) {
    this.id = id;
    this.element = document.getElementById(this.id);
    this.row = startingRow;
    this.col = startingCol;
    this.move(0, 0);
    /* Posición no retorno */
    this.noX = -1;
    this.noY = -1;
    /* Posicicion anterior */
    this.anteriorRow = startingRow;
    this.anteriorCol = startingCol;
    /* Permitir ir para atrás */
    this.allow_back_move = backMove;
  }

  verifyMove(deltaRows, deltaCols) {
    let possibleMove = false;
    const newRow = this.row + deltaRows;
    const newCol = this.col + deltaCols;
    if (newCol >= 0 && newCol < commonInclude.gameBoardCols
      && newRow >= 0 && newRow < commonInclude.gameBoardRows) {
      if (commonInclude.gameBoard[newRow][newCol] != null) {
        possibleMove = true;
      }
    }

    return possibleMove;
  }

  move(deltaRows, deltaCols) {
    this.row += deltaRows;
    this.col += deltaCols;
    const rowPercent = (100.0 * this.row) / commonInclude.gameBoardRows;
    const colPercent = (100.0 * this.col) / commonInclude.gameBoardCols;
    this.element.style.top = `${rowPercent}%`;
    this.element.style.left = `${colPercent}%`;
    console.log(`changed rows from ${this.row - deltaRows} to ${this.row}`);
    console.log(`changed cols from ${this.col - deltaCols} to ${this.col}`);
  }

  saveLastPosition() {
    this.anteriorRow = this.row;
    this.anteriorCol = this.col;
  }

  findNoReturn(actualRow, actualCol, lastRow, lastCol, lastMehotdRow, lastMehotdCol) {
    /* Verificar casilla actual */
    if (lastRow >= 0 && lastRow < commonInclude.gameBoardRows
      && lastCol >= 0 && lastCol < commonInclude.gameBoardCols) {
      if (commonInclude.gameBoard[lastRow][lastCol] !== 'empty') {
        if (actualRow === lastRow + 1 && actualCol === lastCol) {
          this.noX = lastRow;
          this.noY = lastCol;
        } else if (!(lastRow + 1 === lastMehotdRow && lastCol === lastMehotdCol)) {
          this.findNoReturn(actualRow, actualCol, lastRow + 1, lastCol, lastRow, lastCol);
        }

        if (actualRow === lastRow - 1 && actualCol === lastCol) {
          this.noX = lastRow;
          this.noY = lastCol;
        } else if (!(lastRow - 1 === lastMehotdRow && lastCol === lastMehotdCol)) {
          this.findNoReturn(actualRow, actualCol, lastRow - 1, lastCol, lastRow, lastCol);
        }

        if (actualRow === lastRow && actualCol === lastCol + 1) {
          this.noX = lastRow;
          this.noY = lastCol;
        } else if (!(lastRow === lastMehotdRow && lastCol + 1 === lastMehotdCol)) {
          this.findNoReturn(actualRow, actualCol, lastRow, lastCol + 1, lastRow, lastCol);
        }

        if (actualRow === lastRow && actualCol === lastCol - 1) {
          this.noX = lastRow;
          this.noY = lastCol;
        } else if (!(lastRow === lastMehotdRow && lastCol - 1 === lastMehotdCol)) {
          this.findNoReturn(actualRow, actualCol, lastRow, lastCol - 1, lastRow, lastCol);
        }
      }
    }
  }

  select() {
    this.element.classList.add('player-active');
  }

  deselect() {
    this.element.classList.remove('player-active');
  }
}

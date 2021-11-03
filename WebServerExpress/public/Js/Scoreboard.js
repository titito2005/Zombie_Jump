export class Scoreboard {
  constructor() {
    this.scores = {};
  }

  getScoreBoxByPlayerName(playerName){
    let scorebox = document.getElementById(`score-${playerName}`);
    if(scorebox){
      return scorebox;
    }
    else{
      throw `score-${playerName} not found.`
    }
  }

  addScore(playerName, deltaScore) {
    if(!(playerName in this.scores)){
      this.scores[playerName] = 0;
    }
    this.scores[playerName] += deltaScore;
  }

  multScore(playerName, multiplier) {
    if(!(playerName in this.scores)){
      this.scores[playerName] = 0;
    }
    this.scores[playerName] = Math.floor(this.scores[playerName] * multiplier);
  }

  updateScoreElements(){
    for (let player in this.scores){
      let scorebox = this.getScoreBoxByPlayerName(player);
      let scoreboxText = `${this.scores[player]} ${this.scores[player] == 1? 'point':'points'}`;
      scorebox.innerHTML =  scoreboxText
    }
    //eventualmente actualizar los scores de los equipos
  }
}

import { EventEmitter } from "events";

export default class Timer extends EventEmitter{

    startTimer(turnDuration){
        this.turnDuration = turnDuration;
        this.timeRemaining = this.turnDuration;
        this.timer = setInterval(()=>{
            this.timeRemaining--;
            if(this.timeRemaining === 0){
                this.emit('timeout');
            }
        }, 1000);
    }
    resetTimer(){
        this.timeRemaining = this.turnDuration;
    }

}
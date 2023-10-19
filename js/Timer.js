export default class Timer {

  constructor({ isPomodoroTimer = false, timerDefaultMinutes, timerDefaultSeconds,
    timerTextElement, onTimerStep, onTimerFinish }) {
    
    this.timerRunning = false;

    this.isPomodoroTimer = isPomodoroTimer;

    this.timerTextElement = timerTextElement;

    this.timerDefaultMinutes = timerDefaultMinutes;
    this.timerDefaultSeconds = timerDefaultSeconds;
    this.timerMinutes = this.timerDefaultMinutes;
    this.timerSeconds = this.timerDefaultSeconds;

    this.onTimerStep = (strTimer, textElement) => { onTimerStep(strTimer, textElement) }
    this.onTimerFinish = () => { onTimerFinish() }

    this.advanceTimer = this.advanceTimer.bind(this);
  }

  timerStart() {
    if (!(this.timerMinutes == 0 && this.timerSeconds == 0) && !this.timerRunning) {
      this.timerRunning = true;
      this.timerInterval = setInterval(this.advanceTimer, 1000);
    }
  }

  timerStop() {
    if (this.timerRunning) {
      this.timerRunning = false;
      clearInterval(this.timerInterval);
    }
  }

  timerReset() {
    if (this.timerRunning) {
      this.timerRunning = false
      clearInterval(this.timerInterval);
    }
  
    this.timerMinutes = this.timerDefaultMinutes;
    this.timerSeconds = this.timerDefaultSeconds;
  
    this.drawTimer();
  }

  advanceTimer() {
    if (this.timerMinutes == 0 && this.timerSeconds == 0) {
      this.onTimerFinish();

      clearInterval(this.timerInterval);
      this.timerRunning = false;
      return;
    }

    if (this.timerSeconds == 0) {
      if (this.timerMinutes > 0) {
        this.timerMinutes--;
      }
      this.timerSeconds = 59;
    }
    else {
      this.timerSeconds--;
    }

    this.drawTimer();
  }

  timerPlus5Minute() {
    this.timerMinutes += 5;

    this.drawTimer();
  }

  timerMinus5Minute() {
    if (this.timerMinutes >= 5) {
      this.timerMinutes -= 5;
  
      this.drawTimer();
    }
  }

  timerPlus1Minute() {
    this.timerMinutes++;

    this.drawTimer();
  }

  timerMinus1Minute() {
    if (this.timerMinutes > 0) {
      this.timerMinutes--;
  
      this.drawTimer();
    }
  }

  timerPlus30Second() {
    this.timerSeconds += 30;
    if (this.timerSeconds > 59) {
      this.timerSeconds %= 60;
      this.timerMinutes++;
    }
  
    this.drawTimer();
  }
  
  timerMinus30Second() {
    if (this.timerMinutes > 0 || (this.timerMinutes == 0 && this.timerSeconds >= 30)) {
      if (this.timerMinutes > 0 && this.timerSeconds < 30) {
        this.timerMinutes--;
      }
  
      this.timerSeconds = Math.abs((this.timerSeconds - 30) % 60);
      
      this.drawTimer();
    }
  }

  setDefaultTime(minutes, seconds) {
    this.timerDefaultMinutes = minutes;
    this.timerDefaultSeconds = seconds;
    this.timerMinutes = minutes;
    this.timerSeconds = seconds;

    this.drawTimer();
  }

  drawTimer() {
    let strMinutes = this.timerMinutes.toString().padStart(2, '0');
    let strSeconds = this.timerSeconds.toString().padStart(2, '0');

    this.onTimerStep(`${strMinutes}:${strSeconds}`, this.timerTextElement);
  }
}
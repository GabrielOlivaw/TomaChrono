import Timer from "./Timer.js";

let isTimerSetInputsOpened = false;

const pomodoroTimer = new Timer({
  isPomodoroTimer: true,
  timerDefaultMinutes: JSON.parse(localStorage.getItem('pomodoroDefaultTime'))?.minutes ?? 25,
  timerDefaultSeconds: JSON.parse(localStorage.getItem('pomodoroDefaultTime'))?.seconds ?? 0,
  timerTextElement: document.getElementById('pomodoroTimerText'),
  onTimerStep: (strTimer, timerTextElement) => {
    drawTimer(strTimer, timerTextElement);
  },
  onTimerFinish: () => {
    finishCurrentTimer();
  }
});

const breakTimer = new Timer({
  timerDefaultMinutes: JSON.parse(localStorage.getItem('breakDefaultTime'))?.minutes ?? 5,
  timerDefaultSeconds: JSON.parse(localStorage.getItem('breakDefaultTime'))?.seconds ?? 0,
  timerTextElement: document.getElementById('breakTimerText'),
  onTimerStep: (strTimer, timerTextElement) => {
    drawTimer(strTimer, timerTextElement);
  },
  onTimerFinish: () => {
    finishCurrentTimer();
  }
});

const longBreakTimer = new Timer({
  timerDefaultMinutes: JSON.parse(localStorage.getItem('longBreakDefaultTime'))?.minutes ?? 15,
  timerDefaultSeconds: JSON.parse(localStorage.getItem('longBreakDefaultTime'))?.seconds ?? 0,
  timerTextElement: document.getElementById('longBreakTimerText'),
  onTimerStep: (strTimer, timerTextElement) => {
    drawTimer(strTimer, timerTextElement);
  },
  onTimerFinish: () => {
    finishCurrentTimer();
  }
}); 

let currentTimer = pomodoroTimer;

let pomodoroCount = 0;

function timerSetDefaultTime() {
  let minutes = parseInt(document.getElementById('timerSetDefaultMinutes').value);
  let seconds = parseInt(document.getElementById('timerSetDefaultSeconds').value);
  
  if (!isNaN(minutes) && !isNaN(seconds)) {
    currentTimer.setDefaultTime(minutes, seconds);

    let localStorageName
    if (currentTimer.isPomodoroTimer) {
      localStorageName = 'pomodoroDefaultTime';
    }
    else {
      if (pomodoroCount % 4 != 0) {
        localStorageName = 'breakDefaultTime';
      }
      else {
        localStorageName = 'longBreakDefaultTime'
      }
    }
    localStorage.setItem(localStorageName, JSON.stringify({ minutes, seconds }));

    timerSetResetInputs();
  }
}

function timerSetResetInputs() {
  let timerSetFields = document.getElementById('timerSetFields');
  timerSetFields.innerHTML = '<button id="timerSet" class="button">Set default</button>';
  document.getElementById('timerSet').onclick = timerSetInputs;

  isTimerSetInputsOpened = false;
}

function timerSetInputs() {
  let timeDiv = document.createElement('div');
  timeDiv.id = "timerSetSection";

  let inputMinutes = document.createElement('input');
  inputMinutes.id = 'timerSetDefaultMinutes';
  inputMinutes.type = 'number';
  inputMinutes.className = 'inputNumber';
  inputMinutes.value = currentTimer.timerDefaultMinutes;
  inputMinutes.min = '0';
  inputMinutes.max = '120';
  inputMinutes.style = 'max-width: 50px';

  let inputSeparator = document.createElement('span');
  inputSeparator.innerText = ':';

  let inputSeconds = inputMinutes.cloneNode();
  inputSeconds.id = 'timerSetDefaultSeconds';
  inputSeconds.value = currentTimer.timerDefaultSeconds;
  inputSeconds.max = 59;

  let setButton = document.createElement('button');
  setButton.id = 'timerSetTime';
  setButton.className= 'button';
  setButton.innerText = 'Set';
  setButton.onclick = timerSetDefaultTime;

  timeDiv.appendChild(inputMinutes);
  timeDiv.appendChild(inputSeparator);
  timeDiv.appendChild(inputSeconds);
  timeDiv.appendChild(setButton);

  let timerSetFields = document.getElementById('timerSetFields');
  timerSetFields.innerHTML = '';
  timerSetFields.appendChild(timeDiv);

  isTimerSetInputsOpened = true;
}

function timer1Minute() {
  let operation = document.getElementById('timerOperation').value;

  (operation == '+') ? currentTimer.timerPlus1Minute() : currentTimer.timerMinus1Minute();
}

function timer5Minute() {
  let operation = document.getElementById('timerOperation').value;

  (operation == '+') ? currentTimer.timerPlus5Minute() : currentTimer.timerMinus5Minute();
}

function timer30Second() {
  let operation = document.getElementById('timerOperation').value;

  (operation == '+') ? currentTimer.timerPlus30Second() : currentTimer.timerMinus30Second();
}

function drawTimer(strTimer, timerTextElement) {
  timerTextElement.innerText = strTimer;
  document.title = `${strTimer} - ${timerTextElement.attributes.name.value}`;
}

function finishCurrentTimer() {
  currentTimer.timerReset();
  let pomodoroTimerElement = document.getElementsByClassName('pomodoroTimer')[0];

  if (currentTimer.isPomodoroTimer) {
    pomodoroCount++;
    document.getElementById('pomodoroCount').innerText = pomodoroCount;

    if (pomodoroCount % 4 != 0) {
      // pomodoroTimer -> breakTimer
      pomodoroTimerElement.classList.replace('middleTimer', 'leftTimer');
      let breakTimerElement = document.getElementsByClassName('breakTimer')[0];
      breakTimerElement.classList.replace('leftTimer', 'middleTimer')
      currentTimer = breakTimer;
    }
    else {
      // pomodoroTimer -> longBreakTimer
      pomodoroTimerElement.classList.replace('middleTimer', 'rightTimer');
      let longBreakTimerElement = document.getElementsByClassName('longBreakTimer')[0];
      longBreakTimerElement.classList.replace('rightTimer', 'middleTimer')
      currentTimer = longBreakTimer;
    }
  }
  else {
    if (pomodoroCount % 4 != 0) {
      // breakTimer -> pomodoroTimer
      pomodoroTimerElement.classList.replace('leftTimer', 'middleTimer');
      let breakTimerElement = document.getElementsByClassName('breakTimer')[0];
      breakTimerElement.classList.replace('middleTimer', 'leftTimer')
      currentTimer = pomodoroTimer;
    }
    else {
      // longBreakTimer -> pomodoroTimer
      pomodoroTimerElement.classList.replace('rightTimer', 'middleTimer');
      let longBreakTimerElement = document.getElementsByClassName('longBreakTimer')[0];
      longBreakTimerElement.classList.replace('middleTimer', 'rightTimer')
      currentTimer = pomodoroTimer;
    }
  }
  
  if (isTimerSetInputsOpened) {
    timerSetResetInputs();
  }
  currentTimer.timerReset();
  currentTimer.timerStart();
}

function skipCurrentTimer() {
  finishCurrentTimer();
  document.getElementById('timerSkip').blur();
}

function resetAllDefaultTimers() {
  if (confirm('Are you sure you want to reset all timers to their default values?')) {
    localStorage.setItem('pomodoroDefaultTime', JSON.stringify({ minutes: 25, seconds: 0 }));
    pomodoroTimer.setDefaultTime(25, 0);

    localStorage.setItem('breakDefaultTime', JSON.stringify({ minutes: 5, seconds: 0 }));
    breakTimer.setDefaultTime(5, 0);

    localStorage.setItem('longBreakDefaultTime', JSON.stringify({ minutes: 15, seconds: 0 }));
    longBreakTimer.setDefaultTime(15, 0);

    initTimerText();
    currentTimer.drawTimer();
  }
}

function resetTimersPositions() {
  let pomodoroTimerElement = document.getElementsByClassName('pomodoroTimer')[0];
  let breakTimerElement = document.getElementsByClassName('breakTimer')[0];
  let longBreakTimerElement = document.getElementsByClassName('longBreakTimer')[0];

  pomodoroTimerElement.className = 'pomodoroTimer middleTimer';
  breakTimerElement.className = 'breakTimer leftTimer';
  longBreakTimerElement.className = 'longBreakTimer rightTimer';

}

function resetPomodoroCount() {
  pomodoroCount = 0;
  document.getElementById('pomodoroCount').innerText = pomodoroCount;
  
  currentTimer.timerReset();
  currentTimer = pomodoroTimer;
  resetTimersPositions();
}

function initListeners() {
  document.getElementById('timerStart').onclick = () => { currentTimer.timerStart(); };
  document.getElementById('timerStop').onclick = () => { currentTimer.timerStop(); };
  document.getElementById('timerReset').onclick = () => { currentTimer.timerReset(); };
  document.getElementById('timerSkip').onclick = () => { skipCurrentTimer(); };

  document.getElementById('timer1Minute').onclick = timer1Minute;
  document.getElementById('timer5Minute').onclick = timer5Minute;
  document.getElementById('timer30Second').onclick = timer30Second;

  document.getElementById('timerSet').onclick = timerSetInputs;
  document.getElementById('timerResetAllDefaults').onclick = resetAllDefaultTimers;

  document.getElementById('timerResetPomodoroCount').onclick = resetPomodoroCount;
}

function initTimerText() {
  breakTimer.drawTimer();
  longBreakTimer.drawTimer();
  pomodoroTimer.drawTimer();
}

initTimerText();
initListeners();
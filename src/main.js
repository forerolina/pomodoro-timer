import './style.css'

const WORK_SECONDS = 25 * 60
const BREAK_SECONDS = 5 * 60

/** @type {number} */
let timeRemaining = WORK_SECONDS
/** @type {boolean} */
let isRunning = false
/** @type {'work' | 'break'} */
let currentMode = 'work'

/** @type {ReturnType<typeof setInterval> | null} */
let intervalId = null

const app = document.getElementById('app')
const timeDisplay = document.getElementById('time-display')
const modeLabel = document.getElementById('mode-label')
const startPauseButton = document.getElementById('start-pause-button')
const resetButton = document.getElementById('reset-button')

if (!app || !timeDisplay || !modeLabel || !startPauseButton || !resetButton) {
  throw new Error('Pomodoro timer: required DOM elements are missing')
}

function formatMmSs(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function updateDom() {
  timeDisplay.textContent = formatMmSs(timeRemaining)
  modeLabel.textContent = currentMode === 'work' ? 'Work' : 'Break'
  app.dataset.mode = currentMode
  startPauseButton.textContent = isRunning ? 'Pause' : 'Start'
  startPauseButton.setAttribute('aria-pressed', String(isRunning))
}

function clearTickInterval() {
  if (intervalId !== null) {
    clearInterval(intervalId)
    intervalId = null
  }
}

function switchToNextMode() {
  if (currentMode === 'work') {
    currentMode = 'break'
    timeRemaining = BREAK_SECONDS
  } else {
    currentMode = 'work'
    timeRemaining = WORK_SECONDS
  }
}

function tick() {
  if (!isRunning) return

  if (timeRemaining > 0) {
    timeRemaining -= 1
  }

  if (timeRemaining === 0) {
    switchToNextMode()
  }

  updateDom()
}

function startPause() {
  if (isRunning) {
    isRunning = false
    clearTickInterval()
  } else {
    isRunning = true
    clearTickInterval()
    intervalId = setInterval(tick, 1000)
  }
  updateDom()
}

function reset() {
  isRunning = false
  clearTickInterval()
  currentMode = 'work'
  timeRemaining = WORK_SECONDS
  updateDom()
}

startPauseButton.addEventListener('click', startPause)
resetButton.addEventListener('click', reset)

updateDom()

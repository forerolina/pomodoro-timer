import './style.css'

const WORK_SECONDS = 25 * 60
const BREAK_SECONDS = 5 * 60

/** @type {number} */
let workDurationSeconds = WORK_SECONDS
/** @type {number} */
let breakDurationSeconds = BREAK_SECONDS
/** @type {number} */
let timeRemaining = workDurationSeconds
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
const workMinutesInput = document.getElementById('work-minutes-input')
const breakMinutesInput = document.getElementById('break-minutes-input')
const applySettingsButton = document.getElementById('apply-settings-button')

if (
  !app ||
  !timeDisplay ||
  !modeLabel ||
  !startPauseButton ||
  !resetButton ||
  !workMinutesInput ||
  !breakMinutesInput ||
  !applySettingsButton
) {
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

function clampDurationValue(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum)
}

function parseDurationInput(value, minimum, maximum) {
  const parsed = Number.parseInt(value, 10)
  if (Number.isNaN(parsed)) return minimum
  return clampDurationValue(parsed, minimum, maximum)
}

function parseSegmentSeconds(minutesInput) {
  const minutes = parseDurationInput(minutesInput.value, 0, 180)
  const totalSeconds = minutes * 60
  return Math.max(totalSeconds, 1)
}

function syncDurationInputs() {
  workMinutesInput.value = String(Math.floor(workDurationSeconds / 60))
  breakMinutesInput.value = String(Math.floor(breakDurationSeconds / 60))
}

function switchToNextMode() {
  if (currentMode === 'work') {
    currentMode = 'break'
    timeRemaining = breakDurationSeconds
  } else {
    currentMode = 'work'
    timeRemaining = workDurationSeconds
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
  timeRemaining = workDurationSeconds
  updateDom()
}

function applySettings() {
  workDurationSeconds = parseSegmentSeconds(workMinutesInput)
  breakDurationSeconds = parseSegmentSeconds(breakMinutesInput)
  timeRemaining =
    currentMode === 'work' ? workDurationSeconds : breakDurationSeconds
  syncDurationInputs()
  updateDom()
}

startPauseButton.addEventListener('click', startPause)
resetButton.addEventListener('click', reset)
applySettingsButton.addEventListener('click', applySettings)

syncDurationInputs()
updateDom()

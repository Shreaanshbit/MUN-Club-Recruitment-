function TimerPanel({
  timeLeft,
  isRunning,
  mode,
  currentSpeaker,
  startTimer,
  pauseTimer,
  resetTimer,
}) {
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const timerClass =
    timeLeft <= 20 ? "timer-display warning blink" : "timer-display";

  return (
    <section className="panel timer-panel">
      <h2>Committee Timer</h2>

      <p className="timer-mode">
        {mode === "speech" ? "Speech Time" : "Questions Time"}
      </p>

      <p className="speaker-label">
        {currentSpeaker ? currentSpeaker.country : "No active speaker"}
      </p>

      <div className={timerClass}>{formatTime(timeLeft)}</div>

      <div className="timer-buttons">
        <button onClick={startTimer} disabled={!currentSpeaker || isRunning}>
          Start
        </button>
        <button onClick={pauseTimer} disabled={!isRunning}>
          Pause
        </button>
        <button onClick={resetTimer}>Reset</button>
      </div>
    </section>
  );
}

export default TimerPanel;
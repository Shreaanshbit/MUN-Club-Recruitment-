function TimerPanel({
  timeLeft,
  isRunning,
  mode,
  currentSpeaker,
  startTimer,
  pauseTimer,
  resetTimer,
  nextSpeaker,
  defaultTime,
  committeeTimeLeft,
  totalCommitteeTime,
}) {
  // ── Your original formatter ────────────────────────────────────────────────
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  // ── Visual state derived from props ────────────────────────────────────────
  const isWarning = timeLeft <= 20 && timeLeft > 0;
  const isExpired = timeLeft === 0;



  // SVG circular progress (speaker only)
  const RADIUS = 90;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const progress = defaultTime > 0 ? timeLeft / defaultTime : 0;
  const strokeDashoffset = isExpired
    ? CIRCUMFERENCE
    : CIRCUMFERENCE * (1 - progress);

  const timerColorClass = isExpired
    ? "expired"
    : isWarning
    ? "warning"
    : isRunning
    ? "running"
    : "idle";

  const statusText = isExpired
    ? "TIME EXPIRED"
    : isRunning
    ? "RUNNING"
    : "PAUSED";

  return (
    <section className="panel premium-timer-panel">
      <h2 className="timer-title">Committee Timer</h2>

      {/* Speaker name */}
      <p className="timer-speaker-name">
        {currentSpeaker ? currentSpeaker.country : "No speaker selected"}
      </p>

      {/* Circular timer with outer committee dial */}
      <div className="timer-centerpiece">
        <div className={`timer-ring-wrap timer-ring-wrap--${timerColorClass}${isWarning && isRunning ? " blink" : ""}`} style={{position: 'relative'}}>
          <svg
            className="timer-svg"
            viewBox="0 0 220 220"
            xmlns="http://www.w3.org/2000/svg"
            style={{position: 'absolute', left: 0, top: 0, width: '100%', height: '100%'}}
          >
            {/* Track */}
            <circle
              cx="110" cy="110" r={RADIUS}
              fill="none"
              stroke="#e3e9f6"
              strokeWidth="10"
            />
            {/* Animated arc — progress ring */}
            <circle
              cx="110" cy="110" r={RADIUS}
              fill="none"
              stroke="#2E4EA2"
              strokeWidth="18"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
              style={{
                transform: "rotate(-90deg)",
                transformOrigin: "110px 110px",
                transition: "stroke 0.4s ease, stroke-dashoffset 0.5s linear",
              }}
            />
          </svg>
          {/* Inner face */}
          <div className="timer-inner" style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 2}}>
            <div className={`timer-display-large timer-display-large--${timerColorClass}`}>
              {formatTime(timeLeft)}
            </div>
            <div className="timer-status-text">{statusText}</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="timer-controls-grid">
        <button
          onClick={startTimer}
          disabled={!currentSpeaker || isRunning}
          className="timer-action-btn primary-action"
        >
          ▶ Start
        </button>

        <button
          onClick={pauseTimer}
          disabled={!isRunning}
          className="timer-action-btn outline-action"
        >
          ⏸ Pause
        </button>

        <button
          onClick={resetTimer}
          className="timer-action-btn subtle-action"
        >
          ↺ Reset
        </button>

        <button
          onClick={nextSpeaker}
          disabled={isRunning || !currentSpeaker}
          className="timer-action-btn navy-action full-width-btn"
        >
          ⏭ Next Speaker
        </button>
      </div>

      {/* Warning banner */}
      {isWarning && isRunning && (
        <div className="timer-warning-banner">
          ⚠ TIME WARNING — Less than 20 seconds remaining
        </div>
      )}
    </section>
  );
}

export default TimerPanel;

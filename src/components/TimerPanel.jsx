function TimerPanel() {
  return (
    <section className="panel timer-panel">
      <h2>Committee Timer</h2>
      <div className="timer-display">01:30</div>
      <div className="timer-buttons">
        <button>Start</button>
        <button>Pause</button>
        <button>Reset</button>
      </div>
    </section>
  );
}

export default TimerPanel;
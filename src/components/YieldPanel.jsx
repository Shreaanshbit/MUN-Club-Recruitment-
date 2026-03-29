import { useState } from "react";

function YieldPanel({
  queue,
  currentSpeaker,
  isRunning,
  mode,
  yieldToChair,
  yieldToQuestions,
  yieldToDelegate,
}) {
  const [selectedDelegateId, setSelectedDelegateId] = useState("");
  const [activityLog, setActivityLog] = useState([]);

  // ── Wrap yield actions to also append to activity log ─────────────────────
  const logAction = (action) => {
    const entry = {
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      action,
      speaker: currentSpeaker?.country || "—",
    };
    setActivityLog((prev) => [entry, ...prev].slice(0, 10));
  };

  const handleYieldToChair = () => {
    if (isRunning || !currentSpeaker) return;
    logAction("Yielded to Chair");
    yieldToChair();
  };

  const handleYieldToQuestions = () => {
    if (isRunning || !currentSpeaker || mode === "questions") return;
    logAction("Yielded to Questions");
    yieldToQuestions();
  };

  // ── Your original delegate yield handler ──────────────────────────────────
  const handleYieldToDelegate = () => {
    if (!selectedDelegateId) return;
    const delegate = queue.find((item) => item.id === Number(selectedDelegateId));
    logAction(`Yielded to ${delegate?.country || "delegate"}`);
    yieldToDelegate(Number(selectedDelegateId));
    setSelectedDelegateId("");
  };

  return (
    <section className="panel premium-yield-panel">
      <h2 className="section-title">Yield Controls</h2>

      {/* ── Active speaker ── */}
      <div className="yield-status-card">
        <span className="status-label">Active Speaker</span>
        {currentSpeaker ? (
          <p className="status-speaker">{currentSpeaker.country}</p>
        ) : (
          <p className="status-speaker status-speaker--empty">No active speaker</p>
        )}
      </div>

      {/* ── Yield buttons ── */}
      <div className="yield-buttons-grid">
        <button
          onClick={handleYieldToChair}
          disabled={isRunning || !currentSpeaker}
          className="yield-btn primary-yield"
        >
          🪑 Yield to Chair
        </button>

        <button
          onClick={handleYieldToQuestions}
          disabled={isRunning || !currentSpeaker || mode === "questions"}
          className="yield-btn outline-yield"
        >
          ❓ Yield to Questions
        </button>
      </div>

      {/* ── Yield to delegate ── */}
      <div className="delegate-yield-card">
        <label className="input-label">Yield to another Delegate</label>
        <select
          value={selectedDelegateId}
          onChange={(e) => setSelectedDelegateId(e.target.value)}
          disabled={isRunning || queue.length === 0}
          className="delegate-select"
        >
          <option value="">Select delegate…</option>
          {queue.map((delegate) => (
            <option key={delegate.id} value={delegate.id}>
              {delegate.country}
            </option>
          ))}
        </select>

        <button
          onClick={handleYieldToDelegate}
          disabled={isRunning || !currentSpeaker || !selectedDelegateId}
          className="yield-confirm-btn"
        >
          Confirm Yield
        </button>
      </div>

      {/* ── Activity log ── */}
      <div className="activity-log-card">
        <h3>Activity Log</h3>
        {activityLog.length === 0 ? (
          <p className="empty-text">No activity yet</p>
        ) : (
          <div className="activity-log-list">
            {activityLog.map((entry, i) => (
              <div key={i} className="activity-log-entry">
                <span className="log-time">{entry.time}</span>
                <div>
                  <div className="log-action">{entry.action}</div>
                  <div className="log-speaker">{entry.speaker}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default YieldPanel;

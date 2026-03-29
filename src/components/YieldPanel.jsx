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

  const handleYieldToDelegate = () => {
    if (!selectedDelegateId) return;
    yieldToDelegate(Number(selectedDelegateId));
    setSelectedDelegateId("");
  };

  return (
    <section className="panel yield-panel">
      <h2>Yield Controls</h2>

      <p className="yield-status">
        {currentSpeaker
          ? `Active Speaker: ${currentSpeaker.country}`
          : "No active speaker"}
      </p>

      <div className="yield-buttons">
        <button onClick={yieldToChair} disabled={isRunning || !currentSpeaker}>
          Yield to Chair
        </button>

        <button
          onClick={yieldToQuestions}
          disabled={isRunning || !currentSpeaker || mode === "questions"}
        >
          Yield to Questions
        </button>
      </div>

      <div className="delegate-yield-box">
        <label>Yield to another Delegate</label>

        <select
          value={selectedDelegateId}
          onChange={(e) => setSelectedDelegateId(e.target.value)}
          disabled={isRunning || queue.length === 0}
        >
          <option value="">Select delegate</option>
          {queue.map((delegate) => (
            <option key={delegate.id} value={delegate.id}>
              {delegate.country}
            </option>
          ))}
        </select>

        <button
          onClick={handleYieldToDelegate}
          disabled={isRunning || !currentSpeaker || !selectedDelegateId}
        >
          Confirm Yield
        </button>
      </div>
    </section>
  );
}

export default YieldPanel;
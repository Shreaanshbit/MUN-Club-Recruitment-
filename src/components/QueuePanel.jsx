import { useState } from "react";

function QueuePanel({ queue, currentSpeaker, addCountry, removeFromQueue, moveToBottom }) {
  const [country, setCountry] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    addCountry(country);
    setCountry("");
  };

  return (
    <section className="panel queue-panel">
      <h2>General Speakers List</h2>

      <form onSubmit={handleSubmit} className="add-form">
        <input
          type="text"
          placeholder="Enter country name"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <div className="current-speaker-card">
        <h3>Current Speaker</h3>
        <p>{currentSpeaker ? currentSpeaker.country : "No speaker selected"}</p>
      </div>

      <div className="queue-list">
        <h3>Upcoming Speakers</h3>

        {queue.length === 0 ? (
          <p className="empty-text">No delegates in queue</p>
        ) : (
          queue.map((item, index) => (
            <div key={item.id} className="queue-item">
              <div>
                <span className="queue-number">{index + 1}.</span>
                <span>{item.country}</span>
              </div>

              <div className="queue-actions">
                <button onClick={() => moveToBottom(item.id)}>Move to Bottom</button>
                <button onClick={() => removeFromQueue(item.id)} className="danger-btn">
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default QueuePanel;
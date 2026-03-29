import { useState } from "react";
import "./App.css";
import QueuePanel from "./components/QueuePanel";
import TimerPanel from "./components/TimerPanel";
import YieldPanel from "./components/YieldPanel";

function App() {
  const [queue, setQueue] = useState([]);
  const [currentSpeaker, setCurrentSpeaker] = useState(null);

  const addCountry = (countryName) => {
    const cleaned = countryName.trim();
    if (!cleaned) return;

    const alreadyExists =
      currentSpeaker?.country?.toLowerCase() === cleaned.toLowerCase() ||
      queue.some((item) => item.country.toLowerCase() === cleaned.toLowerCase());

    if (alreadyExists) return;

    const newDelegate = {
      id: Date.now(),
      country: cleaned,
    };

    if (!currentSpeaker) {
      setCurrentSpeaker(newDelegate);
    } else {
      setQueue((prev) => [...prev, newDelegate]);
    }
  };

  const removeFromQueue = (id) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const moveToBottom = (id) => {
    setQueue((prev) => {
      const index = prev.findIndex((item) => item.id === id);
      if (index === -1) return prev;

      const updated = [...prev];
      const [movedItem] = updated.splice(index, 1);
      updated.push(movedItem);
      return updated;
    });
  };

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <h1>MUN Chair Dashboard</h1>
          <p>General Speakers List Management</p>
        </div>
      </header>

      <main className="dashboard">
        <QueuePanel
          queue={queue}
          currentSpeaker={currentSpeaker}
          addCountry={addCountry}
          removeFromQueue={removeFromQueue}
          moveToBottom={moveToBottom}
        />

        <TimerPanel />

        <YieldPanel />
      </main>
    </div>
  );
}

export default App;
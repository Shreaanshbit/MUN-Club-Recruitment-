import { useEffect, useState } from "react";
import "./App.css";
import QueuePanel from "./components/QueuePanel";
import TimerPanel from "./components/TimerPanel";
import YieldPanel from "./components/YieldPanel";

function App() {
  const [queue, setQueue] = useState([]);
  const [currentSpeaker, setCurrentSpeaker] = useState(null);

  const [defaultTime, setDefaultTime] = useState(90);
  const [timeLeft, setTimeLeft] = useState(90);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("speech");

  useEffect(() => {
    let interval;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    if (timeLeft === 0) {
      setIsRunning(false);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

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

  const startTimer = () => {
    if (!currentSpeaker || timeLeft === 0) return;
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(defaultTime);
    setMode("speech");
  };

  const handlePresetChange = (seconds) => {
    setDefaultTime(seconds);
    setTimeLeft(seconds);
    setIsRunning(false);
    setMode("speech");
  };

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <h1>MUN Chair Dashboard</h1>
          <p>General Speakers List Management</p>
        </div>

        <div className="preset-box">
          <label>Speech Time</label>
          <select
            value={defaultTime}
            onChange={(e) => handlePresetChange(Number(e.target.value))}
          >
            <option value={60}>60 sec</option>
            <option value={90}>90 sec</option>
            <option value={120}>120 sec</option>
          </select>
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

        <TimerPanel
          timeLeft={timeLeft}
          isRunning={isRunning}
          mode={mode}
          currentSpeaker={currentSpeaker}
          startTimer={startTimer}
          pauseTimer={pauseTimer}
          resetTimer={resetTimer}
        />

        <YieldPanel />
      </main>
    </div>
  );
}

export default App;
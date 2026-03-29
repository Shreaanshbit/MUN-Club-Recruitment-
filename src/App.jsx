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

  const [selectedCountries, setSelectedCountries] = useState([]);
  const [totalCommitteeTime, setTotalCommitteeTime] = useState("");

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
      id: Date.now() + Math.random(),
      country: cleaned,
      code: "",
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

  const initializeCommittee = () => {
    const minutes = Number(totalCommitteeTime);

    if (selectedCountries.length === 0 || !minutes || minutes <= 0) return;

    const delegates = selectedCountries.map((countryObj) => ({
      id: Date.now() + Math.random(),
      country: countryObj.name,
      code: countryObj.code,
    }));

    const totalSeconds = minutes * 60;
    const perDelegateTime = Math.max(
      30,
      Math.floor(totalSeconds / delegates.length)
    );

    const [first, ...rest] = delegates;

    setCurrentSpeaker(first || null);
    setQueue(rest);
    setDefaultTime(perDelegateTime);
    setTimeLeft(perDelegateTime);
    setIsRunning(false);
    setMode("speech");
  };

  const nextSpeaker = () => {
    setIsRunning(false);
    setMode("speech");

    if (queue.length === 0) {
      setCurrentSpeaker(null);
      setTimeLeft(defaultTime);
      return;
    }

    const [next, ...rest] = queue;
    setCurrentSpeaker(next);
    setQueue(rest);
    setTimeLeft(defaultTime);
  };

  const yieldToChair = () => {
    if (isRunning || !currentSpeaker) return;
    nextSpeaker();
  };

  const yieldToQuestions = () => {
    if (isRunning || !currentSpeaker || timeLeft <= 0) return;
    setMode("questions");
  };

  const yieldToDelegate = (delegateId) => {
    if (isRunning || !currentSpeaker) return;

    const selectedDelegate = queue.find((item) => item.id === delegateId);
    if (!selectedDelegate) return;

    const updatedQueue = queue.filter((item) => item.id !== delegateId);

    setCurrentSpeaker(selectedDelegate);
    setQueue(updatedQueue);
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
          selectedCountries={selectedCountries}
          setSelectedCountries={setSelectedCountries}
          totalCommitteeTime={totalCommitteeTime}
          setTotalCommitteeTime={setTotalCommitteeTime}
          initializeCommittee={initializeCommittee}
        />

        <TimerPanel
          timeLeft={timeLeft}
          isRunning={isRunning}
          mode={mode}
          currentSpeaker={currentSpeaker}
          startTimer={startTimer}
          pauseTimer={pauseTimer}
          resetTimer={resetTimer}
          nextSpeaker={nextSpeaker}
        />

        <YieldPanel
          queue={queue}
          currentSpeaker={currentSpeaker}
          isRunning={isRunning}
          mode={mode}
          yieldToChair={yieldToChair}
          yieldToQuestions={yieldToQuestions}
          yieldToDelegate={yieldToDelegate}
        />
      </main>
    </div>
  );
}

export default App;
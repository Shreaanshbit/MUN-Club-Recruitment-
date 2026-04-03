import { useEffect, useRef, useState } from "react";
import "./App.css";
import QueuePanel from "./components/QueuePanel";
import TimerPanel from "./components/TimerPanel";
import YieldPanel from "./components/YieldPanel";

function useScrollReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}
function RevealCol({ children, delay = 0 }) {
  const [ref, visible] = useScrollReveal();
  return (
    <div
      ref={ref}
      className="reveal-col"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function Header({ committeeTimeLeft, totalCommitteeTime }) {
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };
  return (
    <header className="topbar">
      <div className="topbar-brand">
        <div
          className="topbar-emblem"
          style={{
            background: 'linear-gradient(135deg, #e8eefc 60%, #f4f6fa 100%)',
            padding: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src="/logo-mun.png"
            alt="MUN Club Logo"
            style={{ width: 34, height: 34, objectFit: 'contain', filter: 'drop-shadow(0 1px 2px #bfcbe6)' }}
          />
        </div>
        <div>
          <h1>VITB MUN</h1>
          <p>Chair Dashboard</p>
        </div>
      </div>
      <div className="session-pill" style={{fontSize: '1.45rem', fontWeight: 700, padding: '10px 28px'}}>
        <span className="session-dot" />
        {totalCommitteeTime > 0 ? (
          <>
             {formatTime(committeeTimeLeft)}
          </>
        ) : (
          "No Committee Timer"
        )}
      </div>
    </header>
  );
}

function App() {
  const [queue, setQueue] = useState([]);
  const [currentSpeaker, setCurrentSpeaker] = useState(null);
  const [defaultTime, setDefaultTime] = useState(90);
  const [timeLeft, setTimeLeft] = useState(90);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("speech");
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [totalCommitteeTime, setTotalCommitteeTime] = useState("");
  const [committeeTimeLeft, setCommitteeTimeLeft] = useState(0);
 
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  {/* Watermark logo */}
  useEffect(() => {
    let interval;
    if (isRunning && (timeLeft > 0 || committeeTimeLeft > 0)) {
      interval = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        setCommitteeTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    if (timeLeft === 0) setIsRunning(false);
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, committeeTimeLeft]);
  {/* Header */}
  const addCountry = (countryName) => {
    const cleaned = countryName.trim();
    if (!cleaned) return;
  {/* Dashboard grid */}
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

  const pauseTimer = () => setIsRunning(false);

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
    setCommitteeTimeLeft(totalSeconds);
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
      {/* Watermark logo */}
      <div
        className="watermark-wrap"
        aria-hidden="true"
        style={{ "--parallax": `${-scrollY * 0.25}px` }}
      >
        <img
          src="/logo.png"
          alt=""
          className="watermark-logo"
          style={{ transform: `translateY(${-scrollY * 0.25}px)` }}
        />
      </div>

      {/* Header */}
      <div className="header-animate">
        <Header committeeTimeLeft={committeeTimeLeft} totalCommitteeTime={Number(totalCommitteeTime) * 60} />
      </div>

      {/* Dashboard grid */}
      <main className="dashboard">
        <RevealCol delay={0}>
          <QueuePanel
            queue={queue}
            setQueue={setQueue}
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
        </RevealCol>

        <RevealCol delay={120}>
          <TimerPanel
            timeLeft={timeLeft}
            isRunning={isRunning}
            mode={mode}
            currentSpeaker={currentSpeaker}
            startTimer={startTimer}
            pauseTimer={pauseTimer}
            resetTimer={resetTimer}
            nextSpeaker={nextSpeaker}
            defaultTime={defaultTime}
            committeeTimeLeft={committeeTimeLeft}
            totalCommitteeTime={Number(totalCommitteeTime) * 60}
          />
        </RevealCol>

        <RevealCol delay={240}>
          <YieldPanel
            queue={queue}
            currentSpeaker={currentSpeaker}
            isRunning={isRunning}
            mode={mode}
            yieldToChair={yieldToChair}
            yieldToQuestions={yieldToQuestions}
            yieldToDelegate={yieldToDelegate}
          />
        </RevealCol>
      </main>
    </div>
  );
}

export default App;

import { useEffect, useState } from "react";
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
// Sortable item component for dnd-kit
function SortableQueueItem({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 2 : 1,
    opacity: isDragging ? 0.7 : 1,
    cursor: 'grab',
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

function QueuePanel({
  queue,
  setQueue,
  currentSpeaker,
  addCountry,
  removeFromQueue,
  moveToBottom,
  selectedCountries,
  setSelectedCountries,
  totalCommitteeTime,
  setTotalCommitteeTime,
  initializeCommittee,
}) {
  const [minimized, setMinimized] = useState(false);
  const [country, setCountry] = useState("");
  const [allCountries, setAllCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [countriesError, setCountriesError] = useState("");
  const [searchQ, setSearchQ] = useState("");

  // ── Your original fetch logic ──────────────────────────────────────────────
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoadingCountries(true);
        setCountriesError("");

        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,cca2"
        );

        if (!response.ok) throw new Error("Failed to fetch countries");

        const data = await response.json();
        const formatted = data
          .filter((item) => item?.name?.common && item?.cca2)
          .map((item) => ({ name: item.name.common, code: item.cca2 }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setAllCountries(formatted);
      } catch {
        setCountriesError("Could not load countries");
      } finally {
        setLoadingCountries(false);
      }
    };
    fetchCountries();
  }, []);

  // ── Your original handlers ─────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    addCountry(country);
    setCountry("");
  };

  const handleCheckbox = (countryObj) => {
    setSelectedCountries((prev) => {
      const exists = prev.some((item) => item.code === countryObj.code);
      return exists
        ? prev.filter((item) => item.code !== countryObj.code)
        : [...prev, countryObj];
    });
  };

  const filtered = allCountries.filter((c) =>
    c.name.toLowerCase().includes(searchQ.toLowerCase())
  );

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Drag end handler
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = queue.findIndex((item) => item.id === active.id);
      const newIndex = queue.findIndex((item) => item.id === over.id);
      const newQueue = arrayMove(queue, oldIndex, newIndex);
      setQueue(newQueue);
    }
  };


  return (
    <section className="panel queue-panel">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <h2 className="section-title" style={{ marginBottom: 0 }}>General Speakers' List</h2>
        <button
          type="button"
          className="ghost-btn"
          style={{ fontSize: 15, padding: '6px 14px', minWidth: 0, display: 'flex', alignItems: 'center', color: '#7A89B0' }}
          onClick={() => setMinimized((m) => !m)}
          aria-label={minimized ? 'Expand panel' : 'Minimize panel'}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ transform: minimized ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', marginRight: 6 }}
          >
            <path d="M6 9l5 5 5-5" stroke="#7A89B0" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ color: '#7A89B0', fontWeight: 600, fontSize: 14 }}>{minimized ? 'Expand' : 'Minimize'}</span>
        </button>
      </div>

      {!minimized && (
        <>
          {/* ── Committee Setup card ── */}
          <div className="setup-card">
            <div className="subsection-header">
              <h3>⚙ Committee Setup</h3>
              <span className="selected-count">{selectedCountries.length} selected</span>
            </div>

            {/* Search filter */}
            <label className="input-label">Search Countries</label>
            <input
              className="search-input"
              placeholder="Filter countries…"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
            />

            {/* Country list */}
            {loadingCountries ? (
              <p className="empty-text">Loading countries…</p>
            ) : countriesError ? (
              <p className="error-text">{countriesError}</p>
            ) : (
              <div className="country-list">
                {filtered.map((countryObj) => {
                  const checked = selectedCountries.some(
                    (item) => item.code === countryObj.code
                  );
                  return (
                    <label
                      key={countryObj.code}
                      className={`country-row${checked ? " country-row--checked" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleCheckbox(countryObj)}
                      />
                      <img
                        src={`https://flagsapi.com/${countryObj.code}/flat/24.png`}
                        alt={`${countryObj.name} flag`}
                        className="country-flag"
                      />
                      <div className="country-info">
                        <span className="country-name">{countryObj.name}</span>
                        <span className="country-code">{countryObj.code}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}

            {/* Committee time */}
            <div className="time-field-group">
              <label className="input-label">Total Committee Time (minutes)</label>
              <input
                type="number"
                placeholder="Enter total committee time"
                value={totalCommitteeTime}
                onChange={(e) => setTotalCommitteeTime(e.target.value)}
                className="time-input"
              />
            </div>

            <button
              onClick={initializeCommittee}
              className="init-btn primary-btn"
              type="button"
            >
              Initialize Committee
            </button>
          </div>

          {/* ── Manual add ── */}
          <div className="manual-add">
            <form onSubmit={handleSubmit} className="add-form">
              <input
                type="text"
                placeholder="Enter country name manually"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
              <button type="submit" className="secondary-btn">Add</button>
            </form>
          </div>
        </>
      )}

      {/* ── Upcoming Speakers ── */}
      <div className="queue-list-card">
        <div className="subsection-header">
          <h3>Upcoming Speakers</h3>
          <span className="selected-count">{queue.length} in queue</span>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={queue.map((item) => item.id)} strategy={verticalListSortingStrategy}>
            <div className="queue-list">
              {queue.length === 0 ? (
                <p className="empty-text">No delegates in queue</p>
              ) : (
                queue.map((item, index) => (
                  <SortableQueueItem key={item.id} id={item.id}>
                    <div className="queue-item modern">
                      <div className="queue-main">
                        <span className="queue-number">{index + 1}</span>
                        {item.code && (
                          <img
                            src={`https://flagsapi.com/${item.code}/flat/24.png`}
                            alt=""
                            className="queue-flag"
                          />
                        )}
                        <span className="queue-country">{item.country}</span>
                      </div>
                      <div className="queue-actions">
                        <button
                          type="button"
                          onClick={() => moveToBottom(item.id)}
                          className="ghost-btn"
                        >
                          ↓ Bottom
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFromQueue(item.id)}
                          className="danger-btn"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </SortableQueueItem>
                ))
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </section>
  );
}

export default QueuePanel;

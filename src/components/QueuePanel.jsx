import { useEffect, useState } from "react";

function QueuePanel({
  queue,
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
  const [country, setCountry] = useState("");
  const [allCountries, setAllCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [countriesError, setCountriesError] = useState("");

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoadingCountries(true);
        setCountriesError("");

        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,cca2"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch countries");
        }

        const data = await response.json();

        const formatted = data
          .filter((item) => item?.name?.common && item?.cca2)
          .map((item) => ({
            name: item.name.common,
            code: item.cca2,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setAllCountries(formatted);
      } catch (error) {
        setCountriesError("Could not load countries");
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    addCountry(country);
    setCountry("");
  };

  const handleCheckbox = (countryObj) => {
    setSelectedCountries((prev) => {
      const exists = prev.some((item) => item.code === countryObj.code);

      if (exists) {
        return prev.filter((item) => item.code !== countryObj.code);
      }

      return [...prev, countryObj];
    });
  };

  return (
    <section className="panel queue-panel">
      <h2>General Speakers List</h2>

      <div className="setup-section">
        <h3>Committee Setup</h3>

        {loadingCountries ? (
          <p className="empty-text">Loading countries...</p>
        ) : countriesError ? (
          <p className="error-text">{countriesError}</p>
        ) : (
          <div className="country-list">
            {allCountries.map((countryObj) => {
              const checked = selectedCountries.some(
                (item) => item.code === countryObj.code
              );

              return (
                <label key={countryObj.code} className="checkbox-item flag-item">
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
                  <span>{countryObj.name}</span>
                </label>
              );
            })}
          </div>
        )}

        <input
          type="number"
          placeholder="Total committee time (minutes)"
          value={totalCommitteeTime}
          onChange={(e) => setTotalCommitteeTime(e.target.value)}
          className="time-input"
        />

        <button onClick={initializeCommittee} className="init-btn" type="button">
          Initialize Committee
        </button>
      </div>

      <form onSubmit={handleSubmit} className="add-form">
        <input
          type="text"
          placeholder="Enter country name manually"
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
                <button type="button" onClick={() => moveToBottom(item.id)}>
                  Move to Bottom
                </button>
                <button
                  type="button"
                  onClick={() => removeFromQueue(item.id)}
                  className="danger-btn"
                >
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
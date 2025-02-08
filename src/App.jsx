import React, { useState, useEffect, useCallback } from "react";
import { FaSearch } from "react-icons/fa";
import Weather from "./components/Weather";
import SearchCity from "./components/SearchCity";
import Notfound from "./components/Notfound";
import { throttle } from "lodash";

const apikey = import.meta.env.VITE_API_KEY;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [city, setCity] = useState("Nagpur");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emptyError, setEmptyError] = useState(false);

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const fetchWeather = async (city) => {
    setLoading(true);
    setError(null);
    setWeather(null);
    const cachedData = localStorage.getItem(`weather-${city}`);
    const cachedForecast = localStorage.getItem(`forecast-${city}`);
    if (cachedData && cachedForecast) {
      const parsedData = JSON.parse(cachedData);
      const parsedforecast = JSON.parse(cachedForecast);
      if (
        Date.now() - parsedData.timestamp < CACHE_DURATION &&
        Date.now() - parsedforecast.timestamp < CACHE_DURATION
      ) {
        setWeather(parsedData.weatherData);
        setForecast(parsedforecast.forecastData);
        setLoading(false);
        setCity("");
        return;
      }
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apikey}&units=metric`
      );
      const forecast = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apikey}&units=metric`
      );
      if (!response.ok && !forecast.ok)
        throw new Error("API limit reached or invalid city");
      const weatherData = await response.json();
      const forecastData = await forecast.json();
      setWeather(weatherData);
      setForecast(forecastData);
      setCity("");
      localStorage.setItem(
        `weather-${city}`,
        JSON.stringify({ weatherData, timestamp: Date.now() })
      );
      localStorage.setItem(
        `forecast-${city}`,
        JSON.stringify({ forecastData, timestamp: Date.now() })
      );
      setLoading(false);
      return;
    } catch (err) {
      setWeather(null);
      setError(err.message);
      setLoading(false);
    }
  };

  const throttledSearch = useCallback(throttle(fetchWeather, 1000), []);

  const handleSearch = (e) => {
    e.preventDefault();

    if (city.trim() === "") {
      setEmptyError(true);
      return;
    }
    setEmptyError(false);
    throttledSearch(city);
  };
  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (city.trim() === "") {
        setEmptyError(true);
        return;
      }
      setEmptyError(false);
      throttledSearch(city);
    }
    return;
  };

  return (
    <div className="weather-container">
      <div className="main-container">
        <header className="input-container">
          <input
            type="text"
            className="city-input"
            value={city}
            onKeyDown={handleEnter}
            onChange={(e) => {
              e.preventDefault();
              setCity(e.target.value);
            }}
            onFocus={(e) => setEmptyError(false)}
            placeholder="Search City..."
          />
          {emptyError && (
            <p className="empty-error">Please enter a city name.</p>
          )}
          <button className="search-btn" onClick={handleSearch}>
            <FaSearch className="react-icons" />
          </button>
        </header>
        {loading && <SearchCity />}
        {weather && <Weather weatherData={weather} forecastData={forecast} />}
        {error && <Notfound />}
      </div>
    </div>
  );
}

export default App;

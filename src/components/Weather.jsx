import React, { memo } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { MdOutlineWaterDrop } from "react-icons/md";
import { MdAir } from "react-icons/md";

const Weather = (props) => {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
  const timeTaken = "12:00:00";
  const todayDate = new Date().toISOString().split("T")[0];

  const weather = props.weatherData;
  const forecast = props.forecastData.list
    .filter(
      (day) => day.dt_txt.includes(timeTaken) && !day.dt_txt.includes(todayDate)
    )
    .slice(0, 6);

  function getWeatherIcon(id) {
    switch (true) {
      case id <= 232:
        return "thunderstorm.png";
      case id <= 321:
        return "drizzle.png";
      case id <= 531:
        return "rain.png";
      case id <= 622:
        return "snow.png";
      case id <= 781:
        return "mist.png";
      case id <= 800:
        return "clear.png";
      default:
        return "clouds.png";
    }
  }

  return (
    <section className="weather-info">
      <div className="location-date-container">
        <div className="location">
          <FaLocationDot className="react-icons" />
          <h4 className="country-txt">{weather.name}</h4>
        </div>
        <h5 className="current-date-txt regular-txt">{today}</h5>
      </div>
      <div className="weather-summary-container">
        <img
          src={`img/${getWeatherIcon(weather.weather[0].id)}`}
          alt=""
          className="weather-related-img"
        />
        <div className="weather-summary-info">
          <h1 className="temp-txt">{Math.round(weather.main.temp)} °C</h1>
          <h3 className="condition-txt regular-txt">
            {weather.weather[0].main}
          </h3>
        </div>
      </div>
      <div className="weather-conditions-container">
        <div className="condition-item">
          <MdOutlineWaterDrop className="react-icons" />
          <div className="condition-info">
            <h5 className="regular-txt">Humidity</h5>
            <h5 className="humidity-value-txt">{weather.main.humidity} %</h5>
          </div>
        </div>
        <div className="condition-item">
          <MdAir className="react-icons" />
          <div className="condition-info">
            <h5 className="regular-txt">Wind speed</h5>
            <h5 className="wind-value-txt">{weather.wind.speed} M/s</h5>
          </div>
        </div>
      </div>

      <div className="forecast-items-container">
        {forecast.map((day, index) => (
          <div className="forecast-item" key={index}>
            <h5 className="forecast-item-date regular-txt">
              {new Date(day.dt_txt).toLocaleDateString(undefined, {
                day: "2-digit",
                month: "short",
              })}
            </h5>
            <img
              src={`img/${getWeatherIcon(day.weather[0].id)}`}
              alt=""
              className="forecast-item-img"
            />
            <h5 className="forecast-item-temp">
              {Math.round(day.main.temp)} °C
            </h5>
          </div>
        ))}
      </div>
    </section>
  );
};

export default memo(Weather);

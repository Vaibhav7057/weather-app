import React from "react";

const Notfound = () => {
  return (
    <section className="not-found section-message">
      <img src="img/not-found.jpg" alt="" className="not-found-img" />
      <div>
        <h1>page not found</h1>
        <h4 className="regular-txt">
          city not found or the weather data is not available at the moment
        </h4>
      </div>
    </section>
  );
};

export default Notfound;

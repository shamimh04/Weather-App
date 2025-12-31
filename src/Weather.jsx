// import React, { useState } from "react";
// import "./Weather.css";

// function Weather() {
//   const [city, setCity] = useState("");
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const fetchWeather = async () => {
//     if (!city) return;
//     setLoading(true);
//     setError("");
//     try {
//       const res = await fetch(
//         `https://api.openweathermap.org/data/2.5/weather?q=${city.trim()}&appid=8659c0f72ff572b6a2316b136ce4accd&units=metric`
//       );
//       const result = await res.json();

//       if (result.cod === 200) {
//         setData(result);
//       } else {
//         setError(result.message || "City not found");
//         setData(null);
//       }
//     } catch (err) {
//       setError("Error fetching data");
//       setData(null);
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="container mt-5">
//       <div className="row justify-content-center">
//         <div className="col-md-6">
//           <div className="card p-4 shadow-lg">
//             <h3 className="card-title text-center mb-3">Weather App</h3>

//             <div className="input-group mb-3">
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Enter city"
//                 value={city}
//                 onChange={(e) => setCity(e.target.value)}
//               />
//               <button className="btn btn-primary" onClick={fetchWeather}>
//                 Search
//               </button>
//             </div>

//             {loading && <p className="text-center">Loading...</p>}
//             {error && <p className="text-danger text-center">{error}</p>}

//             {data && (
//               <div className="weather-result text-center mt-4">
//                 <h4>
//                   {data.name}, {data.sys.country}
//                 </h4>
//                 <p className="lead">{data.weather[0].description}</p>
//                 <h2>{data.main.temp}°C</h2>
//                 <p>Humidity: {data.main.humidity}%</p>
//                 <p>Wind: {data.wind.speed} m/s</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Weather;

import React, { useState, useEffect } from "react";
import "./Weather.css";

function Weather() {
  const [city, setCity] = useState("");

  const [cities, setCities] = useState(() => {
    const saved = localStorage.getItem("cities");
    return saved ? JSON.parse(saved) : ["Dhaka", "Rajshahi", "Pabna"];
  });

  const [weatherData, setWeatherData] = useState({});

  const API_KEY = "8659c0f72ff572b6a2316b136ce4accd";

  const fetchWeather = async (cityName) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();

      if (res.ok) {
        setWeatherData((prev) => ({
          ...prev,
          [cityName]: data,
        }));
      }
    } catch (error) {
      console.log("Error fetching weather");
    }
  };

  useEffect(() => {
    cities.forEach((c) => fetchWeather(c));
    localStorage.setItem("cities", JSON.stringify(cities));
  }, [cities]);

  // 6️⃣ Add city
  const handleSearch = () => {
    const formattedCity = city.trim();
    if (!formattedCity) return;

    const exists = cities.some(
      (c) => c.toLowerCase() === formattedCity.toLowerCase()
    );

    if (!exists) {
      setCities([...cities, formattedCity]);
    }

    setCity("");
  };

  const handleDelete = (cityName) => {
    setCities(cities.filter((c) => c !== cityName));

    setWeatherData((prev) => {
      const updated = { ...prev };
      delete updated[cityName];
      return updated;
    });
  };

  return (
    <div className="weather-bg">
      <div className="container ">
        <h3 className="text-center mt-5 mb-3">🌤️ Weather App</h3>
        <div className="col-md-6 mx-auto">
          <div className="input-group mb-4">
            <input
              type="text"
              className="form-control"
              placeholder="Enter city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleSearch}>
              Search City
            </button>
          </div>
        </div>

        <div className="row">
          {cities.map((c) => (
            <div className="col-md-4 mb-3" key={c}>
              <div className="card p-3 text-center shadow">
                <button
                  className="btn w-25 mb-2"
                  onClick={() => handleDelete(c)}
                >
                  ❌
                </button>

                <h5>{c}</h5>

                {weatherData[c] ? (
                  <>
                    <img
                      src={`https://openweathermap.org/img/wn/${weatherData[c].weather[0].icon}.png`}
                      alt="icon"
                      className="weather-icon"
                    />

                    <h3>{Math.round(weatherData[c].main.temp)}°C</h3>

                    <p className="text-capitalize">
                      {weatherData[c].weather[0].description}
                    </p>

                    <p>Humidity: {weatherData[c].main.humidity}%</p>
                    <p>Wind: {weatherData[c].wind.speed} m/s</p>
                  </>
                ) : (
                  <p>Loading....</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Weather;

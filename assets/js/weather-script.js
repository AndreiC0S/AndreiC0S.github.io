window.onload = function () {
  let data = localStorage.getItem('colectData');
  
};

function checkConsentData(data) {
  console.log(data);
  if (data === null) { // Verifică dacă nu există o valoare în localStorage
      getConsent();
  } else if (data === 'false' ) {
      document.getElementById("location").innerHTML = "Location access denied.";
      document.getElementById("consent-button").style.display = "inline-block"; // Afișează butonul
  } else if (data === 'true') {
      getLocationAndWeather();
      document.getElementById("consent-button").style.display = "none"; // Afișează butonul
  }
}

function getConsent() {
  let answer = window.confirm(
      "Do we have your consent to collect data about your location to display information about current weather?"
  );
  if (answer) {
      localStorage.setItem("colectData", 'true');
      getLocationAndWeather();
      document.getElementById("consent-button").style.display = "none"; // Afișează butonul
  } else {
      localStorage.setItem("colectData", 'false');
      document.getElementById("location").innerHTML = "Location access denied.";
      document.getElementById("consent-button").style.display = "inline-block"; // Afișează butonul
  }
}

function giveConsent() {
  localStorage.setItem("colectData", 'true');
  document.getElementById("consent-button").style.display = "none"; // Ascunde butonul după consimțământ
  getLocationAndWeather();
}

function getLocationAndWeather() {
  var projectId = "dOIgHW9WHHmjLgKimrv8"; // Project ID pentru VisitorAPI

  VisitorAPI(
      projectId,
      function(data) {
          if (data.city && data.countryName) {
              var city = data.city.charAt(0).toUpperCase() + data.city.slice(1);
              var region = data.region.toUpperCase();
              var location = `${city},  ${region},  ${data.countryName}`;
              document.getElementById("location").innerHTML = location;

              // Extrage latitudinea și longitudinea din cityLatLong
              var latLong = data.cityLatLong.split(",");
              var lat = parseFloat(latLong[0]);
              var lon = parseFloat(latLong[1]);

              getWeather(lat, lon);
          } else {
              document.getElementById("location").innerHTML = "Unable to retrieve location.";
          }
      },
      function(errorCode, errorMessage) {
          console.error("Error fetching the location:", errorCode, errorMessage);
          document.getElementById("location").innerHTML = "Error retrieving location.";
      }
  );
}

function getWeather(lat, lon) {
  var openWeatherMapApiKey = "db16ee1c62db1d0d199d69b1393f0b71"; // Înlocuiește cu cheia ta API de la OpenWeatherMap
  var openWeatherMapUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${openWeatherMapApiKey}`;

  fetch(openWeatherMapUrl)
      .then((response) => response.json())
      .then((data) => {
          if (data.main && data.main.temp && data.weather && data.weather[0]) {
              var temperature = data.main.temp;
              var weatherDescription = data.weather[0].description;
              var iconCode = data.weather[0].icon;
              var iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

              document.getElementById("weather").innerHTML = `Current temperature: ${temperature}°C, ${weatherDescription}`;
              var weatherIcon = document.getElementById("weather-icon");
              weatherIcon.src = iconUrl;
              weatherIcon.style.display = "block";
          } else {
              document.getElementById("weather").innerHTML = "Unable to retrieve weather data.";
              document.getElementById("weather-icon").style.display = "none";
          }
      })
      .catch((error) => {
          console.error("Error fetching the weather:", error);
          document.getElementById("weather").innerHTML = "Error retrieving weather data.";
          document.getElementById("weather-icon").style.display = "none";
      });
}

// Codul VisitorAPI
var VisitorAPI = function (t, e, a) {
  var s = new XMLHttpRequest();
  s.onreadystatechange = function () {
      var t;
      s.readyState === XMLHttpRequest.DONE && (200 === (t = JSON.parse(s.responseText)).status ? e(t.data) : a(t.status, t.result))
  };
  s.open("GET", "https://api.visitorapi.com/api/?pid=" + t);
  s.send(null);
};
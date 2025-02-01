import "./style.css";

const API_KEY = "19b6804e4ba91eaa24709d0f978f7443";
let villeChoisie = "Tunis";

document.querySelector("#changer").addEventListener("click", async () => {
  const nouvelleVille = prompt("Quelle ville souhaitez-vous voir ?");
  if (nouvelleVille) {
    villeChoisie = nouvelleVille;
    await recevoirTemperature(villeChoisie);
  }
});

async function obtenirPosition() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          resolve({ latitude, longitude });
        },
        (error) => reject(error)
      );
    } else {
      reject("La géolocalisation n'est pas disponible");
    }
  });
}

async function recevoirTemperature(ville) {
  let url;
  console.log("Demande de température pour :", ville); // Log pour débogage
  if (ville === "localisation") {
    try {
      const position = await obtenirPosition();
      console.log("Position obtenue :", position); // Log pour débogage
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${position.latitude}&lon=${position.longitude}&appid=${API_KEY}&units=metric`;
    } catch (error) {
      alert("Erreur lors de la récupération de la position : " + error.message);
      return;
    }
  } else {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${ville}&appid=${API_KEY}&units=metric`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Problème de récupération des données");
    }
    const data = await response.json();
    console.log("Données météo récupérées :", data); // Log pour débogage

    const temperature = data.main.temp;
    const villeNom = data.name;
    const weatherCondition = data.weather[0].main.toLowerCase();

    document.querySelector("#temperature_label").textContent = temperature;
    document.querySelector("#ville").textContent = villeNom;

    changerArrierePlan(temperature);
    ajouterEffetMeteo(weatherCondition);
  } catch (error) {
    alert("Erreur : " + error.message);
  }
}

function changerArrierePlan(temperature) {
  const body = document.querySelector("body");
  body.classList.add("transition-all", "duration-500", "ease-in-out");

  body.classList.remove(
    "from-yellow-400",
    "via-orange-500",
    "to-red-500",
    "from-blue-300",
    "via-blue-400",
    "to-blue-600",
    "from-blue-500",
    "via-gray-600",
    "to-gray-800"
  );

  if (temperature > 25) {
    body.classList.add(
      "bg-gradient-to-r",
      "from-yellow-400",
      "via-orange-500",
      "to-red-500"
    );
  } else if (temperature >= 15 && temperature <= 25) {
    body.classList.add(
      "bg-gradient-to-r",
      "from-blue-300",
      "via-blue-400",
      "to-blue-600"
    );
  } else {
    body.classList.add(
      "bg-gradient-to-r",
      "from-blue-500",
      "via-gray-600",
      "to-gray-800"
    );
  }
}

function ajouterEffetMeteo(condition) {
  const body = document.querySelector("body");
  body.classList.remove("snow-effect", "rain-effect");

  if (condition === "rain") {
    body.classList.add("rain-effect");
  } else if (condition === "snow") {
    body.classList.add("snow-effect");
  }
}

recevoirTemperature("localisation");

const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const statusMessage = document.getElementById("status-message");
const weatherSection = document.getElementById("weather-section");
const heroBanner = document.getElementById("hero-banner");
const heroIcon = document.getElementById("hero-icon");
const heroSunset = document.getElementById("hero-sunset");
const cityNameText = document.getElementById("city-name");
const currentTemperature = document.getElementById("current-temperature");
const feelsLikeText = document.getElementById("feels-like");
const humidityText = document.getElementById("humidity");
const windSpeedText = document.getElementById("wind-speed");
const uvIndexText = document.getElementById("uv-index");
const sunriseText = document.getElementById("sunrise-time");
const sunsetText = document.getElementById("sunset-time");
const forecastList = document.getElementById("forecast-list");
const chartCanvas = document.getElementById("hourly-chart");
const chartTabs = document.querySelectorAll("[data-chart-metric]");

const WINDY_SPEED = 30;
const COLD_TEMPERATURE = 5;
const HOUR_STEPS = [0, 3, 6, 9, 12, 15, 18, 21];
const bannerImages = {
    sunny: "images/sunny.png",
    cloudy: "images/cloudy.png",
    rainy: "images/rainy.png",
    windy: "images/windy.png",
    snow: "images/snow.png",
    night: "images/night.png",
};

const chartMetrics = {
    temperature: { unit: "°C", min: null },
    precipitation: { unit: "%", min: 0 },
    wind: { unit: " km/h", min: 0 },
};

let selectedMetric = "temperature";
let hourlyData = null;
let hourlyChart = null;

function getWeatherInfo(weatherCode, isDaytime) {
    if (weatherCode === 0) return { iconClass: isDaytime ? "fa-sun" : "fa-moon" };
    if (weatherCode <= 2) return { iconClass: isDaytime ? "fa-cloud-sun" : "fa-cloud-moon" };
    if (weatherCode === 3) return { iconClass: "fa-cloud" };
    if (weatherCode <= 48) return { iconClass: "fa-smog" };
    if (weatherCode <= 57) return { iconClass: "fa-cloud-rain" };
    if (weatherCode <= 67) return { iconClass: "fa-cloud-showers-heavy" };
    if (weatherCode <= 77) return { iconClass: "fa-snowflake" };
    if (weatherCode <= 82) return { iconClass: "fa-cloud-showers-heavy" };
    if (weatherCode <= 86) return { iconClass: "fa-snowflake" };
    return { iconClass: "fa-cloud-bolt" };
}

function getBannerName(weatherCode, windSpeed, temperature, isDaytime) {
    const isSnowing = (weatherCode >= 71 && weatherCode <= 77) || weatherCode === 85 || weatherCode === 86;
    const isRaining = (weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82) || weatherCode >= 95;

    if (isSnowing || temperature <= COLD_TEMPERATURE) return "snow";
    if (isRaining) return "rainy";
    if (windSpeed >= WINDY_SPEED) return "windy";
    if (!isDaytime) return "night";
    if (weatherCode >= 3) return "cloudy";
    return "sunny";
}

function formatHour(hour) {
    return `${hour % 12 || 12} ${hour < 12 ? "am" : "pm"}`;
}

function formatTime(dateText) {
    return new Date(dateText).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }).toLowerCase();
}

function showStatus(message, isError = false) {
    statusMessage.textContent = message;
    statusMessage.className = isError ? "my-2 min-h-5 font-semibold text-clay" : "my-2 min-h-5 text-sage";
}

async function fetchCityLocation(cityName) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=jsonv2&limit=1&addressdetails=1&accept-language=en`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("The location service is not responding. Try again later.");

    const matches = await response.json();
    if (matches.length === 0) {
        throw new Error(`No place found for "${cityName}". Check the spelling and try again.`);
    }

    const match = matches[0];
    return {
        name: match.name || match.display_name.split(",")[0],
        country: match.address ? match.address.country : "",
        latitude: match.lat,
        longitude: match.lon,
    };
}

async function fetchWeatherData(latitude, longitude) {
    const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code,is_day` +
        `&hourly=temperature_2m,precipitation_probability,wind_speed_10m` +
        `&daily=weather_code,temperature_2m_max,sunrise,sunset,uv_index_max` +
        `&timezone=auto&forecast_days=7`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("The weather service is not responding. Try again later.");
    return response.json();
}

function buildHourlyData(hourly) {
    return {
        labels: HOUR_STEPS.map(formatHour),
        temperature: HOUR_STEPS.map((hour) => Math.round(hourly.temperature_2m[hour])),
        precipitation: HOUR_STEPS.map((hour) => hourly.precipitation_probability[hour]),
        wind: HOUR_STEPS.map((hour) => Math.round(hourly.wind_speed_10m[hour])),
    };
}

function highlightSelectedTab() {
    chartTabs.forEach((tab) => {
        const isSelected = tab.dataset.chartMetric === selectedMetric;
        tab.classList.toggle("border-leaf", isSelected);
        tab.classList.toggle("text-forest", isSelected);
        tab.classList.toggle("border-transparent", !isSelected);
        tab.classList.toggle("text-sage", !isSelected);
    });
}

function drawChart() {
    const metric = chartMetrics[selectedMetric];

    if (!hourlyChart) {
        hourlyChart = new Chart(chartCanvas, {
            type: "line",
            data: {
                labels: hourlyData.labels,
                datasets: [{
                    data: hourlyData[selectedMetric],
                    borderColor: "#3f6b5c",
                    backgroundColor: "rgba(63, 107, 92, 0.12)",
                    pointBackgroundColor: "#3f6b5c",
                    pointRadius: 3,
                    tension: 0.4,
                    fill: true,
                }],
            },
            options: {
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (point) => `${point.parsed.y}${chartMetrics[selectedMetric].unit}`,
                        },
                    },
                },
                scales: {
                    x: { grid: { display: false }, ticks: { color: "#5f7a70" } },
                    y: { display: false, grace: "20%" },
                },
            },
        });
    }

    hourlyChart.data.labels = hourlyData.labels;
    hourlyChart.data.datasets[0].data = hourlyData[selectedMetric];
    hourlyChart.options.scales.y.min = metric.min ?? undefined;
    hourlyChart.update();
}

function showForecast(dailyData) {
    forecastList.innerHTML = "";

    dailyData.time.forEach((dateText, dayIndex) => {
        const dayName = dayIndex === 0 ? "Today" : new Date(dateText).toLocaleDateString("en-US", { weekday: "short" });
        const { iconClass } = getWeatherInfo(dailyData.weather_code[dayIndex], true);
        const highTemperature = Math.round(dailyData.temperature_2m_max[dayIndex]);

        forecastList.insertAdjacentHTML(
            "beforeend",
            `<li class="flex flex-col items-center gap-1 border-l border-sand py-2 text-sm first:border-l-0">
        <span class="text-sage">${dayName}</span>
        <i class="fa-solid ${iconClass} text-base"></i>
        <span class="font-semibold">${highTemperature}°</span>
      </li>`
        );
    });
}

function showWeather(location, weatherData) {
    const current = weatherData.current;
    const daily = weatherData.daily;
    const isDaytime = current.is_day === 1;
    const bannerName = getBannerName(current.weather_code, current.wind_speed_10m, current.temperature_2m, isDaytime);


    heroBanner.style.backgroundImage = `url("${bannerImages[bannerName]}")`;
    heroIcon.className = `fa-solid ${getWeatherInfo(current.weather_code, isDaytime).iconClass} absolute left-5 top-5 text-2xl sm:left-6 sm:top-6`;
    currentTemperature.textContent = `${Math.round(current.temperature_2m)}°`;
    cityNameText.textContent = location.country && location.country !== location.name ? `${location.name}, ${location.country}` : location.name;
    heroSunset.textContent = formatTime(daily.sunset[0]);

    feelsLikeText.textContent = `${Math.round(current.apparent_temperature)}°C`;
    humidityText.textContent = `${current.relative_humidity_2m}%`;
    windSpeedText.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
    uvIndexText.textContent = `${Math.round(daily.uv_index_max[0])} of 11`;
    sunriseText.textContent = formatTime(daily.sunrise[0]);
    sunsetText.textContent = formatTime(daily.sunset[0]);

    hourlyData = buildHourlyData(weatherData.hourly);
    weatherSection.classList.remove("hidden");
    drawChart();
    showForecast(daily);
}

async function searchCity(cityName) {
    weatherSection.classList.add("hidden");
    showStatus("Loading weather...");

    try {
        const location = await fetchCityLocation(cityName);
        const weatherData = await fetchWeatherData(location.latitude, location.longitude);
        showWeather(location, weatherData);
        showStatus("");
        localStorage.setItem("lastSearchedCity", cityName);
    } catch (error) {
        const isOffline = error instanceof TypeError;
        showStatus(isOffline ? "No internet connection. Check your network and try again." : error.message, true);
    }
}

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const cityName = cityInput.value.trim();

    if (cityName.length < 2) {
        showStatus("Enter a city name with at least 2 letters.", true);
        return;
    }
    searchCity(cityName);
});

chartTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        selectedMetric = tab.dataset.chartMetric;
        highlightSelectedTab();
        drawChart();
    });
});

const lastSearchedCity = localStorage.getItem("lastSearchedCity") || "Karachi";
cityInput.value = lastSearchedCity;
searchCity(lastSearchedCity);
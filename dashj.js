const apiKey = '50af2a53f52c1092d1e2621c71e45906';
let weatherChart;
let map;
let marker;

document.getElementById('get-weather-btn').addEventListener('click', getWeather);
document.getElementById('refresh-btn').addEventListener('click', refreshPage);
document.getElementById('warning-btn').addEventListener('click', toggleWarnings);
document.getElementById('city').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        getWeather();
    }
});

function initializeMap(lat, lon) {
    if (map) {
        map.setView([lat, lon], 13);
    } else {
        map = L.map('map').setView([lat, lon], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    }

    if (marker) {
        marker.setLatLng([lat, lon]);
    } else {
        marker = L.marker([lat, lon]).addTo(map);
    }
}

function getWeather() {
    const city = document.getElementById('city').value;
    if (city) {
        const geoApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        fetch(geoApiUrl)
            .then(response => response.json())
            .then(data => {
                const lat = data.coord.lat;
                const lon = data.coord.lon;
                
                document.getElementById('location').innerText = `Location: ${data.name}`;
                document.getElementById('temperature').innerText = `Temperature: ${data.main.temp}°C`;
                document.getElementById('humidity').innerText = `Humidity: ${data.main.humidity}%`;
                document.getElementById('wind-speed').innerText = `Wind Speed: ${data.wind.speed} m/s`;

                const tideHeight = Math.random() * 3; // Random value for example
                document.getElementById('tide-height').innerText = `Tide Height: ${tideHeight.toFixed(2)} meters`;

                updateChart(data.main.temp, data.main.humidity, data.wind.speed, tideHeight);
                initializeMap(lat, lon);
                checkForWarnings(lat, lon);
                predictCoastalErosion(tideHeight, data.weather[0].description);
            })
            .catch(error => console.error('Error fetching weather data:', error));
    } else {
        alert('Please enter a city name.');
    }
}

function refreshPage() {
    document.getElementById('city').value = '';
    document.getElementById('location').innerText = '';
    document.getElementById('temperature').innerText = '';
    document.getElementById('humidity').innerText = '';
    document.getElementById('wind-speed').innerText = '';
    document.getElementById('tide-height').innerText = '';
    document.getElementById('warnings').innerText = 'No warnings currently.';
    document.getElementById('erosion-warning').innerText = 'No prediction available.';
    if (weatherChart) {
        weatherChart.destroy();
    }
    if (map) {
        map.remove(); // Remove map to reset on next initialization
        map = null;
    }
}

function updateChart(temperature, humidity, windSpeed, tideHeight) {
    const ctx = document.getElementById('weather-chart').getContext('2d');
    if (weatherChart) {
        weatherChart.destroy();
    }
    weatherChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Temperature (°C)', 'Humidity (%)', 'Wind Speed (m/s)', 'Tide Height (m)'],
            datasets: [{
                label: 'Weather Data',
                data: [temperature, humidity, windSpeed, tideHeight],
                backgroundColor: ['#009688', '#26c6da', '#ffca28', '#ff5722'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function checkForWarnings(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const warnings = [];
            if (data.weather[0].main === 'Rain' && data.weather[0].description.includes('heavy')) {
                warnings.push('Heavy rainfall expected.');
            }
            if (data.wind.speed > 20) {
                warnings.push('Strong winds detected. Potential risk of coastal erosion.');
            }
            if (warnings.length > 0) {
                document.getElementById('warnings').innerText = warnings.join(' ');
            } else {
                document.getElementById('warnings').innerText = 'No warnings currently.';
            }
        })
        .catch(error => console.error('Error fetching weather warnings:', error));
}

function predictCoastalErosion(tideHeight, weatherDescription) {
    let erosionRisk = 'Low risk of coastal erosion.';

    // Simple model for prediction
    if (tideHeight > 2.5) {
        erosionRisk = 'High risk of coastal erosion due to high tide.';
    }
    if (weatherDescription.includes('storm') || weatherDescription.includes('hurricane')) {
        erosionRisk = 'High risk of coastal erosion due to stormy weather.';
    }

    document.getElementById('erosion-warning').innerText = erosionRisk;
}

function toggleWarnings() {
    const warningSection = document.getElementById('warning-section');
    if (warningSection.style.display === 'none' || warningSection.style.display === '') {
        warningSection.style.display = 'block';
    } else {
        warningSection.style.display = 'none';
    }
}
// Update the weather data every 5 minutes
setInterval(() => {
    if (document.getElementById('city').value) {
        getWeather();
    }
}, 300000); // 300000 milliseconds = 5 minutes
function initializeMap(lat, lon) {
    if (map) {
        map.setView([lat, lon], 13);
    } else {
        map = L.map('map').setView([lat, lon], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    }

    if (marker) {
        marker.setLatLng([lat, lon]);
    } else {
        marker = L.marker([lat, lon]).addTo(map);
    }

    // Add different layers for weather and other data
    L.layerGroup([
        L.circle([lat, lon], {
            color: 'blue',
            fillColor: '#30f',
            fillOpacity: 0.1,
            radius: 5000
        }).addTo(map)
    ]).addTo(map);
}
function updateChart(temperature, humidity, windSpeed, tideHeight) {
    const ctx = document.getElementById('weather-chart').getContext('2d');
    if (weatherChart) {
        weatherChart.destroy();
    }
    weatherChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Temperature (°C)', 'Humidity (%)', 'Wind Speed (m/s)', 'Tide Height (m)'],
            datasets: [{
                label: 'Weather Data',
                data: [temperature, humidity, windSpeed, tideHeight],
                backgroundColor: ['#009688', '#26c6da', '#ffca28', '#ff5722'],
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.label + ': ' + tooltipItem.raw.toFixed(2);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value + ' units';
                        }
                    }
                }
            }
        }
    });
}
function checkForWarnings(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const warnings = [];
            if (data.weather[0].main === 'Rain' && data.weather[0].description.includes('heavy')) {
                warnings.push('Heavy rainfall expected. Potential flooding.');
            }
            if (data.wind.speed > 20) {
                warnings.push('Strong winds detected. Potential risk of coastal erosion.');
            }
            if (data.main.temp < 0) {
                warnings.push('Freezing temperatures expected.');
            }
            if (warnings.length > 0) {
                document.getElementById('warnings').innerText = warnings.join(' ');
            } else {
                document.getElementById('warnings').innerText = 'No warnings currently.';
            }
        })
        .catch(error => console.error('Error fetching weather warnings:', error));
}
function showNotification(message) {
    if (Notification.permission === 'granted') {
        new Notification('Weather Dashboard Alert', {
            body: message,
            icon: 'https://yourdomain.com/icon.png'
        });
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                showNotification(message);
            }
        });
    }
}

// Example usage
function checkForWarnings(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const warnings = [];
            if (data.weather[0].main === 'Rain' && data.weather[0].description.includes('heavy')) {
                warnings.push('Heavy rainfall expected. Potential flooding.');
                showNotification('Heavy rainfall expected. Potential flooding.');
            }
            if (data.wind.speed > 20) {
                warnings.push('Strong winds detected. Potential risk of coastal erosion.');
                showNotification('Strong winds detected. Potential risk of coastal erosion.');
            }
            if (data.main.temp < 0) {
                warnings.push('Freezing temperatures expected.');
                showNotification('Freezing temperatures expected.');
            }
            if (warnings.length > 0) {
                document.getElementById('warnings').innerText = warnings.join(' ');
            } else {
                document.getElementById('warnings').innerText = 'No warnings currently.';
            }
        })
        .catch(error => console.error('Error fetching weather warnings:', error));
}

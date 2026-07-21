# 🌦️ Python Weather App

A simple command-line weather application that fetches real-time weather information using the OpenWeatherMap API.

## Features

- 🌍 Search weather by city
- 🌡️ Temperature in Celsius
- 💧 Humidity
- 🌬️ Wind speed
- 📈 Atmospheric pressure
- ☁️ Weather condition
- 🤒 Feels-like temperature
- 🌐 Country information

---

## Installation

Clone the repository

```bash
git clone https://github.com/yourusername/python-weather-app.git
cd python-weather-app
```

Install dependencies

```bash
pip install -r requirements.txt
```

---

## Get an API Key

1. Create a free account at OpenWeatherMap.
2. Generate an API key.
3. Replace:

```python
API_KEY = "YOUR_API_KEY"
```

with your own key.

---

## Run

```bash
python weather.py
```

Example:

```
Enter city name: London

====== Weather Report ======
City        : London
Country     : GB
Temperature : 18°C
Feels Like  : 17°C
Humidity    : 71%
Pressure    : 1016 hPa
Weather     : Clouds
Description : scattered clouds
Wind Speed  : 5.4 m/s
============================
```

---

## Technologies Used

- Python 3
- Requests
- OpenWeatherMap API

---

## Future Improvements

- 5-day weather forecast
- Weather icons
- Colored terminal output
- Save search history
- GUI with Tkinter or PyQt
- Voice-enabled weather search
- Automatic location detection

## License

MIT License
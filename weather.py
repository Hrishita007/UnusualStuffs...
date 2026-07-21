import requests

API_KEY = "YOUR_API_KEY"  # Replace with your API key

city = input("Enter city name: ")

url = (
    f"https://api.openweathermap.org/data/2.5/weather?"
    f"q={city}&appid={API_KEY}&units=metric"
)

try:
    response = requests.get(url)
    data = response.json()

    if data["cod"] != 200:
        print("City not found!")
    else:
        print("\n====== Weather Report ======")
        print(f"City        : {data['name']}")
        print(f"Country     : {data['sys']['country']}")
        print(f"Temperature : {data['main']['temp']}°C")
        print(f"Feels Like  : {data['main']['feels_like']}°C")
        print(f"Humidity    : {data['main']['humidity']}%")
        print(f"Pressure    : {data['main']['pressure']} hPa")
        print(f"Weather     : {data['weather'][0]['main']}")
        print(f"Description : {data['weather'][0]['description']}")
        print(f"Wind Speed  : {data['wind']['speed']} m/s")
        print("============================")

except Exception as e:
    print("Error:", e)
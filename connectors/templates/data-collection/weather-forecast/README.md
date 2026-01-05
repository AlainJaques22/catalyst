# Catalyst Weather Forecast Connector

A specialized connector for fetching weather data using the Open-Meteo API. This connector demonstrates a real-world use case with tangible, easy-to-understand responses.

## Overview

This connector provides current weather information for any location on Earth using latitude and longitude coordinates. It's built on top of the Catalyst HTTP Request connector and uses the free Open-Meteo API (no API key required).

## Features

- **No API Key Required**: Uses the free Open-Meteo API
- **Current Weather Data**: Temperature, humidity, wind speed, and weather conditions
- **Flexible Units**: Supports both Fahrenheit and Celsius
- **Dynamic Location**: Reference process variables for user-specific locations
- **Simple Configuration**: Just provide latitude and longitude coordinates

## What You Get

The connector returns real, tangible weather data:
- **Temperature**: Current temperature in °F or °C
- **Humidity**: Relative humidity percentage
- **Wind Speed**: Current wind speed
- **Weather Code**: Numerical code indicating weather conditions (clear, cloudy, rainy, etc.)

## Installation

### 1. Import n8n Workflow

The weather forecast connector reuses the standard HTTP Request workflow with a unique webhook path.

1. Import `weather-forecast.n8n.json` into n8n (or use the standard HTTP Request workflow and change the webhook path to `/catalyst-http-weather-request`)
2. The workflow should be available at: `http://catalyst-n8n:5678/webhook/catalyst-http-weather-request`
3. Ensure the workflow is **activated**

### 2. Deploy Element Template

1. Copy `weather-forecast.element.json` to your Camunda Modeler element templates directory:
   - Windows: `%APPDATA%\\camunda-modeler\\resources\\element-templates`
   - macOS: `~/Library/Application Support/camunda-modeler/resources/element-templates`
   - Linux: `~/.config/camunda-modeler/resources/element-templates`
2. Restart Camunda Modeler
3. The template will appear as **Catalyst - Weather Forecast** in the template catalog

## Usage

### Basic Example: Get Weather for New York City

1. Add a **Service Task** to your BPMN process
2. Click the **wrench icon** → **Catalyst - Weather Forecast**
3. Configure the location:
   - **Latitude**: 40.7128 (New York City)
   - **Longitude**: -74.0060 (New York City)
   - **Temperature Unit**: Fahrenheit (or Celsius)

### Response Data

After the service task executes, you'll have access to:

```javascript
success = true
statusCode = 200
weatherData = {
  "latitude": 40.71,
  "longitude": -74.01,
  "current": {
    "time": "2025-12-28T18:00",
    "temperature_2m": 45.3,
    "relative_humidity_2m": 68,
    "wind_speed_10m": 12.4,
    "weather_code": 3
  },
  "current_units": {
    "time": "iso8601",
    "temperature_2m": "°F",
    "relative_humidity_2m": "%",
    "wind_speed_10m": "mph",
    "weather_code": "wmo code"
  }
}
```

### Example: Display Weather in Script Task

```javascript
var data = execution.getVariable("weatherData");

print("Weather Report");
print("================");
print("Temperature: " + data.current.temperature_2m + data.current_units.temperature_2m);
print("Humidity: " + data.current.relative_humidity_2m + "%");
print("Wind Speed: " + data.current.wind_speed_10m + " mph");
```

**Output:**
```
Weather Report
================
Temperature: 45.3°F
Humidity: 68%
Wind Speed: 12.4 mph
```

## Dynamic Location from Process Variables

You can reference process variables for latitude and longitude to get weather for user-specific locations:

1. Set process variables before the weather task:
   ```javascript
   execution.setVariable("userLat", "34.0522");  // Los Angeles
   execution.setVariable("userLon", "-118.2437");
   ```

2. In the element template, use variable syntax:
   - **Latitude**: `${userLat}`
   - **Longitude**: `${userLon}`

## Weather Code Reference

The `weather_code` field uses WMO Weather interpretation codes:

| Code | Description |
|------|-------------|
| 0 | Clear sky |
| 1, 2, 3 | Mainly clear, partly cloudy, and overcast |
| 45, 48 | Fog and depositing rime fog |
| 51, 53, 55 | Drizzle: Light, moderate, and dense intensity |
| 61, 63, 65 | Rain: Slight, moderate and heavy intensity |
| 71, 73, 75 | Snow fall: Slight, moderate, and heavy intensity |
| 77 | Snow grains |
| 80, 81, 82 | Rain showers: Slight, moderate, and violent |
| 85, 86 | Snow showers slight and heavy |
| 95 | Thunderstorm: Slight or moderate |
| 96, 99 | Thunderstorm with slight and heavy hail |

### Example: Check for Rain

```javascript
var weatherCode = execution.getVariable("weatherData").current.weather_code;

if (weatherCode >= 51 && weatherCode <= 67) {
  print("It's raining! Bring an umbrella.");
  execution.setVariable("needsUmbrella", true);
} else {
  print("No rain expected.");
  execution.setVariable("needsUmbrella", false);
}
```

## Common Locations (Coordinates)

Here are coordinates for major cities you can use for testing:

| City | Latitude | Longitude |
|------|----------|-----------|
| New York City | 40.7128 | -74.0060 |
| Los Angeles | 34.0522 | -118.2437 |
| Chicago | 41.8781 | -87.6298 |
| London | 51.5074 | -0.1278 |
| Paris | 48.8566 | 2.3522 |
| Tokyo | 35.6762 | 139.6503 |
| Sydney | -33.8688 | 151.2093 |
| Berlin | 52.5200 | 13.4050 |

## Real-World Use Cases

1. **Travel Planning**: Check weather before booking trips
2. **Event Management**: Determine if outdoor events need backup plans
3. **Fleet Management**: Alert drivers about adverse weather conditions
4. **Agriculture**: Monitor weather for farming operations
5. **Retail**: Adjust inventory based on weather forecasts
6. **Construction**: Schedule outdoor work based on weather

## Example Process Flow

```
Start → Get User Location → Fetch Weather → Check Conditions → Send Notification → End
                                                ↓
                                          (If rainy)
                                                ↓
                                    Send "Bring Umbrella" Alert
```

## Troubleshooting

### Issue: Invalid coordinates

**Cause**: Latitude must be between -90 and 90, longitude between -180 and 180

**Solution**: Verify your coordinates are valid:
- Latitude: -90 (South Pole) to +90 (North Pole)
- Longitude: -180 (West) to +180 (East)

### Issue: weatherData is undefined

**Cause**: The API request failed or the workflow is not active

**Solution**:
1. Check that `success = true` in process variables
2. Verify the n8n workflow is activated
3. Check `error` variable for details

### Issue: Wrong temperature unit

**Cause**: Temperature unit setting doesn't match expectations

**Solution**: Change the **Temperature Unit** dropdown in the template to "fahrenheit" or "celsius"

## API Information

This connector uses the Open-Meteo API:
- **Website**: https://open-meteo.com
- **API Docs**: https://open-meteo.com/en/docs
- **Rate Limits**: 10,000 requests per day for non-commercial use
- **Cost**: Free (no API key required)

## Files in this Connector

- `weather-forecast.n8n.json` - n8n workflow (same as http-request)
- `weather-forecast.element.json` - Camunda Modeler element template
- `weather-forecast.bpmn` - Example BPMN process
- `README.md` - This documentation file

## Support

For issues or questions:
- Review the example BPMN process: `weather-forecast.bpmn`
- Check n8n workflow execution logs
- Verify your coordinates using https://www.latlong.net

## License

Part of the Catalyst Connector project.
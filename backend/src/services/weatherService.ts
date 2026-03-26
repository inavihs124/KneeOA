import axios from 'axios';

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const getWeatherData = async (lat: number, lon: number) => {
    try {
        if(!API_KEY || API_KEY === 'your_openweather_api_key') {
            return { temperature: 25, humidity: 60, pressure: 1013 };
        }
        const res = await axios.get(`${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        return {
            temperature: res.data.main.temp,
            humidity: res.data.main.humidity,
            pressure: res.data.main.pressure
        };
    } catch {
        return { temperature: 25, humidity: 60, pressure: 1013 };
    }
};

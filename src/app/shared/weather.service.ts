import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class WeatherService {
  private apiUrl =
    // "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m";
    "https://api.open-meteo.com/v1/forecast";

  constructor(private http: HttpClient) {}

  getWeatherData(lat: number, long: number): Observable<any> {
    const params = new HttpParams({
      fromObject: {
        timezone: "auto",
        // timezone: "Austria",
        precipitation_unit: "inch",
        // windspeed_unit: "kph",
        // temperature_unit: "celcius",
        daily: "precipitation_sum,rain_sum,snowfall_sum",
        // end_date: "2023-08-31",
        // start_date: "2023-08-25",
        longitude: long.toString(),
        latitude: lat.toString(),
        // longitude: -105.870018,
        // latitude: 37.469448,
        hourly: "temperature_2m,precipitation",
        precipitation: [0, 0, 0.5, 0, 0],
        current_weather: true,
      },
    });

    const apiUrlWithParams = `${this.apiUrl}?${params.toString()}`;
    console.log("API URL:", apiUrlWithParams); // Debug log
    console.log(params);
    return this.http.get(apiUrlWithParams);
  }

  getLocationDetails(lat, long) {
    let api_url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}&zoom=18&addressdetails=1`;

    return this.http.get(api_url);
  }
}

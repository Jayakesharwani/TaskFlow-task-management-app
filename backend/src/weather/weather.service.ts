import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class WeatherService {
  private readonly apiKey: string;
  private readonly baseUrl =
    'https://api.openweathermap.org/data/2.5/weather';

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.apiKey =
      this.configService.get<string>(
        'OPENWEATHER_API_KEY',
      ) || '';
  }

  async getCurrentWeather(location: string) {
    if (!location || !location.trim()) {
      throw new BadRequestException(
        'Location is required',
      );
    }

    if (!this.apiKey) {
      throw new ServiceUnavailableException(
        'Weather service is not configured',
      );
    }

    try {
      const response = await axios.get(
        this.baseUrl,
        {
          params: {
            q: location,
            appid: this.apiKey,
            units: 'metric',
          },
          timeout: 5000,
        },
      );

      const data = response.data;

      return {
        location: data.name,
        country: data.sys?.country,
        temperature: Math.round(
          data.main?.temp,
        ),
        feelsLike: Math.round(
          data.main?.feels_like,
        ),
        minTemperature: Math.round(
          data.main?.temp_min,
        ),
        maxTemperature: Math.round(
          data.main?.temp_max,
        ),
        humidity: data.main?.humidity,
        pressure: data.main?.pressure,
        condition:
          data.weather?.[0]?.main || null,
        description:
          data.weather?.[0]?.description || null,
        icon:
          data.weather?.[0]?.icon || null,
        windSpeed: data.wind?.speed ?? null,
      };
    } catch (error: any) {
      console.error(
        'Weather API error:',
        error?.response?.data ||
          error?.message ||
          error,
      );

      if (
        error?.response?.status === 404
      ) {
        throw new BadRequestException(
          `Weather information not found for "${location}"`,
        );
      }

      throw new ServiceUnavailableException(
        'Unable to fetch weather information',
      );
    }
  }
}
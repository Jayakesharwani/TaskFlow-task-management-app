"use client";

import { useEffect, useState } from "react";
import {
  Cloud,
  CloudRain,
  CloudSun,
  Droplets,
  MapPin,
  Thermometer,
  Wind,
  X,
  Zap,
} from "lucide-react";

type WeatherData = {
  temperature?: number;
  temp?: number;
  description?: string;
  condition?: string;
  humidity?: number;
  windSpeed?: number;
  wind?: number;
};

type WeatherModalProps = {
  weather: WeatherData;
  location?: string | null;
  onClose: () => void;
};

type WeatherType =
  | "rain"
  | "storm"
  | "snow"
  | "cloud"
  | "fog"
  | "clear";

function getWeatherType(weather: WeatherData): WeatherType {
  const text = `${weather.description || ""} ${
    weather.condition || ""
  }`.toLowerCase();

  if (
    text.includes("thunder") ||
    text.includes("storm")
  ) {
    return "storm";
  }

  if (
    text.includes("rain") ||
    text.includes("drizzle") ||
    text.includes("shower")
  ) {
    return "rain";
  }

  if (
    text.includes("snow") ||
    text.includes("ice")
  ) {
    return "snow";
  }

  if (
    text.includes("fog") ||
    text.includes("mist") ||
    text.includes("haze")
  ) {
    return "fog";
  }

  if (
    text.includes("cloud") ||
    text.includes("overcast")
  ) {
    return "cloud";
  }

  return "clear";
}

function getWeatherIcon(type: WeatherType) {
  switch (type) {
    case "rain":
      return CloudRain;

    case "storm":
      return Zap;

    case "cloud":
      return Cloud;

    case "snow":
      return Cloud;

    case "fog":
      return Cloud;

    default:
      return CloudSun;
  }
}

function getWeatherTheme(type: WeatherType) {
  switch (type) {
    case "rain":
      return {
        background:
          "bg-gradient-to-br from-slate-700 via-blue-800 to-slate-900",
        icon: "text-blue-200",
        badge:
          "bg-blue-500/20 text-blue-100 border-blue-300/30",
        title: "Rainy Weather",
      };

    case "storm":
      return {
        background:
          "bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-950",
        icon: "text-yellow-300",
        badge:
          "bg-yellow-400/20 text-yellow-100 border-yellow-300/30",
        title: "Thunderstorm",
      };

    case "snow":
      return {
        background:
          "bg-gradient-to-br from-slate-500 via-blue-300 to-slate-100",
        icon: "text-white",
        badge:
          "bg-white/20 text-white border-white/30",
        title: "Snowy Weather",
      };

    case "cloud":
      return {
        background:
          "bg-gradient-to-br from-slate-500 via-blue-500 to-slate-700",
        icon: "text-white",
        badge:
          "bg-white/20 text-white border-white/30",
        title: "Cloudy Weather",
      };

    case "fog":
      return {
        background:
          "bg-gradient-to-br from-gray-500 via-gray-400 to-gray-700",
        icon: "text-gray-100",
        badge:
          "bg-white/20 text-white border-white/30",
        title: "Foggy Weather",
      };

    default:
      return {
        background:
          "bg-gradient-to-br from-indigo-500 via-sky-500 to-purple-600",
        icon: "text-yellow-200",
        badge:
          "bg-white/20 text-white border-white/30",
        title: "Clear Weather",
      };
  }
}

export default function WeatherModal({
  weather,
  location,
  onClose,
}: WeatherModalProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 20);

    return () => clearTimeout(timer);
  }, []);

  const type = getWeatherType(weather);
  const theme = getWeatherTheme(type);
  const WeatherIcon = getWeatherIcon(type);

  const temperature =
    weather.temperature ??
    weather.temp ??
    0;

  const humidity = weather.humidity;
  const windSpeed =
    weather.windSpeed ??
    weather.wind;

  function handleClose() {
    setVisible(false);

    setTimeout(() => {
      onClose();
    }, 180);
  }

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/60 p-3 backdrop-blur-sm transition-opacity duration-200 sm:p-5 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <div
        onClick={(event) =>
          event.stopPropagation()
        }
        className={`relative w-full max-w-md overflow-hidden rounded-[2rem] text-white shadow-2xl transition-all duration-300 ${
          visible
            ? "translate-y-0 scale-100"
            : "translate-y-4 scale-95"
        }`}
      >

        {/* WEATHER BACKGROUND */}

        <div
          className={`relative min-h-[520px] overflow-hidden ${theme.background}`}
        >

          {/* Decorative weather effects */}

          {type === "rain" && (
            <div className="pointer-events-none absolute inset-0 opacity-30">
              <div className="absolute left-[15%] top-[-20px] h-32 w-px rotate-[12deg] bg-white" />
              <div className="absolute left-[30%] top-[-30px] h-40 w-px rotate-[12deg] bg-white" />
              <div className="absolute left-[50%] top-[-10px] h-36 w-px rotate-[12deg] bg-white" />
              <div className="absolute left-[70%] top-[-40px] h-44 w-px rotate-[12deg] bg-white" />
              <div className="absolute left-[85%] top-[-20px] h-32 w-px rotate-[12deg] bg-white" />
            </div>
          )}

          {type === "snow" && (
            <div className="pointer-events-none absolute inset-0 opacity-70">
              <div className="absolute left-[15%] top-[20%] text-2xl">
                ❄
              </div>

              <div className="absolute left-[70%] top-[15%] text-xl">
                ❄
              </div>

              <div className="absolute left-[45%] top-[35%] text-3xl">
                ❄
              </div>

              <div className="absolute left-[80%] top-[45%] text-2xl">
                ❄
              </div>
            </div>
          )}

          {type === "storm" && (
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-purple-400/20 blur-3xl" />

              <div className="absolute left-1/2 top-1/3 h-32 w-32 -translate-x-1/2 rounded-full bg-indigo-400/20 blur-3xl" />
            </div>
          )}

          {type === "clear" && (
            <div className="pointer-events-none absolute right-[-60px] top-[-60px] h-52 w-52 rounded-full bg-yellow-300/30 blur-3xl" />
          )}

          {/* HEADER */}

          <div className="relative flex items-center justify-between p-5 sm:p-6">

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                Live Weather
              </p>

              <h2 className="mt-1 text-xl font-bold sm:text-2xl">
                {theme.title}
              </h2>
            </div>

            <button
              onClick={handleClose}
              className="rounded-full bg-white/10 p-2.5 text-white backdrop-blur transition hover:bg-white/20"
              aria-label="Close weather"
            >
              <X size={20} />
            </button>
          </div>

          {/* LOCATION */}

          <div className="relative flex items-center gap-2 px-5 text-sm text-white/80 sm:px-6">
            <MapPin size={16} />

            <span className="truncate">
              {location || "Unknown location"}
            </span>
          </div>

          {/* MAIN WEATHER */}

          <div className="relative flex flex-col items-center px-5 pb-8 pt-10 text-center sm:pt-12">

            <div
              className={`mb-5 flex h-28 w-28 items-center justify-center rounded-full bg-white/10 shadow-2xl backdrop-blur-md sm:h-32 sm:w-32`}
            >
              <WeatherIcon
                size={62}
                strokeWidth={1.5}
                className={theme.icon}
              />
            </div>

            <div className="flex items-start justify-center">

              <span className="text-7xl font-extrabold tracking-tight sm:text-8xl">
                {Math.round(temperature)}
              </span>

              <span className="mt-3 text-3xl font-semibold text-white/80 sm:text-4xl">
                °C
              </span>
            </div>

            <p className="mt-3 text-lg font-semibold capitalize text-white/90">
              {weather.description ||
                weather.condition ||
                "Current conditions"}
            </p>

            <div
              className={`mt-4 rounded-full border px-4 py-1.5 text-xs font-semibold backdrop-blur ${theme.badge}`}
            >
              Live conditions
            </div>
          </div>

          {/* WEATHER DETAILS */}

          <div className="relative mx-4 mb-5 grid grid-cols-2 gap-3 sm:mx-6 sm:mb-6">

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
              <div className="flex items-center gap-2 text-white/70">
                <Thermometer size={17} />

                <span className="text-xs font-medium">
                  Temperature
                </span>
              </div>

              <p className="mt-2 text-lg font-bold">
                {Math.round(temperature)}°C
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
              <div className="flex items-center gap-2 text-white/70">
                <Droplets size={17} />

                <span className="text-xs font-medium">
                  Humidity
                </span>
              </div>

              <p className="mt-2 text-lg font-bold">
                {humidity != null
                  ? `${Math.round(humidity)}%`
                  : "N/A"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
              <div className="flex items-center gap-2 text-white/70">
                <Wind size={17} />

                <span className="text-xs font-medium">
                  Wind
                </span>
              </div>

              <p className="mt-2 text-lg font-bold">
                {windSpeed != null
                  ? `${Math.round(windSpeed)}`
                  : "N/A"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
              <div className="flex items-center gap-2 text-white/70">
                <CloudSun size={17} />

                <span className="text-xs font-medium">
                  Condition
                </span>
              </div>

              <p className="mt-2 truncate text-sm font-bold capitalize">
                {weather.description ||
                  weather.condition ||
                  "Clear"}
              </p>
            </div>

          </div>

          {/* CLOSE */}

          <div className="relative px-4 pb-5 sm:px-6 sm:pb-6">
            <button
              onClick={handleClose}
              className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-gray-900 shadow-lg transition hover:bg-gray-100"
            >
              Close Weather
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
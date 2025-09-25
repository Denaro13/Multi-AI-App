import React from "react";

interface WeatherData {
  location: {
    name: string;
    country: string;
    localTime: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
      code: number;
    };
  };
}

interface WeatherCardProps {
  weatherData: WeatherData;
}

interface WeatherStyle {
  backgroundColor: string;
  accentColor: string;
  textColor: string;
  borderColor: string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weatherData }) => {
  const getWeatherStyle = (conditionCode: number): WeatherStyle => {
    const styles: Record<number, WeatherStyle> = {
      1000: {
        //Sunny
        backgroundColor: "bg-amber-500/70",
        accentColor: "bg-amber-400",
        textColor: "text-amber-200",
        borderColor: "border-amber-400/50",
      },
      1003: {
        //Partly Cloudy
        backgroundColor: "bg-slate-600/70",
        accentColor: "bg-slate-500",
        textColor: "text-slate-200",
        borderColor: "border-slate-400/50",
      },
      1063: {
        //Rain
        backgroundColor: "bg-blue-600/70",
        accentColor: "bg-blue-500",
        textColor: "text-blue-200",
        borderColor: "border-blue-400/50",
      },
      1066: {
        //Snow
        backgroundColor: "bg-sky-500/70",
        accentColor: "bg-sky-500",
        textColor: "text-sky-200",
        borderColor: "border-sky-400/50",
      },
    };

    const defaultStyles: WeatherStyle = {
      backgroundColor: "bg-sky-500/70",
      accentColor: "bg-sky-500",
      textColor: "text-sky-200",
      borderColor: "border-sky-400/50",
    };
    return styles[conditionCode] || defaultStyles;
  };

  const formatTime = (dateTimeStr: string): string => {
    const date = new Date(dateTimeStr);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };
  const weatherStyle = getWeatherStyle(weatherData.current.condition.code);

  return (
    <div
      className={`relative w-full max-w-sm h-24 rounded-xl overflow-hidden border ${weatherStyle.backgroundColor}`}
    >
      <div className={`absolute inset-0 ${weatherStyle.backgroundColor}`}>
        <div className="relative h-full flex items-center justify-between px-6">
          <div>
            <h2 className="text-2xl font-bold leading-tight text-white">
              {weatherData.location.name}
            </h2>
            <p className="text-sm text-gray-300">
              {formatTime(weatherData.location.localTime)}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-baseline justify-end mb-1">
              <span className="text-4xl font-bold text-white">
                {Math.round(weatherData.current.temp_c)}
              </span>
              <span>˚C</span>
            </div>
            <span className={`text-sm font-medium ${weatherStyle.textColor}`}>
              {weatherData.current.condition.text}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;

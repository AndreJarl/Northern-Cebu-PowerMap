import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import barangayGeoJSON from "./Cebu.MuniCities.json";
import {Eye, EyeOff} from  "lucide-react"

// Barangay energization data
const barangayData = {
  "Daanbantayan": 67,
  "Medellin": 94,
  "Bogo City": 24,
  "Tabogon": 16,
  "San Remigio": 22,
  "Borbon": 21,
  "Sogod": 67,
  "Tabuelan": 67,
  "Tuburan": 93,
  "Catmon": 60,
  "Carmen": 86,
  "Danao City": 100,
  "Compostela": 100,
};

// Function to pick color based on energization value
const getColor = (value) => {
  if (value === 100) return "#22c55e";
  if (value >= 80) return "#84cc16";
  if (value >= 50) return "#facc15";
  if (value >= 20) return "#f97316";
  return "#ef4444";
};

const overallEnergized = Math.round(
  Object.values(barangayData).reduce((a, b) => a + b, 0) / Object.values(barangayData).length
);

export default function CebuBarangaysMap() {
  const [legendOpen, setLegendOpen] = useState(true);

  useEffect(() => {
    const map = document.querySelector(".leaflet-container");
    if (map) {
      map.style.width = "100%";
      map.style.height = "100%";
    }
  }, []);

  const style = (feature) => {
    const name = feature.properties.NAME_2;
    const value = barangayData[name];
    return value !== undefined
      ? { fillColor: getColor(value), weight: 1, opacity: 1, color: "white", dashArray: "3", fillOpacity: 0.7 }
      : { fillOpacity: 0, weight: 0.5, color: "gray" };
  };

  const onEachFeature = (feature, layer) => {
    const name = feature.properties.NAME_2;
    const value = barangayData[name];

    if (value !== undefined) {
      layer.bindPopup(`<b>${name}</b><br/>Energized: ${value}%`);
      layer.on({
        mouseover: (e) => {
          e.target.setStyle({ weight: 3, color: "#000", fillOpacity: 0.4 });
          e.target.openPopup();
        },
        mouseout: (e) => {
          e.target.setStyle(style(feature));
          e.target.closePopup();
        },
      });
    }
  };

  return (
    <div className="w-screen h-screen relative">
      {/* Map */}
      <MapContainer center={[10.85, 123.95]} zoom={10} className="w-screen h-screen">
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON data={barangayGeoJSON} style={style} onEachFeature={onEachFeature} />
      </MapContainer>

      {/* Legend */}
     <div
  className={`absolute right-4 bottom-4 lg:top-20 lg:right-4 bg-white shadow-xl rounded-xl p-4 sm:p-6 z-[1000] w-56 sm:w-64 lg:w-72 text-xs sm:text-sm lg:text-base transition-all duration-300`}
  style={{ height: legendOpen ? "350px" : "100px" }}
>
  {/* Eye toggle */}
  <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => setLegendOpen(!legendOpen)}>
    <h3 className="font-bold text-base sm:text-lg lg:text-xl text-center lg:text-left">
      Energization Status Legend
    </h3>
    {legendOpen ? <Eye size={20} /> : <EyeOff size={20} />}
  </div>

  {legendOpen && (
    <div className="flex flex-col gap-2 z-[100] overflow-y-auto" style={{ maxHeight: "250px" }}>
      {/* Color categories */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded"></span>
          <span>100% Energized</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 sm:w-5 sm:h-5 bg-lime-500 rounded"></span>
          <span>80% - 99%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 sm:w-5 sm:h-5 bg-yellow-400 rounded"></span>
          <span>50% - 79%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 sm:w-5 sm:h-5 bg-orange-500 rounded"></span>
          <span>20% - 49%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded"></span>
          <span>0% - 19%</span>
        </div>
      </div>

      {/* Overall Energized */}
      <div className="flex items-center gap-2 mt-3 font-semibold text-sm sm:text-base">
        <span>Overall Energized: {overallEnergized}%</span>
      </div>

      {/* CEBECO Contacts */}
      <div className="mt-3">
        <h4 className="font-semibold mb-1">CEBECO Contacts:</h4>
        <p>Main Office: 0906 241 5333</p>
        <p>Danao Area Office: 0977 278 5911</p>
        <p>Tuburan Area Office: 0906 241 5311</p>
      </div>

      {/* Disclaimer */}
      <p className="mt-2 text-[10px] sm:text-xs text-gray-500 italic">
        Disclaimer: Data sourced from <span className="font-semibold">CEBECO II</span>.
      </p>
    </div>
  )}
</div>


      {/* Title */}
      <h1 className="absolute w-[300px] lg:w-[900px] top-2 sm:top-4 left-1/2 -translate-x-1/2 text-lg sm:text-2xl md:text-3xl font-bold bg-white/90 px-3 sm:px-4 py-1 sm:py-2 rounded-lg shadow z-[990] text-center">
        Northern Cebu Energization Status{" "}
        <span className="text-gray-600 text-xs sm:text-sm md:text-lg">(as of Oct. 2, 2025)</span>
      </h1>

      {/* Source */}
      <p className="absolute top-20 sm:top-16 left-1/2 -translate-x-1/2 text-xs sm:text-sm text-gray-500 bg-white/80 px-2 sm:px-3 py-1 rounded shadow z-[1000] text-center">
        Source: Facebook post of <span className="font-semibold">Cebu II Electric Cooperative Incorporated (CEBECO II)</span>
      </p>
    </div>
  );
}

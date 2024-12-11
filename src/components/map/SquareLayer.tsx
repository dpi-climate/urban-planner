import { useState, useEffect, useCallback, useRef } from "react";
import { IconLayer } from "@deck.gl/layers";
import { MapboxOverlay } from "@deck.gl/mapbox";
import chroma from "chroma-js"; // For color interpolation
import { DataLoader } from "../../data-loader/DataLoader";
import React from "react";

const PointLayer = ({
  map,
  climateVariable,
  year,
}: {
  map: mapboxgl.Map | null;
  climateVariable: string;
  year: string;
}) => {
  const [geojsonData, setGeojsonData] = useState<GeoJSON.FeatureCollection | null>(
    null
  );
  const hasFetchedData = useRef(false);
  const overlayRef = useRef<MapboxOverlay | null>(null);

  const fetchData = useCallback(() => {
    (async () => {
      const response = await DataLoader.getData();
      if (response.data) setGeojsonData(response.data);
    })();
  }, [climateVariable]);

  useEffect(() => {
    if (!hasFetchedData.current) {
      fetchData();
      hasFetchedData.current = true;
    }
  }, [fetchData]);


  const interpolateColor = (value: number | null): [number, number, number, number] => {
    if (value === null || value === undefined) {
      return [0, 0, 0, 0]; // Transparent
    }

    const stops = [
      { value: 0, color: "#FFFFFF" },
      { value: 76.2, color: "#E0F3DB" },
      { value: 127, color: "#C2E699" },
      { value: 203.2, color: "#78C679" },
      { value: 279.4, color: "#31A354" },
      { value: 330.2, color: "#006837" },
      { value: 406.4, color: "#FFEDA0" },
      { value: 457.2, color: "#FED976" },
      { value: 533.4, color: "#FEB24C" },
      { value: 609.6, color: "#FD8D3C" },
      { value: 660.4, color: "#FC4E2A" },
      { value: 736.6, color: "#E31A1C" },
      { value: 812.8, color: "#BD0026" },
      { value: 863.6, color: "#800026" },
      { value: 939.8, color: "#54278F" },
      { value: 990.6, color: "#756BB1" },
      { value: 1066.8, color: "#9E9AC8" },
      { value: 1143, color: "#CBC9E2" },
      { value: 1193.8, color: "#DADAEB" },
      { value: 1270, color: "#F2F0F7" },
    ];

    // Find the surrounding stops
    let lower = stops[0];
    let upper = stops[stops.length - 1];

    for (let i = 0; i < stops.length - 1; i++) {
      if (value >= stops[i].value && value <= stops[i + 1].value) {
        lower = stops[i];
        upper = stops[i + 1];
        break;
      }
    }

    // Interpolate between stops
    const t = (value - lower.value) / (upper.value - lower.value);
    const color = chroma.mix(lower.color, upper.color, t).rgba();

    return [color[0], color[1], color[2], 255]; // Return RGBA
  };

  useEffect(() => {
    if (!map || !geojsonData) return;

    // const squareIcon = {
    //   url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSJibGFjayIvPjwvc3ZnPg==", // SVG base64 for a black square
    //   width: 10,
    //   height: 10,
    //   anchorY: 5, // Center the square
    // };
    const squareIcon = {
      url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==", // Grayscale white square
      width: 10,
      height: 10,
      anchorY: 5,
    };
    
    

    // Create a Deck.gl IconLayer for squares
    const squareLayer = new IconLayer({
      id: "square-layer",
      data: geojsonData.features,
      getPosition: (d: any) => d.geometry.coordinates, // Coordinates from GeoJSON
      getSize: 10, // Size of each square in pixels
      getIcon: () => squareIcon, // Square shape
      getColor: () => [255, 0, 0, 255], // Solid red

      // getColor: (d: any) => {
      //   const value = d.properties[year];
      //   return interpolateColor(value); // Dynamic color based on your data
      // },      
      pickable: true,
      onHover: ({ object, x, y }: any) => {
        const tooltip = document.getElementById("tooltip");
        if (object && tooltip) {
          const { properties } = object;
          const value = properties[year];
          tooltip.style.top = `${y}px`;
          tooltip.style.left = `${x}px`;
          tooltip.innerHTML = `Value: ${value}`;
          tooltip.style.display = "block";
        } else if (tooltip) {
          tooltip.style.display = "none";
        }
      },
      onClick: ({ object }: any) => {
        if (object) {
          alert(`Clicked on: ${JSON.stringify(object.properties)}`);
        }
      },
    });

    // Initialize or update the MapboxOverlay
    if (!overlayRef.current) {
      overlayRef.current = new MapboxOverlay({
        layers: [squareLayer],
      });
      map.addControl(overlayRef.current);
    } else {
      overlayRef.current.setProps({ layers: [squareLayer] });
    }

    return () => {
      // Cleanup: Remove the overlay when the component unmounts
      if (overlayRef.current) {
        overlayRef.current.finalize();
        overlayRef.current = null;
      }
    };
  }, [map, geojsonData, year]);

  return (
    <>
      <div
        id="tooltip"
        style={{
          display: "none",
          position: "absolute",
          padding: "8px",
          background: "white",
          boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.5)",
          zIndex: 10,
          pointerEvents: "none",
        }}
      />
    </>
  );
};

export default PointLayer;

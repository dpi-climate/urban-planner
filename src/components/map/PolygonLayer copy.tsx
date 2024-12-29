// src/components/PolygonLayer.tsx

import React, { useEffect, useMemo, useState } from "react";
import { GeoJsonLayer } from "@deck.gl/layers";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { DataLoader } from "../../data-loader/DataLoader";
import mapboxgl from "mapbox-gl";

interface IGeoFeatureProperties {
  GEOID: string;
  average_value: number;
  color: number[]; // [R, G, B, A]
}

interface IGeoFeatureGeometry {
  type: string; // e.g., "MultiPolygon"
  coordinates: number[][][][]; // Nested arrays for MultiPolygon
}

interface IGeoFeature {
  type: "Feature";
  properties: IGeoFeatureProperties;
  geometry: IGeoFeatureGeometry;
}

interface IGeoData {
  type: "FeatureCollection";
  features: IGeoFeature[];
}

interface IPolygonLayerProps {
  map: mapboxgl.Map | null;
  opacity: number; // Should be between 0 and 1
  variable: string;
  year: string;
  zoom: number;
  // Optional: Add a callback for handling clicks
  onPolygonClick?: (properties: IGeoFeatureProperties) => void;
}

const PolygonLayer: React.FC<IPolygonLayerProps> = ({
  map,
  opacity,
  variable,
  year,
  zoom,
  spatialLevel,
  onPolygonClick,
}) => {
  const [geoData, setGeoData] = useState<IGeoData | null>(null);

  // Fetch GeoJSON data when variable or year changes
  useEffect(() => {
    if (!variable || !year) return;

    let isMounted = true;

    const fetchGeoData = async () => {
      try {
        console.log(variable, year, spatialLevel)
        const response = await DataLoader.getPolygonLayerData(variable, year, spatialLevel);
        const data = response.data;

        if (!isMounted || !data || !Array.isArray(data.tracts)) return;

        // Convert the fetched data to GeoJSON format
        const geojson: IGeoData = {
          type: "FeatureCollection",
          features: data.tracts.map((tract: any) => ({
            type: "Feature",
            properties: {
              GEOID: tract.GEOID,
              average_value: tract.average_value,
              color: tract.color, // Ensure this is an array of 4 numbers [R, G, B, A]
            },
            geometry: tract.geometry,
          })),
        };

        setGeoData(geojson);
      } catch (error) {
        console.error("Error fetching GeoJSON data:", error);
        setGeoData(null);
      }
    };

    fetchGeoData();

    return () => {
      isMounted = false;
    };
  }, [variable, year]);

  // Create Deck.gl layers
  const layers = useMemo(() => {
    if (!geoData) return [];

    return [
      new GeoJsonLayer({
        id: `geojson-layer-${variable}-${year}`,
        data: geoData,
        opacity: opacity,
        filled: true,
        stroked: true,
        getFillColor: (feature: IGeoFeature) => feature.properties.color,
        getLineColor: [0, 0, 0, 255], // Black lines
        lineWidthMinPixels: 1,
        getLineWidth: 1,
        pickable: false,
        autoHighlight: false,
        // Optionally enable extrusions for 3D effect
        // extruded: true,
        // getElevation: (feature: IGeoFeature) => Math.abs(feature.properties.average_value) * 10,
        // onClick: (info) => {
        //   if (info.object) {
        //     const { GEOID, average_value } = info.object.properties;
        //     console.log(`GEOID: ${GEOID}, Value: ${average_value}`);

        //     if (onPolygonClick) {
        //       onPolygonClick(info.object.properties);
        //     }
        //   }
        // },
        // // Optional: Define other interactive events like onHover
        // onHover: (info) => {
        //   // Implement tooltip logic here if needed
        // },
      }),
    ];
  }, [geoData, opacity, variable, year, onPolygonClick]);

  // Add Deck.gl layers to Mapbox as an overlay
  useEffect(() => {
    if (!map || layers.length === 0) return;

    // Initialize MapboxOverlay with the Deck.gl layers
    const overlay = new MapboxOverlay({ layers });

    // Add the overlay to the Mapbox map
    map.addControl(overlay as unknown as mapboxgl.IControl);

    return () => {
      if (!map) return;
      // Remove the overlay from the map on cleanup
      map.removeControl(overlay as unknown as mapboxgl.IControl);
    };
  }, [map, layers]);

  return null; // This component does not render anything itself
};

export default PolygonLayer;

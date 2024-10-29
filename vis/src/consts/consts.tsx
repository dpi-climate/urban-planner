const myConsts = {
  mapParams: {
    style: 'mapbox://styles/mapbox/light-v9',
    center: [-98.20, 38.96] as [number, number],
    zoom: 3,
    geoFile: '/temperature.geojson'

  },

  contourLayerParams: {
    id:'contour-layer',
    contours: [
      { threshold: [0, 10], color: new Uint8Array([255, 255, 178]), strokeWidth: 0 },
      { threshold: [10, 20], color: new Uint8Array([254, 204, 92]), strokeWidth: 0 },
      { threshold: [20, 30], color: new Uint8Array([253, 141, 60]), strokeWidth: 0 },
      { threshold: [30, 40], color: new Uint8Array([240, 59, 32]), strokeWidth: 0 },
      { threshold: [40, 50], color: new Uint8Array([189, 0, 38]), strokeWidth: 0 },
    ],
    aggregation: "MEAN" as "MEAN" | "SUM" | "MIN" | "MAX" | undefined,
    cellSize: 50000,
    data: "geojson data"
  }
}

export default myConsts


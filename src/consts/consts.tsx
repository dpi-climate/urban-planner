const myConsts = {
  elements: [
    {
      id: "map",
      key: "mapParams",

    }
  ],

  years: Array.from({ length: 2023 - 1980 + 1 }, (_, i) => 1980 + i),
  
  mapParams: {
    // style: 'mapbox://styles/mapbox/light-v9',
    style: "mapbox://styles/carolvfs/clxnzay8z02qh01qkhftqheen",
    // center: [-98.20, 38.96] as [number, number],
    center: [-87.633400, 41.872780] as [number, number],
    zoom: 12,
    // geoFile: '/temperature.geojson',
    geoFile: '/contours/Yearly_tmax_1980.geojson',

    layers: [
      {
        id: "contour-layer",
        type: "contour-layer",
        properties: {
          contours:  [
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
    ]

  },

  contourLayerParams: {
    id:'contour-layer',
    contours: [
      // { threshold: [0, 10], color: new Uint8Array([255, 255, 178]), strokeWidth: 0 },
      // { threshold: [10, 20], color: new Uint8Array([254, 204, 92]), strokeWidth: 0 },
      // { threshold: [20, 30], color: new Uint8Array([253, 141, 60]), strokeWidth: 0 },
      // { threshold: [30, 40], color: new Uint8Array([240, 59, 32]), strokeWidth: 0 },
      // { threshold: [40, 50], color: new Uint8Array([189, 0, 38]), strokeWidth: 0 },
      { threshold: [15, 18], color: new Uint8Array([255, 255, 178]), strokeWidth: 0 },
  { threshold: [18, 21], color: new Uint8Array([254, 204, 92]), strokeWidth: 0 },
  { threshold: [21, 24], color: new Uint8Array([253, 141, 60]), strokeWidth: 0 },
  { threshold: [24, 27], color: new Uint8Array([240, 59, 32]), strokeWidth: 0 },
  { threshold: [27, 30], color: new Uint8Array([189, 0, 38]), strokeWidth: 0 }
    ],
    aggregation: "MEAN" as "MEAN" | "SUM" | "MIN" | "MAX" | undefined,
    cellSize: 50000,
    data: "geojson data"
  }
}

export default myConsts


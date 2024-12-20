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

export const CLIMATE_YEARS = Array.from({ length: 2023 - 1980 + 1 }, (_, i) => (1980 + i).toString())

export const CLIMATE_VARIABLES = [
  { 
    name: "Min Temperature", 
    id: "tmin", 
    threshold: [
      { value: -30   , color: "#FFFFFF"},
      { value: -28, color: "#E0F3DB"},
      { value:  -26, color: "#C2E699"},
      { value: -24, color: "#78C679"},
      { value: -22, color: "#31A354"},
      { value: -20, color: "#006837"},
      { value: -18, color: "#FFEDA0"},
      { value: -16, color: "#FED976"},
      { value: -14, color: "#FEB24C"},
      { value: -12, color: "#FD8D3C"},
      { value: -10, color: "#FC4E2A"},
      { value: -8, color: "#E31A1C"},
      { value: -6, color: "#BD0026"},
      { value: -4, color: "#800026"},
      { value: -2, color: "#54278F"},
      { value: 0, color: "#756BB1"},
      { value: 2, color: "#9E9AC8"},
      { value: 4, color: "#CBC9E2"},
      { value: 6, color: "#DADAEB"},
      { value: 8, color: "#F2F0F7"},

    ]
  
  },
  { name: 
    "Max Temperature", 
    id: "tmax", 
    threshold: [
      { value: 0   , color: "#FFFFFF"},
      { value: 14, color: "#E0F3DB"},
      { value: 16 , color: "#C2E699"},
      { value: 18, color: "#78C679"},
      { value: 20, color: "#31A354"},
      { value: 22, color: "#006837"},
      { value: 24, color: "#FFEDA0"},
      { value: 26, color: "#FED976"},
      { value: 28, color: "#FEB24C"},
      { value: 30, color: "#FD8D3C"},
      { value: 32, color: "#FC4E2A"},
      { value: 34, color: "#E31A1C"},
      { value: 36, color: "#BD0026"},
      { value: 38, color: "#800026"},
      { value: 40, color: "#54278F"},
      { value: 42, color: "#756BB1"},
      { value: 44, color: "#9E9AC8"},
      { value: 46, color: "#CBC9E2"},
      { value: 48, color: "#DADAEB"},
      { value: 50, color: "#F2F0F7"},

    ]
  
  },
  { 
    name: "Total Precipitation", 
    id: "prcp", 
    threshold: [
      { value: 0.0, color: '#FFFFFF'},
      { value: 12.7, color: '#E0F3DB'},
      { value: 25.4, color: '#C2E699'},
      { value: 38.1, color: '#78C679'},
      { value: 50.8, color: '#31A354'},
      { value: 63.5, color: '#006837'},
      { value: 76.2, color: '#FFEDA0'},
      { value: 88.9, color: '#FED976'},
      { value: 101.6, color: '#FEB24C'},
      { value: 114.3, color: '#FD8D3C'},
      { value: 127.0, color: '#FC4E2A'},
      { value: 139.7, color: '#E31A1C'},
      { value: 152.4, color: '#BD0026'},
      { value: 165.1, color: '#800026'},
      { value: 177.8, color: '#54278F'},
      { value: 190.5, color: '#756BB1'},
      { value: 203.2, color: '#9E9AC8'},
      { value: 215.9, color: '#CBC9E2'},
      { value: 228.6, color: '#DADAEB'},
      { value: 241.3, color: '#F2F0F7'},
    ]
  },

]

// export const BAR_CHART_DATA = [
//     { category: "A", value: 30 },
//     { category: "B", value: 50 },
//     { category: "C", value: 80 },
// ]

export const BAR_CHART_DATA = Array.from({ length: 120 }, (_, i) => ({
  category: `Category ${i + 1}`,
  value: Math.floor(Math.random() * 100) + 1, // Random value between 1 and 100
}));

export const LINE_CHART_DATA = [
    { date: new Date(2023, 0, 1), value: 30 },
    { date: new Date(2023, 1, 1), value: 50 },
    { date: new Date(2023, 2, 1), value: 80 },
]

// export default myConsts


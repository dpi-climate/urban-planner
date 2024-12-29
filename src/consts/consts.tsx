export const serverUrl = "http://localhost:5000"

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

// const prcp_domain_inches = [0, 0.01, 0.1, 0.25, 0.5, 1, 1.5, 2, 3, 4, 6, 8, 10, 15, 20, 30]
const prcp_domain_inches = [0, 0.01, 0.1, 0.25, 0.5, 1, 1.5, 2, 3, 4, 6, 8, 10]

export const CLIMATE_VARIABLES = [
  { 
    name: "Min Temperature", // -20 10
    id: "tmin", 
    domain: Array.from({ length: 38 }, (_, i) => Number((-50) + (50 - (-50)) * i / (38 - 1)).toFixed(1)),
    colors: [[145, 0, 63],
    [206, 18, 86],
    [231, 41, 138],
    [223, 101, 176],
    [255, 115, 223],
    [255, 190, 232],
    [255, 255, 255],
    [218, 218, 235],
    [188, 189, 220],
    [158, 154, 200],
    [117, 107, 177],
    [84, 39, 143],
    [13, 0, 125],
    [13, 61, 156],
    [0, 102, 194],
    [41, 158, 255], 
    [74, 199, 255], 
    [115, 215, 255], 
    [173, 255, 255],
    [48, 207, 194], 
    [0, 153, 150], 
    [18, 87, 87],
    [6, 109, 44],
    [49, 163, 84],
    [116, 196, 118],
    [161, 217, 155],
    [211, 255, 190],  
    [255, 255, 179], 
    [255, 237, 160], 
    [254, 209, 118], 
    [254, 174, 42], 
    [253, 141, 60], 
    [252, 78, 42], 
    [227, 26, 28], 
    [177, 0, 38], 
    [128, 0, 38], 
    [89, 0, 66], 
    [40, 0, 40]]
    // colors: [
    //   "#91003f",
    //   "#ce1256",
    //   "#e7298a",
    //   "#df65b0",
    //   "#ff73df",
    //   "#ffbee8",
    //   "#ffffff",
    //   "#dadaeb",
    //   "#bcbddc",
    //   "#9e9ac8",
    //   "#756bb1",
    //   "#54278f",
    //   "#0d007d",
    //   "#0d3d9c",
    //   "#0066c2",
    //   "#299eff", 
    //   "#4ac7ff", 
    //   "#73d7ff", 
    //   "#adffff",
    //   "#30cfc2", 
    //   "#009996", 
    //   "#125757",
    //   "#066d2c",
    //   "#31a354",
    //   "#74c476",
    //   "#a1d99b",
    //   "#d3ffbe",  
    //   "#ffffb3", 
    //   "#ffeda0", 
    //   "#fed176", 
    //   "#feae2a", 
    //   "#fd8d3c", 
    //   "#fc4e2a", 
    //   "#e31a1c", 
    //   "#b10026", 
    //   "#800026", 
    //   "#590042", 
    //   "#280028"
    // ]
      
  },
  { name: 
    "Max Temperature", // 10 50
    id: "tmax",
    domain: Array.from({ length: 38 }, (_, i) => Number((-50) + (50 - (-50)) * i / (38 - 1)).toFixed(1)),
    colors: [[145, 0, 63],
    [206, 18, 86],
    [231, 41, 138],
    [223, 101, 176],
    [255, 115, 223],
    [255, 190, 232],
    [255, 255, 255],
    [218, 218, 235],
    [188, 189, 220],
    [158, 154, 200],
    [117, 107, 177],
    [84, 39, 143],
    [13, 0, 125],
    [13, 61, 156],
    [0, 102, 194],
    [41, 158, 255], 
    [74, 199, 255], 
    [115, 215, 255], 
    [173, 255, 255],
    [48, 207, 194], 
    [0, 153, 150], 
    [18, 87, 87],
    [6, 109, 44],
    [49, 163, 84],
    [116, 196, 118],
    [161, 217, 155],
    [211, 255, 190],  
    [255, 255, 179], 
    [255, 237, 160], 
    [254, 209, 118], 
    [254, 174, 42], 
    [253, 141, 60], 
    [252, 78, 42], 
    [227, 26, 28], 
    [177, 0, 38], 
    [128, 0, 38], 
    [89, 0, 66], 
    [40, 0, 40]]
    // colors: [
    //   "#91003f",
    //   "#ce1256",
    //   "#e7298a",
    //   "#df65b0",
    //   "#ff73df",
    //   "#ffbee8",
    //   "#ffffff",
    //   "#dadaeb",
    //   "#bcbddc",
    //   "#9e9ac8",
    //   "#756bb1",
    //   "#54278f",
    //   "#0d007d",
    //   "#0d3d9c",
    //   "#0066c2",
    //   "#299eff", 
    //   "#4ac7ff", 
    //   "#73d7ff", 
    //   "#adffff",
    //   "#30cfc2", 
    //   "#009996", 
    //   "#125757",
    //   "#066d2c",
    //   "#31a354",
    //   "#74c476",
    //   "#a1d99b",
    //   "#d3ffbe",  
    //   "#ffffb3", 
    //   "#ffeda0", 
    //   "#fed176", 
    //   "#feae2a", 
    //   "#fd8d3c", 
    //   "#fc4e2a", 
    //   "#e31a1c", 
    //   "#b10026", 
    //   "#800026", 
    //   "#590042", 
    //   "#280028"
    // ]
  
  },
  { 
    name: "Annual Daily Max Precipitation", 
    id: "prcp", 
    domain: prcp_domain_inches.map(value => Number((value * 25.4).toFixed(2))),
    colors: [[255,255,255],
    [199,233,192],
    [161,217,155],
    [116,196,118],
    [49,163,83],
    [0,109,44],
    [255,250,138],
    [255,204,79],
    [254,141,60],
    [252,78,42],
    [214,26,28],
    [173,0,38],
    [112,0,38],
    // [59,0,48],
    // [76,0,115],
    // [255,219,255]
  ]
    // colors: [
    //   "#ffffff",
    //   "#c7e9c0",
    //   "#a1d99b",
    //   "#74c476",
    //   "#31a353",
    //   "#006d2c",
    //   "#fffa8a",
    //   "#ffcc4f",
    //   "#fe8d3c",
    //   "#fc4e2a",
    //   "#d61a1c",
    //   "#ad0026",
    //   "#700026",
    //   "#3b0030",
    //   "#4c0073",
    //   "#ffdbff"
    // ]
    
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

// export const LINE_CHART_DATA = [
//     { date: new Date(2023, 0, 1), value: 30 },
//     { date: new Date(2023, 1, 1), value: 50 },
//     { date: new Date(2023, 2, 1), value: 80 },
// ]

export const LINE_CHART_DATA = [
  {year: 'risk_2yr (', value: 52.27}, 
  {year: 'risk_5yr (', value: 13.64}, 
  {year: 'risk_10yr', value: 9.09}, 
  {year: 'risk_25yr', value: 2.27}, 
  {year: 'risk_50yr', value: 0.0}, 
  {year: 'risk_100yr', value: 0.0}, 
  {year: 'risk_200yr', value: 0.0}, 
  {year: 'risk_500yr', value: 0.0}
]

// export default myConsts


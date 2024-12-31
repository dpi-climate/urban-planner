export const serverUrl = "http://localhost:5000"

export const CLIMATE_YEARS = Array.from({ length: 2023 - 1980 + 1 }, (_, i) => (1980 + i).toString())

// const prcp_domain_inches = [0, 0.01, 0.1, 0.25, 0.5, 1, 1.5, 2, 3, 4, 6, 8, 10, 15, 20, 30]
const prcp_domain_inches = [0, 0.01, 0.1, 0.25, 0.5, 1, 1.5, 2, 3, 4, 6, 8, 10]
const prcp_domain_mm = prcp_domain_inches.map(value => Number((value * 25.4).toFixed(2)))

const n_min_temp = 14
const start_min_temp = -20
const end_min_temp = 10

const n_max_temp = 14
const start_max_temp = 10
const end_max_temp = 50

export const CLIMATE_VARIABLES = [
  { 
    name: "Min Temperature", // -20 10
    id: "tmin", 
    // domain: Array.from({ length: 38 }, (_, i) => Number((-50) + (50 - (-50)) * i / (38 - 1)).toFixed(1)),
    domain: Array.from({ length: n_min_temp }, (_, i) => Number((start_min_temp) + (end_min_temp - (start_min_temp)) * i / (n_min_temp - 1)).toFixed(1)),
    colors: [
    [145, 0, 63],
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
    // [48, 207, 194], 
    // [0, 153, 150], 
    // [18, 87, 87],
    // [6, 109, 44],
    // [49, 163, 84],
    // [116, 196, 118],
    // [161, 217, 155],
    // [211, 255, 190],  
    // [255, 255, 179], 
    // [255, 237, 160], 
    // [254, 209, 118], 
    // [254, 174, 42], 
    // [253, 141, 60], 
    // [252, 78, 42], 
    // [227, 26, 28], 
    // [177, 0, 38], 
    // [128, 0, 38], 
    // [89, 0, 66], 
    // [40, 0, 40]
  ]      
  },
  { name: 
    "Max Temperature", // 10 50
    id: "tmax",
    domain: Array.from({ length: n_max_temp }, (_, i) => Number((start_max_temp) + (end_max_temp - (start_max_temp)) * i / (n_max_temp - 1)).toFixed(1)),
    colors: [
    // [145, 0, 63],
    // [206, 18, 86],
    // [231, 41, 138],
    // [223, 101, 176],
    // [255, 115, 223],
    // [255, 190, 232],
    // [255, 255, 255],
    // [218, 218, 235],
    // [188, 189, 220],
    // [158, 154, 200],
    // [117, 107, 177],
    // [84, 39, 143],
    // [13, 0, 125],
    // [13, 61, 156],
    // [0, 102, 194],
    // [41, 158, 255], 
    // [74, 199, 255], 
    // [115, 215, 255], 
    // [173, 255, 255],
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
    [40, 0, 40]
  ]
  },
  { 
    name: "Annual Daily Max Precipitation", 
    id: "prcp", 
    domain: prcp_domain_mm,
    colors: [
    [255,255,255], // ≤ 0.00
    [199,233,192], // 0.01 - 0.25
    [161,217,155], // 0.26 - 2.54
    [116,196,118], // 2.55 - 6.35
    [49,163,83],   // 6.36 - 12.70
    [0,109,44],    // 12.71 - 25.40
    [255,250,138], // 25.41 - 38.10
    [255,204,79],  // 38.11 - 50.80
    [254,141,60],  // 50.81 - 76.20
    [252,78,42],   // 76.21 - 101.60
    [214,26,28],   // 101.61 - 152.40
    [173,0,38],    // 152.41 - 203.20
    [112,0,38],    // 203.21 - 254.00
    // [59,0,48],
    // [76,0,115],
    // [255,219,255]
  ]
  },

]
console.log(prcp_domain_mm)
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


import axios from "axios"
import { serverUrl } from "../consts/consts"

export abstract class DataLoader {

    static async getPointLayerData(varId: string, year: string, sLevel: string) {
      const url = `${serverUrl}/pt_layer_data`
    
      const response = await axios.get(url, {
        params: { var_name: varId, year: year, s_level: sLevel },
        responseType: 'arraybuffer',
      })
    
      const buffer = response.data             // ArrayBuffer
      const dataView = new DataView(buffer)
    
      // Example parsing logic:
      // 1) read 4 bytes for number of points
      const numPoints = dataView.getUint32(0, true)
      let offset = 4
    
      // 2) positions as float32[] (2 per point => length = numPoints * 2)
      const positions = new Float32Array(buffer, offset, numPoints * 2)
      offset += numPoints * 2 * 4 // 4 bytes per float
    
      // 3) colors as Uint8Array (4 per point => length = numPoints * 4)
      const colors = new Uint8Array(buffer, offset, numPoints * 4)
      offset += numPoints * 4
    
      // Return an object with typed arrays
      return {
        length: numPoints,
        positions,
        colors,
      }
    }
    

    static async getPolygonLayerData(varId: string, year: string, key: string) {
      const url = `${serverUrl}/pol_layer_data`
      const data = { params: { var_name: varId, year: year, s_agg: key } }
      const response = await axios.get(url, data)

      return response
    }

    static async getRiskData(ptIdx: number | [number, number]) {
      const url = `${serverUrl}/risk_data`
      let p = ptIdx
      
      const data = Array.isArray(ptIdx)
        ? { params: { lat: ptIdx[0] , lon: ptIdx[1] } }
        : { params: { pt_idx: ptIdx } }
            
        const response = await axios.get(url, data)
      
        return response.data

    }

    static async getPointFeature(fileName: string) {
      const url = `${serverUrl}/geojson_data`
      const data = { params: { var_name: fileName } }
      const response = await axios.get(url, data)
      return response
    }
}
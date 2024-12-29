import axios from "axios"
import { serverUrl } from "../consts/consts"

export abstract class DataLoader {
    
    static async getPointLayerData(varId: string, year: string) {
      const url = `${serverUrl}/pt_layer_data`
      const data = { params: { var_name: varId, year: year } }
      const response = await axios.get(url, data)

      return response
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
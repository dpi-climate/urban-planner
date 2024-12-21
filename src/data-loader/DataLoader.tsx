import axios from "axios"
import { serverUrl } from "../consts/consts"

export abstract class DataLoader {
    
    static async getData(varId: string, year: string) {
      // const filePath = `/${fileName}`
      // const response = await axios.get(filePath)
      // console.log("loaded")

      const url = `${serverUrl}/geojson_data`
      const data = { params: { var_name: varId, year: year } }
      const response = await axios.get(url, data)
      console.log(varId, "loaded")
      return response
    }

    static async getRiskData(ptIdx: number) {
      const url = `${serverUrl}/risk_data`
      const data = { params: { pt_idx: ptIdx } }
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
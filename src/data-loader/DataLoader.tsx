import axios from "axios"

export abstract class DataLoader {
    static async getData(fileName: string) {
      // const filePath = `/${fileName}`
      // const response = await axios.get(filePath)
      // console.log("loaded")

      const url = `http://localhost:5000/geojson_data`
      const data = { params: { var_name: fileName, year: "1980" } }
      const response = await axios.get(url, data)
      console.log(fileName, "loaded")
      return response
    }

    static async getPointFeature(fileName: string) {
      const url = `http://localhost:5000/geojson_data`
      const data = { params: { var_name: fileName } }
      const response = await axios.get(url, data)
      return response
    }
}
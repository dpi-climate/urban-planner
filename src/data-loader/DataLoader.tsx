import axios from "axios"

export abstract class DataLoader {
    static async getData() {
      // console.log("Data Loader before response")
      const filePath = `/Yearly_Precipitation_Sum.json`
      const response = await axios.get(filePath)
      // console.log("Data Loader after response: ", response)
      return response
      
      // try {
      //     console.log("heeere")
      //     const filePath = `/Yearly_Precipitation_Sum.json`
      //     const response = await axios.get(filePath)
      //     return response
      // } catch (error) {
      //     console.error('Error fetching data:', error)
      //     throw error
      // }
    }
}
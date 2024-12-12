import axios from "axios"

export abstract class DataLoader {
    static async getData(fileName: string) {
      const filePath = `/${fileName}`
      const response = await axios.get(filePath)
      console.log("Data Loader after response: ")
      return response
    }
}
import axios from "axios"
// import { serverUrl } from "../consts/consts"
// import { tableFromIPC, Table } from 'apache-arrow'
// import parseWkt from 'wellknown';

const serverUrl = process.env.REACT_APP_SERVER_URL as string

export abstract class DataLoader {

  static async getBoundariesList() {
    const url = `${serverUrl}/boundary`
    const response = await axios.get(url)
    return response.data
  }

  static async getBoundary(bId: string) {
    const url = `${serverUrl}/boundary`
    const response = await axios.post(url, { b_id: bId }, { responseType: 'arraybuffer' })
    const buffer = response.data
    
    const dataView = new DataView(buffer)
      
    let offset = 0
  
    // 1) number of tracts
    const numTracts = dataView.getUint32(offset, true)
    offset += 4
  
    const features = []
  
    for (let i = 0; i < numTracts; i++) {
      // 2a) GEOID length
      const geoIdLen = dataView.getUint32(offset, true)
      offset += 4
  
      // 2b) GEOID bytes
      const geoIdBytes = new Uint8Array(buffer, offset, geoIdLen)
      offset += geoIdLen
      const geoId = new TextDecoder("utf-8").decode(geoIdBytes)
  
      // 2e) geometry JSON length
      const geomLen = dataView.getUint32(offset, true)
      offset += 4
  
      // 2f) geometry bytes
      const geomBytes = new Uint8Array(buffer, offset, geomLen)
      offset += geomLen
  
      // parse geometry
      const geomStr = new TextDecoder("utf-8").decode(geomBytes)
      const geometry = JSON.parse(geomStr)
  
      features.push({
        UNITID: geoId,
        // average_value: avgVal,
        // color: [r, g, b, a],
        geometry: geometry,
      })
    }
  
    // Return an object that mimics your original { features: [...] } structure
    return { features }

  }

  static async getMapClickBoudary() {
    const url = `${serverUrl}/click_boundary`
    const response = await axios.get(url)
    return response.data
  }
  
  static async getPointFeature(fileName: string) {
    const url = `${serverUrl}/geojson_data`
    const data = { params: { var_name: fileName } }
    const response = await axios.get(url, data)
    return response
  }

  static async getPointLayerData(varId: string, year: string, sLevel: string, bbox: any | null) {
      const url = `${serverUrl}/climate_layer`
    
      const response = await axios.get(url, {
        params: { var_name: varId, year: year, s_agg: sLevel, bbox: bbox },
        responseType: 'arraybuffer',
      })
    
      if(sLevel === "pt") {

        const buffer = response.data             // ArrayBuffer
        const dataView = new DataView(buffer)
        let offset = 0;

        const numPoints = dataView.getUint32(0, true)
        offset += 4
      
        const positions = new Float32Array(buffer, offset, numPoints * 2)
        offset += numPoints * 2 * 4
      
        const colors = new Uint8Array(buffer, offset, numPoints * 4)
        offset += numPoints * 4

        const ids = new Uint32Array(buffer, offset, numPoints);
        offset += numPoints * 4; // 4 bytes per integer

        const idsArray = Array.from(ids);

        // 5) Read Values (float or null)
        // a) Number of values (should be equal to numPoints)
        const numValues = dataView.getUint32(offset, true);
        offset += 4;

        const values = [];
        for (let i = 0; i < numValues; i++) {
          // b) Read presence flag (1 byte)
          const flag = dataView.getUint8(offset);
          offset += 1;

          if (flag === 1) {
            // c) Read Float32 value
            const val = dataView.getFloat32(offset, true);
            offset += 4;
            values.push(val);
          } else if (flag === 0) {
            // d) Value is null
            values.push(null);
          } else {
            console.warn(`Unexpected flag value ${flag} at index ${i}`);
            values.push(null); // Default to null on unexpected flag
          }
        }
      
        // Return an object with typed arrays
        return {
          length: numPoints,
          positions,
          colors,
          ids: idsArray,
          values,
        }
      // } else if(sLevel === "ct" || sLevel === "bg") {
      } else {
        // const uint8Array = new Uint8Array(response.data)
        // const table = tableFromIPC(uint8Array)
        // const featureCollection = arrowTableToGeoJSON(table, 'geometry')
        // return featureCollection

        const buffer = response.data;
        return parsePolygonBinary(buffer);
        
        // // const finalData = createGeoJsonFeatureCollection(data)
        // // return finalData
        // const buffer = response.data
        // return parsePolygonBinary(buffer);

        
      }


      function arrowTableToGeoJSON(table: Table, geometryColumn = 'geometry') {
        // 1) Get the geometry vector (column)
        const geometryVector = table.getChild(geometryColumn);
        if (!geometryVector) {
          throw new Error(`Column "${geometryColumn}" not found`);
        }
      
        // 2) Get other column vectors & their names
        const otherFields = table.schema.fields.filter(
          (f) => f.name !== geometryColumn
        );
        const otherVectors = otherFields.map((f) => table.getChild(f.name));
      
        // 3) Prepare an array for Features
        const features = [];
        const numRows = table.numRows;
      
        // 4) Loop over each row index
        for (let i = 0; i < numRows; i++) {
          // A) WKT geometry string from geometry vector
          const wkt = geometryVector.get(i) as string | null;
          const geometry = wkt ? parseWkt(wkt) : null;
      
          // B) Gather other columns as properties
          const properties: Record<string, unknown> = {};
          for (let j = 0; j < otherFields.length; j++) {
            const fieldName = otherFields[j].name;
            const val = otherVectors[j]?.get(i);
            properties[fieldName] = val;
          }
      
          // C) Build a GeoJSON Feature
          features.push({
            type: 'Feature',
            geometry: geometry as GeoJSON.Geometry | null,
            properties,
          });
        }
      
        // 5) Return FeatureCollection
        return {
          type: 'FeatureCollection',
          features,
        } as GeoJSON.FeatureCollection;
      }

      function parsePolygonBinary(buffer: ArrayBuffer) {
        const dataView = new DataView(buffer);
      
        let offset = 0;
      
        // 1) number of features
        const numFeatures = dataView.getUint32(offset, true);
        offset += 4;
      
        const features = [];
      
        for (let i = 0; i < numFeatures; i++) {
          // 2a) GEOID length
          const geoIdLen = dataView.getUint32(offset, true);
          offset += 4;
      
          // 2b) GEOID bytes
          const geoIdBytes = new Uint8Array(buffer, offset, geoIdLen);
          offset += geoIdLen;
          const geoId = new TextDecoder("utf-8").decode(geoIdBytes);
      
          // 2c) average_value (float32)
          const avgVal = dataView.getFloat32(offset, true);
          offset += 4;
      
          // 2d) color (4 bytes)
          const r = dataView.getUint8(offset);
          const g = dataView.getUint8(offset + 1);
          const b = dataView.getUint8(offset + 2);
          const a = dataView.getUint8(offset + 3);
          offset += 4;
      
          // 2e) geometry JSON length
          const geomLen = dataView.getUint32(offset, true);
          offset += 4;
      
          // 2f) geometry bytes
          const geomBytes = new Uint8Array(buffer, offset, geomLen);
          offset += geomLen;
      
          // parse geometry
          const geomStr = new TextDecoder("utf-8").decode(geomBytes);
          const geometry = JSON.parse(geomStr);
      
          features.push({
            UNITID: geoId,
            value: avgVal,
            color: [r, g, b, a],
            geometry: geometry,
          });
        }
      
        // Return an object that mimics your original { tracts: [...] } structure
        return { features };
      }
    }

  static async getRiskData(lat: number, lon: number) {
    const url = `${serverUrl}/risk_data`
    const data = { params: { lat, lon } } 
    const response = await axios.get(url, data)
    return response.data
  }

  static async getSocioDataById(id: string, level: string){
    const url = `${serverUrl}/socio`
    const response = await axios.post(url, { id, level })
    return response.data

  }

  static async getSocioLayer(varId: string, sLevel: string) {
    const url = `${serverUrl}/socio_layer`
    
    const response = await axios.get(url, {
      params: { var_name: varId, s_agg: sLevel },
      responseType: 'arraybuffer',
    })

    const buffer = response.data
    const dataView = new DataView(buffer);
      
      let offset = 0;
    
      // 1) number of features
      const numFeatures = dataView.getUint32(offset, true);
      offset += 4;
    
      const features = [];
    
      for (let i = 0; i < numFeatures; i++) {
        // 2a) GEOID length
        const geoIdLen = dataView.getUint32(offset, true);
        offset += 4;
    
        // 2b) GEOID bytes
        const geoIdBytes = new Uint8Array(buffer, offset, geoIdLen);
        offset += geoIdLen;
        const geoId = new TextDecoder("utf-8").decode(geoIdBytes);
    
        // 2c) average_value (float32)
        const avgVal = dataView.getFloat32(offset, true);
        offset += 4;
    
        // 2d) color (4 bytes)
        const r = dataView.getUint8(offset);
        const g = dataView.getUint8(offset + 1);
        const b = dataView.getUint8(offset + 2);
        const a = dataView.getUint8(offset + 3);
        offset += 4;
    
        // 2e) geometry JSON length
        const geomLen = dataView.getUint32(offset, true);
        offset += 4;
    
        // 2f) geometry bytes
        const geomBytes = new Uint8Array(buffer, offset, geomLen);
        offset += geomLen;
    
        // parse geometry
        const geomStr = new TextDecoder("utf-8").decode(geomBytes);
        const geometry = JSON.parse(geomStr);
    
        features.push({
          UNITID: geoId,
          value: avgVal,
          color: [r, g, b, a],
          geometry: geometry,
        });
      }
    
      return { features }


  }

  static async getSocioVariablesList() {
    const url = `${serverUrl}/socio_vars`
    const response = await axios.get(url)
    return response.data
  }

  static async getClimateSpatialLevelList() {
    const url = `${serverUrl}/climate_sp_lvls`
    const response = await axios.get(url)
    return response.data
  }

  static async getClimateTimeStampsList() {
    const url = `${serverUrl}/climate_time_stamp_list`
    const response = await axios.get(url)
    return response.data
  }

  static async getStations() {
    const url = `${serverUrl}/stations`
    const response = await axios.get(url)
    return response.data

  }

  static async getClimateVariablesList() {
    const url = `${serverUrl}/climate_vars`
    const response = await axios.get(url)
    return response.data

  }
}



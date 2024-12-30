export function createEvStationIcon() {
    const markerElement = document.createElement("div")
    markerElement.className = "custom-marker" // Add a custom class
  
    // Set the background image to the PNG file
    // markerElement.style.backgroundImage = "url('/location-icon.png')"
    markerElement.style.backgroundImage = "url('/Electric_Charging_Station_Clean_Transparent.png')"
    markerElement.style.backgroundSize = "contain"
    markerElement.style.width = "60px" 
    markerElement.style.height = "60px" 
    markerElement.style.position = "absolute" // Ensure it renders on top
    // markerElement.style.zIndex = "9999"
    markerElement.style.zIndex = "1000"
  
    return markerElement
  }

  
  export function createLocationIcon() {
    const markerElement = document.createElement("div")
    markerElement.className = "custom-marker" // Add a custom class
  
    // Set the background image to the PNG file
    markerElement.style.backgroundImage = "url('/location-icon.png')"
    // markerElement.style.backgroundImage = "url('/Electric_Charging_Station_Clean_Transparent.png')"
    markerElement.style.backgroundSize = "contain"
    markerElement.style.width = "20px" 
    markerElement.style.height = "20px" 
    markerElement.style.position = "absolute" // Ensure it renders on top
    markerElement.style.zIndex = "1000"
    markerElement.style.stroke = "1px"
    
    return markerElement
  }
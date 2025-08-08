export interface LocationData {
  city?: string;
  region?: string;
  country?: string;
  countryCode?: string;
  timezone?: string;
  latitude?: number;
  longitude?: number;
}

// Get user's approximate location using browser's geolocation API
// and a reverse geocoding service
export async function getUserLocation(): Promise<LocationData | null> {
  try {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      console.log("Geolocation not supported");
      return null;
    }

    // Get user's position
    const position = await new Promise<GeolocationPosition>(
      (resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false, // We don't need high accuracy for city-level
          timeout: 10000, // 10 second timeout
          maximumAge: 300000, // Cache for 5 minutes
        });
      }
    );

    const { latitude, longitude } = position.coords;

    // Use a free reverse geocoding API to get city information
    // Using BigDataCloud's free API (no API key required, city-level only)
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch location data");
    }

    const data = await response.json();

    return {
      city: data.city || data.locality,
      region: data.principalSubdivision,
      country: data.countryName,
      countryCode: data.countryCode,
      latitude: Math.round(latitude * 100) / 100, // Round to ~1km accuracy
      longitude: Math.round(longitude * 100) / 100, // Round to ~1km accuracy
    };
  } catch (error) {
    console.error("Error getting location:", error);
    return null;
  }
}

// Get timezone from browser
export function getUserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    console.error("Error getting timezone:", error);
    return "UTC";
  }
}

// Get location data with timezone fallback
export async function getLocationData(): Promise<LocationData | null> {
  const locationData = await getUserLocation();
  const timezone = getUserTimezone();
  
  if (locationData) {
    return {
      ...locationData,
      timezone
    };
  }
  
  // Return just timezone if location fails
  return {
    timezone
  };
}

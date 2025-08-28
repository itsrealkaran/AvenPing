/**
 * Region detection utility for determining user's geographic region
 * Returns 'india', 'asia', or 'global' based on user's location
 */

export type Region = 'india' | 'asia' | 'global';

interface GeolocationData {
  country?: string;
  countryCode?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

// Developing Asian countries (excluding India) with similar service expectations
const ASIA_COUNTRIES = [
  // South Asia
  'AF', // Afghanistan
  'BD', // Bangladesh
  'BT', // Bhutan
  'MV', // Maldives
  'NP', // Nepal
  'PK', // Pakistan
  'LK', // Sri Lanka
  
  // Southeast Asia (developing)
  'KH', // Cambodia
  'ID', // Indonesia
  'LA', // Laos
  'MY', // Malaysia
  'MM', // Myanmar
  'PH', // Philippines
  'TH', // Thailand
  'TL', // East Timor (Timor-Leste)
  'VN', // Vietnam
  
  // Central Asia (developing)
  'KZ', // Kazakhstan
  'KG', // Kyrgyzstan
  'TJ', // Tajikistan
  'TM', // Turkmenistan
  'UZ', // Uzbekistan
  
  // East Asia (developing)
  'MN', // Mongolia
  
  // West Asia (developing)
  'AM', // Armenia
  'AZ', // Azerbaijan
  'GE', // Georgia
  'IR', // Iran
  'IQ', // Iraq
  'JO', // Jordan
  'LB', // Lebanon
  'SY', // Syria
  'YE', // Yemen
];

// India country codes
const INDIA_CODES = ['IN'];

/**
 * Gets user's location using browser geolocation API
 * @returns Promise<GeolocationData | null>
 */
async function getGeolocationData(): Promise<GeolocationData | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Use reverse geocoding to get country information
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          
          if (response.ok) {
            const data = await response.json();
            resolve({
              country: data.countryName,
              countryCode: data.countryCode,
              region: data.principalSubdivision,
              city: data.locality,
              latitude,
              longitude,
            });
          } else {
            resolve({ latitude, longitude });
          }
        } catch (error) {
          console.warn('Reverse geocoding failed:', error);
          resolve({ latitude, longitude });
        }
      },
      (error) => {
        console.warn('Geolocation failed:', error);
        resolve(null);
      },
      {
        timeout: 10000,
        enableHighAccuracy: false,
        maximumAge: 300000, // 5 minutes
      }
    );
  });
}

/**
 * Gets user's location using IP-based geolocation
 * @returns Promise<GeolocationData | null>
 */
async function getIPGeolocationData(): Promise<GeolocationData | null> {
  try {
    // Try multiple IP geolocation services for better reliability
    const services = [
      'https://ipapi.co/json/',
      'https://ip-api.com/json/',
      'https://api.ipify.org?format=json',
    ];

    for (const service of services) {
      try {
        const response = await fetch(service, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          
          // Handle different response formats
          if (data.country_code || data.countryCode) {
            return {
              country: data.country_name || data.country,
              countryCode: data.country_code || data.countryCode,
              region: data.region || data.regionName,
              city: data.city,
            };
          }
        }
      } catch (error) {
        console.warn(`IP geolocation service ${service} failed:`, error);
        continue;
      }
    }
  } catch (error) {
    console.warn('IP geolocation failed:', error);
  }

  return null;
}

/**
 * Determines region based on country code
 * @param countryCode - ISO 3166-1 alpha-2 country code
 * @returns Region
 */
function getRegionFromCountryCode(countryCode: string): Region {
  if (!countryCode) return 'global';
  
  const upperCode = countryCode.toUpperCase();
  
  if (INDIA_CODES.includes(upperCode)) {
    return 'india';
  }
  
  if (ASIA_COUNTRIES.includes(upperCode)) {
    return 'asia';
  }
  
  return 'global';
}

/**
 * Determines region based on coordinates (fallback method)
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @returns Region
 */
function getRegionFromCoordinates(latitude: number, longitude: number): Region {
  // India bounding box (approximate)
  const indiaBounds = {
    north: 37.1,
    south: 6.4,
    east: 97.4,
    west: 68.1,
  };
  
  // Asia bounding box (approximate, excluding India) - expanded to include all developing Asian countries
  const asiaBounds = {
    north: 55.0,  // Mongolia
    south: -10.0, // East Timor
    east: 180.0,  // Pacific islands
    west: 40.0,   // West Asia (Armenia, Georgia)
  };
  
  // Check if coordinates are within India
  if (
    latitude >= indiaBounds.south &&
    latitude <= indiaBounds.north &&
    longitude >= indiaBounds.west &&
    longitude <= indiaBounds.east
  ) {
    return 'india';
  }
  
  // Check if coordinates are within Asia (excluding India)
  if (
    latitude >= asiaBounds.south &&
    latitude <= asiaBounds.north &&
    longitude >= asiaBounds.west &&
    longitude <= asiaBounds.east
  ) {
    return 'asia';
  }
  
  return 'global';
}

/**
 * Gets the user's region based on their location
 * Uses multiple methods: geolocation API, IP geolocation, and coordinate fallback
 * @returns Promise<Region>
 */
export async function getUserRegion(): Promise<Region> {
  try {
    // Method 1: Try browser geolocation first (most accurate)
    const geoData = await getGeolocationData();
    if (geoData) {
      if (geoData.countryCode) {
        return getRegionFromCountryCode(geoData.countryCode);
      }
      
      if (geoData.latitude && geoData.longitude) {
        return getRegionFromCoordinates(geoData.latitude, geoData.longitude);
      }
    }
    
    // Method 2: Fallback to IP-based geolocation
    const ipData = await getIPGeolocationData();
    if (ipData && ipData.countryCode) {
      return getRegionFromCountryCode(ipData.countryCode);
    }
    
    // Method 3: Default to global if all methods fail
    return 'global';
  } catch (error) {
    console.warn('Region detection failed:', error);
    return 'global';
  }
}

/**
 * Gets the user's region synchronously (cached version)
 * This should be called after getUserRegion() has been called at least once
 * @returns Region or null if not yet determined
 */
let cachedRegion: Region | null = null;

export function getCachedRegion(): Region | null {
  return cachedRegion;
}

/**
 * Sets the cached region (useful for testing or manual override)
 * @param region - The region to cache
 */
export function setCachedRegion(region: Region): void {
  cachedRegion = region;
}

/**
 * Gets user region with caching
 * First call will be async, subsequent calls will use cached value
 * @returns Promise<Region>
 */
export async function getUserRegionCached(): Promise<Region> {
  if (cachedRegion !== null) {
    return cachedRegion;
  }
  
  const region = await getUserRegion();
  cachedRegion = region;
  return region;
}

/**
 * Clears the cached region (useful for testing or when user location changes)
 */
export function clearCachedRegion(): void {
  cachedRegion = null;
}

/**
 * Gets region display name
 * @param region - The region code
 * @returns Human-readable region name
 */
export function getRegionDisplayName(region: Region): string {
  switch (region) {
    case 'india':
      return 'India';
    case 'asia':
      return 'Asia';
    case 'global':
      return 'Global';
    default:
      return 'Unknown';
  }
}

/**
 * Gets region-specific configuration
 * @param region - The region code
 * @returns Region-specific configuration object
 */
export function getRegionConfig(region: Region) {
  const configs = {
    india: {
      currency: 'INR',
      timezone: 'Asia/Kolkata',
      locale: 'en-IN',
      dateFormat: 'DD/MM/YYYY',
      serviceTier: 'budget', // Low-cost service expectations
    },
    asia: {
      currency: 'USD', // Most Asian countries use USD for international services
      timezone: 'Asia/Bangkok', // Default to Southeast Asia timezone
      locale: 'en',
      dateFormat: 'DD/MM/YYYY', // Common in Asia
      serviceTier: 'budget', // Low-cost service expectations like India
    },
    global: {
      currency: 'USD',
      timezone: 'UTC',
      locale: 'en',
      dateFormat: 'MM/DD/YYYY',
      serviceTier: 'premium', // Higher service expectations
    },
  };
  
  return configs[region];
}

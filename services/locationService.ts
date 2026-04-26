import * as Location from 'expo-location';

export type NoteLocation = {
  latitude: number;
  longitude: number;
  address: string | null;
};

export async function getCurrentNoteLocation(): Promise<NoteLocation | null> {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== 'granted') {
    return null;
  }

  const currentLocation = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });

  const latitude = currentLocation.coords.latitude;
  const longitude = currentLocation.coords.longitude;

  let address: string | null = null;

  try {
    const reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });
    const firstResult = reverseGeocode[0];

    if (firstResult) {
      address = [
        firstResult.street,
        firstResult.streetNumber,
        firstResult.city,
        firstResult.region,
        firstResult.country,
      ]
        .filter(Boolean)
        .join(', ');
    }
  } catch {
    address = null;
  }

  return {
    latitude,
    longitude,
    address,
  };
}

import { apiFetch } from "./api";

export type DayName =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

export type OpeningPeriod = {
  open: string;
  close: string;
};

export type PlaceOpeningHours = Record<DayName, OpeningPeriod[]>;

export type NiteLightPlace = {
  id: string;
  name: string;
  type: string;
  placeId?: string | null;
  address?: string;
  coord: {
    latitude: number;
    longitude: number;
  };
  openingHours: PlaceOpeningHours;
};

export type PlacesSnapshotInfo = {
  places: NiteLightPlace[];
  isFromCache: boolean;
  hasPendingWrites: boolean;
};

export async function getPlaces() {
  const response = (await apiFetch("/places", {
    requireAuth: false,
  })) as { places: NiteLightPlace[] };

  return response.places;
}

export function listenToPlaces(
  onPlaces: (info: PlacesSnapshotInfo) => void,
  onError?: (error: Error) => void
) {
  let isActive = true;

  async function loadPlaces() {
    try {
      const places = await getPlaces();

      if (!isActive) {
        return;
      }

      onPlaces({
        places,
        isFromCache: false,
        hasPendingWrites: false,
      });
    } catch (error) {
      if (!isActive) {
        return;
      }

      onError?.(error instanceof Error ? error : new Error(String(error)));
    }
  }

  loadPlaces();

  const interval = setInterval(loadPlaces, 60 * 1000);

  return () => {
    isActive = false;
    clearInterval(interval);
  };
}

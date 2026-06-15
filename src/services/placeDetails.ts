import { Image } from "react-native";

import { apiFetch } from "./api";

export type PlaceDetails = {
  id: string;
  name?: string;
  formattedAddress?: string;
  phoneNumber?: string;
  websiteUri?: string;
  googleMapsUri?: string;
  rating?: number;
  userRatingCount?: number;
  businessStatus?: string;
  openNow?: boolean;
  nextOpenTime?: string;
  nextCloseTime?: string;
  weekdayDescriptions?: string[];
  photoUri?: string;
  photoAttributions?: string[];
};

type CachedPlaceDetails = {
  details: PlaceDetails;
  expiresAt: number;
};

const PLACE_DETAILS_CACHE_MS = 15 * 60 * 1000;
const pendingPlaceDetailRequests = new Map<string, Promise<PlaceDetails>>();
const placeDetailsCache = new Map<string, CachedPlaceDetails>();

function getCachedPlaceDetails(placeId: string) {
  const cached = placeDetailsCache.get(placeId);

  if (!cached) return null;

  if (cached.expiresAt <= Date.now()) {
    placeDetailsCache.delete(placeId);
    return null;
  }

  return cached.details;
}

function cachePlaceDetails(placeId: string, details: PlaceDetails) {
  placeDetailsCache.set(placeId, {
    details,
    expiresAt: Date.now() + PLACE_DETAILS_CACHE_MS,
  });

  if (details.photoUri) {
    Image.prefetch(details.photoUri).catch(() => undefined);
  }
}

export async function getGooglePlaceDetails(placeId: string) {
  const cachedDetails = getCachedPlaceDetails(placeId);

  if (cachedDetails) {
    return cachedDetails;
  }

  const existingRequest = pendingPlaceDetailRequests.get(placeId);

  if (existingRequest) {
    return existingRequest;
  }

  const encodedPlaceId = encodeURIComponent(placeId);
  const request = (apiFetch(`/places/google-details/${encodedPlaceId}`, {
    requireAuth: false,
  }) as Promise<PlaceDetails>).then(details => {
    cachePlaceDetails(placeId, details);
    return details;
  });

  pendingPlaceDetailRequests.set(placeId, request);

  try {
    return await request;
  } finally {
    pendingPlaceDetailRequests.delete(placeId);
  }
}

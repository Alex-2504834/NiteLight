import { apiFetch } from "../services/api";

const places = [
  {
    id: "nitelight-cic-south-bank",
    name: "NiteLight CIC South Bank",
    type: "support",
    placeId: null,
    address:
      "Units 3, & 4, North St, Middlesbrough TS6 6AN",
    coord: {
      latitude: 54.5829,
      longitude: -1.1697,
    },
    openingHours: {
      monday: [{ open: "09:00", close: "15:00" }],
      tuesday: [{ open: "09:00", close: "15:00" }],
      wednesday: [{ open: "09:00", close: "15:00" }],
      thursday: [{ open: "09:00", close: "15:00" }],
      friday: [{ open: "09:00", close: "15:00" }],
      saturday: [],
      sunday: [],
    },
  },
];

export async function seedPlaces() {
  for (const place of places) {
    await apiFetch("/places", {
      method: "POST",
      body: JSON.stringify(place),
    });
  }

  console.log("Seeded places successfully through backend");
}

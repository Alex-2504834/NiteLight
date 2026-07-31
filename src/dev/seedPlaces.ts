import { apiFetch } from "../services/api";

const places = [
  {
    id: "nitelight-cic-south-bank",
    name: "NiteLight CIC South Bank",
    type: "Support",
    placeId: "ChIJRYhYjljtfkgRUX2W1CNIdg8",
    address:
      "Units 3 & 4, North Street, South Bank, Middlesbrough TS6 6AN",
    coord: {
      latitude: 54.5829,
      longitude: -1.1697,
    },
    openingHours: {
      monday: [{ open: "09:30", close: "14:30" }],
      tuesday: [{ open: "09:30", close: "17:00" }],
      wednesday: [{ open: "09:30", close: "14:30" }],
      thursday: [{ open: "09:30", close: "17:00" }],
      friday: [{ open: "09:30", close: "14:30" }],
      saturday: [{ open: "09:30", close: "14:30" }],
      sunday: [],
    },
  },
  {
    id: "nitelight-community-hub-middlesbrough",
    name: "NiteLight Community Hub Middlesbrough",
    type: "Support",
    placeId: null,
    address:
      "67 Newport Road, Middlesbrough TS1 1LA",
    coord: {
      latitude: 54.576676,
      longitude: -1.240904,
    },
    openingHours: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [{ open: "09:30", close: "14:30" }],
      saturday: [{ open: "09:30", close: "14:30" }],
      sunday: [],
    },
  },
  {
    id: "st-barnabas-linthorpe-foodbank",
    name: "St Barnabas Linthorpe Foodbank",
    type: "Food",
    placeId: null,
    address:
      "St Barnabas Church, Linthorpe Road, Middlesbrough TS5 6JR",
    coord: {
      latitude: 54.562469,
      longitude: -1.24409,
    },
    openingHours: {
      monday: [{ open: "12:00", close: "14:00" }],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    },
  },
  {
    id: "beacon-baptist-coulby-newham-foodbank",
    name: "The Beacon Baptist Church Coulby Newham Foodbank",
    type: "Food",
    placeId: null,
    address:
      "The Beacon Baptist Church, Langdon Square, Coulby Newham, Middlesbrough TS8 0TF",
    coord: {
      latitude: 54.5264,
      longitude: -1.2161,
    },
    openingHours: {
      monday: [],
      tuesday: [],
      wednesday: [{ open: "13:00", close: "15:00" }],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    },
  },
  {
    id: "grove-hill-methodist-church-foodbank",
    name: "Grove Hill Methodist Church Foodbank",
    type: "Food",
    placeId: null,
    address:
      "Grove Hill Methodist Church, Marton Road, Middlesbrough TS4 2PT",
    coord: {
      latitude: 54.557444,
      longitude: -1.222504,
    },
    openingHours: {
      monday: [],
      tuesday: [{ open: "13:00", close: "15:00" }],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    },
  },
  {
    id: "middlesbrough-community-church-foodbank",
    name: "Middlesbrough Community Church Foodbank",
    type: "Food",
    placeId: null,
    address:
      "Middlesbrough Community Church, Clifton Street, Middlesbrough TS1 4NA",
    coord: {
      latitude: 54.568965,
      longitude: -1.240166,
    },
    openingHours: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [{ open: "11:30", close: "13:30" }],
      friday: [],
      saturday: [],
      sunday: [],
    },
  },
  {
    id: "holy-trinity-north-ormesby-foodbank",
    name: "Holy Trinity North Ormesby Foodbank",
    type: "Food",
    placeId: null,
    address:
      "Holy Trinity Church, Market Place, North Ormesby, Middlesbrough TS3 6LD",
    coord: {
      latitude: 54.572348,
      longitude: -1.213372,
    },
    openingHours: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [{ open: "13:00", close: "15:00" }],
      saturday: [],
      sunday: [],
    },
  },
  {
    id: "church-of-ascension-berwick-hills-foodbank",
    name: "Church of Ascension Berwick Hills Foodbank",
    type: "Food",
    placeId: null,
    address:
      "Church of the Ascension, Penrith Road, Middlesbrough TS3 7JR",
    coord: {
      latitude: 54.558047,
      longitude: -1.201942,
    },
    openingHours: {
      monday: [],
      tuesday: [],
      wednesday: [{ open: "10:30", close: "12:30" }],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    },
  },
  {
    id: "st-thomas-more-middlesbrough-foodbank",
    name: "St Thomas More Church Foodbank",
    type: "Food",
    placeId: null,
    address:
      "St Thomas More Church, Kirkham Row, Middlesbrough TS4 3EE",
    coord: {
      latitude: 54.5496,
      longitude: -1.2144,
    },
    openingHours: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [{ open: "12:30", close: "14:30" }],
      friday: [],
      saturday: [],
      sunday: [],
    },
  },
  {
    id: "beacon-baptist-linthorpe-foodbank",
    name: "The Beacon Baptist Church Linthorpe Foodbank",
    type: "Food",
    placeId: null,
    address:
      "The Beacon Baptist Church, Cambridge Road, Middlesbrough TS5 5NN",
    coord: {
      latitude: 54.5612,
      longitude: -1.2555,
    },
    openingHours: {
      monday: [],
      tuesday: [{ open: "13:00", close: "15:00" }],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    },
  },
  {
    id: "south-bank-baptist-church-foodbank",
    name: "South Bank Baptist Church Foodbank",
    type: "Food",
    placeId: null,
    address:
      "South Bank Baptist Church, Redcar Road East, South Bank TS6 6PY",
    coord: {
      latitude: 54.579352,
      longitude: -1.171991,
    },
    openingHours: {
      monday: [],
      tuesday: [],
      wednesday: [{ open: "10:30", close: "12:30" }],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    },
  },
  {
    id: "st-georges-church-normanby-foodbank",
    name: "St George's Church Normanby Foodbank",
    type: "Food",
    placeId: null,
    address:
      "St George's Church, Spencer Road, Normanby TS6 9BH",
    coord: {
      latitude: 54.56297,
      longitude: -1.157971,
    },
    openingHours: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [{ open: "09:30", close: "12:00" }],
      saturday: [],
      sunday: [],
    },
  },
  {
    id: "st-hildas-grangetown-foodbank",
    name: "St Hilda's of Whitby Church Grangetown Foodbank",
    type: "Food",
    placeId: null,
    address:
      "St Hilda's of Whitby Church, Clynes Road, Grangetown TS6 7LY",
    coord: {
      latitude: 54.56867,
      longitude: -1.142943,
    },
    openingHours: {
      monday: [{ open: "11:00", close: "13:00" }],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    },
  },
  {
    id: "newcomen-methodist-church-redcar-foodbank",
    name: "Newcomen Methodist Church Redcar Foodbank",
    type: "Food",
    placeId: null,
    address:
      "Newcomen Methodist Church, Mersey Road, Redcar TS10 1NH",
    coord: {
      latitude: 54.607786,
      longitude: -1.077856,
    },
    openingHours: {
      monday: [{ open: "11:30", close: "13:00" }],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    },
  },
  {
    id: "st-peters-church-redcar-foodbank",
    name: "St Peter's Church Redcar Foodbank",
    type: "Food",
    placeId: null,
    address:
      "St Peter's Church, Lord Street, Redcar TS10 3JL",
    coord: {
      latitude: 54.615312,
      longitude: -1.059662,
    },
    openingHours: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [{ open: "11:00", close: "13:00" }],
      friday: [],
      saturday: [],
      sunday: [],
    },
  },
  {
    id: "zetland-park-methodist-church-foodbank",
    name: "Zetland Park Methodist Church Foodbank",
    type: "Food",
    placeId: null,
    address:
      "Zetland Park Methodist Church, The Crescent, Redcar TS10 3AU",
    coord: {
      latitude: 54.614188,
      longitude: -1.053803,
    },
    openingHours: {
      monday: [],
      tuesday: [],
      wednesday: [{ open: "10:45", close: "12:45" }],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    },
  },
  {
    id: "salvation-army-stockton-food-bank",
    name: "The Salvation Army Stockton Food Bank",
    type: "Food",
    placeId: null,
    address:
      "The Salvation Army, Palmerston Street, Stockton-on-Tees TS18 1NU",
    coord: {
      latitude: 54.5649236,
      longitude: -1.3178615,
    },
    openingHours: {
      monday: [{ open: "09:00", close: "12:00" }],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [{ open: "09:00", close: "12:00" }],
      saturday: [],
      sunday: [],
    },
  },
  {
    id: "billingham-stockton-food-bank-hebron-church",
    name: "Billingham and Stockton Food Bank Hebron Church",
    type: "Food",
    placeId: null,
    address:
      "Hebron Church, Corner of Vicarage Street and Bishopton Road, Stockton-on-Tees TS19 0AJ",
    coord: {
      latitude: 54.569004,
      longitude: -1.322281,
    },
    openingHours: {
      monday: [],
      tuesday: [],
      wednesday: [{ open: "10:00", close: "13:00" }],
      thursday: [],
      friday: [{ open: "10:00", close: "13:00" }],
      saturday: [],
      sunday: [],
    },
  },
  {
    id: "stockton-hope-community-larder",
    name: "Stockton Hope Community Larder",
    type: "Food",
    placeId: null,
    address:
      "St Andrew's Methodist Church, Hardwick, Stockton-on-Tees TS19 8DW",
    coord: {
      latitude: 54.5895,
      longitude: -1.3517,
    },
    openingHours: {
      monday: [],
      tuesday: [],
      wednesday: [{ open: "10:30", close: "12:30" }],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    },
  },
  {
    id: "hartlepool-food-bank",
    name: "Hartlepool Food Bank",
    type: "Food",
    placeId: null,
    address:
      "28 Church Street, Hartlepool TS24 7DH",
    coord: {
      latitude: 54.6862186,
      longitude: -1.2065355,
    },
    openingHours: {
      monday: [],
      tuesday: [{ open: "11:00", close: "13:30" }],
      wednesday: [],
      thursday: [],
      friday: [{ open: "11:00", close: "13:30" }],
      saturday: [],
      sunday: [],
    },
  },
  {
    id: "hartlepool-baby-bank",
    name: "Hartlepool Baby Bank",
    type: "Clothes",
    placeId: null,
    address:
      "Crown Buildings, Avenue Road, Hartlepool",
    coord: {
      latitude: 54.687327,
      longitude: -1.215014,
    },
    openingHours: {
      monday: [{ open: "10:00", close: "14:00" }],
      tuesday: [{ open: "10:00", close: "14:00" }],
      wednesday: [],
      thursday: [{ open: "10:00", close: "14:00" }],
      friday: [],
      saturday: [],
      sunday: [],
    },
  },
  {
    id: "west-view-advice-resource-centre",
    name: "West View Advice and Resource Centre",
    type: "Utilities",
    placeId: null,
    address:
      "The Community Centre, Miers Avenue, Hartlepool TS24 9JQ",
    coord: {
      latitude: 54.706724,
      longitude: -1.224216,
    },
    openingHours: {
      monday: [{ open: "09:00", close: "18:00" }],
      tuesday: [{ open: "09:30", close: "16:30" }],
      wednesday: [{ open: "09:00", close: "20:00" }],
      thursday: [{ open: "09:00", close: "18:00" }],
      friday: [{ open: "09:00", close: "13:00" }],
      saturday: [],
      sunday: [],
    },
  },
  {
    id: "hartlepool-community-grocery",
    name: "Hartlepool Community Grocery",
    type: "Food",
    placeId: null,
    address:
      "Oxford Road Baptist Church, Caledonian Road, Hartlepool TS25 5LH",
    coord: {
      latitude: 54.673839,
      longitude: -1.220794,
    },
    openingHours: {
      monday: [{ open: "09:30", close: "16:30" }],
      tuesday: [{ open: "09:30", close: "16:30" }],
      wednesday: [{ open: "09:30", close: "16:30" }],
      thursday: [{ open: "09:30", close: "16:30" }],
      friday: [{ open: "09:30", close: "16:30" }],
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

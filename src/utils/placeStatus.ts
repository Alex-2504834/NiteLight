import { DayName, PlaceOpeningHours, OpeningPeriod } from "../services/places";

export type PlaceStatus = "open" | "opensSoon" | "closingSoon" | "closed";

export type PlaceBrightnessInfo = {
  status: PlaceStatus;
  brightness: number;
};

const dayNames: DayName[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const MINUTES_BEFORE_OPEN = 30;
const MINUTES_BEFORE_CLOSE = 60;

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getPreviousDayName(date: Date) {
  const previousDayIndex = (date.getDay() + 6) % 7;
  return dayNames[previousDayIndex];
}

function getTodayPeriods(openingHours: PlaceOpeningHours, date: Date) {
  const todayName = dayNames[date.getDay()];
  return openingHours[todayName] ?? [];
}

function getYesterdayOvernightPeriods(
  openingHours: PlaceOpeningHours,
  date: Date
): OpeningPeriod[] {
  const yesterdayName = getPreviousDayName(date);

  return (openingHours[yesterdayName] ?? []).filter(period => {
    const openMinutes = timeToMinutes(period.open);
    const closeMinutes = timeToMinutes(period.close);

    return closeMinutes <= openMinutes;
  });
}

export function getPlaceBrightness(
  openingHours: PlaceOpeningHours,
  date = new Date()
): PlaceBrightnessInfo {
  const nowMinutes = date.getHours() * 60 + date.getMinutes();

  const todayPeriods = getTodayPeriods(openingHours, date);
  const yesterdayOvernightPeriods = getYesterdayOvernightPeriods(
    openingHours,
    date
  );

  for (const period of yesterdayOvernightPeriods) {
    const closeMinutes = timeToMinutes(period.close);

    if (nowMinutes < closeMinutes) {
      const minutesUntilClose = closeMinutes - nowMinutes;

      if (minutesUntilClose <= MINUTES_BEFORE_CLOSE) {
        return {
          status: "closingSoon",
          brightness: clampPercent(
            (minutesUntilClose / MINUTES_BEFORE_CLOSE) * 100
          ),
        };
      }

      return {
        status: "open",
        brightness: 100,
      };
    }
  }

  for (const period of todayPeriods) {
    const openMinutes = timeToMinutes(period.open);
    const rawCloseMinutes = timeToMinutes(period.close);

    const closesTomorrow = rawCloseMinutes <= openMinutes;
    const closeMinutes = closesTomorrow
      ? rawCloseMinutes + 24 * 60
      : rawCloseMinutes;

    const adjustedNowMinutes =
      closesTomorrow && nowMinutes < rawCloseMinutes
        ? nowMinutes + 24 * 60
        : nowMinutes;

    const isOpen =
      adjustedNowMinutes >= openMinutes && adjustedNowMinutes < closeMinutes;

    if (isOpen) {
      const minutesUntilClose = closeMinutes - adjustedNowMinutes;

      if (minutesUntilClose <= MINUTES_BEFORE_CLOSE) {
        return {
          status: "closingSoon",
          brightness: clampPercent(
            (minutesUntilClose / MINUTES_BEFORE_CLOSE) * 100
          ),
        };
      }

      return {
        status: "open",
        brightness: 100,
      };
    }

    const minutesUntilOpen = openMinutes - nowMinutes;

    if (
      minutesUntilOpen > 0 &&
      minutesUntilOpen <= MINUTES_BEFORE_OPEN
    ) {
      return {
        status: "opensSoon",
        brightness: clampPercent(
          ((MINUTES_BEFORE_OPEN - minutesUntilOpen) /
            MINUTES_BEFORE_OPEN) *
            100
        ),
      };
    }
  }

  return {
    status: "closed",
    brightness: 0,
  };
}

export function getPlaceStatus(
  openingHours: PlaceOpeningHours,
  date = new Date()
): PlaceStatus {
  return getPlaceBrightness(openingHours, date).status;
}
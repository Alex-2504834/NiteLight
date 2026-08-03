import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { PropsWithChildren } from "react";

export type ThemePreference = "system" | "light" | "dark";

type AppPreferences = {
  themePreference: ThemePreference;
  openMapOnLaunch: boolean;
  centreOnLocation: boolean;
};

type AppPreferencesContextValue = AppPreferences & {
  isReady: boolean;
  setThemePreference: (preference: ThemePreference) => void;
  setOpenMapOnLaunch: (enabled: boolean) => void;
  setCentreOnLocation: (enabled: boolean) => void;
  resetPreferences: () => Promise<void>;
};

const STORAGE_KEY = "@nitelight/app-preferences";

const defaultPreferences: AppPreferences = {
  themePreference: "system",
  openMapOnLaunch: false,
  centreOnLocation: true,
};

const AppPreferencesContext = createContext<AppPreferencesContextValue | null>(
  null
);

function isThemePreference(value: unknown): value is ThemePreference {
  return value === "system" || value === "light" || value === "dark";
}

function parseStoredPreferences(value: string | null): AppPreferences {
  if (!value) return defaultPreferences;

  try {
    const parsed = JSON.parse(value) as Partial<AppPreferences>;

    return {
      themePreference: isThemePreference(parsed.themePreference)
        ? parsed.themePreference
        : defaultPreferences.themePreference,
      openMapOnLaunch:
        typeof parsed.openMapOnLaunch === "boolean"
          ? parsed.openMapOnLaunch
          : defaultPreferences.openMapOnLaunch,
      centreOnLocation:
        typeof parsed.centreOnLocation === "boolean"
          ? parsed.centreOnLocation
          : defaultPreferences.centreOnLocation,
    };
  } catch {
    return defaultPreferences;
  }
}

export function AppPreferencesProvider({ children }: PropsWithChildren) {
  const [preferences, setPreferences] =
    useState<AppPreferences>(defaultPreferences);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadPreferences() {
      try {
        const storedValue = await AsyncStorage.getItem(STORAGE_KEY);

        if (isMounted) {
          setPreferences(parseStoredPreferences(storedValue));
        }
      } catch (error) {
        console.warn("Failed to load app preferences:", error);
      } finally {
        if (isMounted) {
          setIsReady(true);
        }
      }
    }

    loadPreferences();

    return () => {
      isMounted = false;
    };
  }, []);

  const updatePreferences = useCallback(
    (update: Partial<AppPreferences>) => {
      setPreferences(current => {
        const next = { ...current, ...update };

        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(error => {
          console.warn("Failed to save app preferences:", error);
        });

        return next;
      });
    },
    []
  );

  const setThemePreference = useCallback(
    (themePreference: ThemePreference) => {
      updatePreferences({ themePreference });
    },
    [updatePreferences]
  );

  const setOpenMapOnLaunch = useCallback(
    (openMapOnLaunch: boolean) => {
      updatePreferences({ openMapOnLaunch });
    },
    [updatePreferences]
  );

  const setCentreOnLocation = useCallback(
    (centreOnLocation: boolean) => {
      updatePreferences({ centreOnLocation });
    },
    [updatePreferences]
  );

  const resetPreferences = useCallback(async () => {
    setPreferences(defaultPreferences);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo<AppPreferencesContextValue>(
    () => ({
      ...preferences,
      isReady,
      setThemePreference,
      setOpenMapOnLaunch,
      setCentreOnLocation,
      resetPreferences,
    }),
    [
      isReady,
      preferences,
      resetPreferences,
      setCentreOnLocation,
      setOpenMapOnLaunch,
      setThemePreference,
    ]
  );

  return (
    <AppPreferencesContext.Provider value={value}>
      {children}
    </AppPreferencesContext.Provider>
  );
}

export function useAppPreferences() {
  const context = useContext(AppPreferencesContext);

  if (!context) {
    throw new Error(
      "useAppPreferences must be used inside AppPreferencesProvider."
    );
  }

  return context;
}

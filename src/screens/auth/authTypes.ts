export type AuthMode = "choice" | "signup" | "login" | "platforms";

export type SignUpStep = 1 | 2;

export type FieldErrors = {
  email?: string;
  phoneNumber?: string;
  password?: string;
  username?: string;
  displayName?: string;
  loginUsername?: string;
  loginPassword?: string;
  general?: string;
};

export type CountryCode = {
  label: string;
  code: string;
  flag: string;
};

export type AuthActionRunner = (action: () => Promise<unknown>) => void;

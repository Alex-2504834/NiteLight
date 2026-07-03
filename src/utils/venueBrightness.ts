export type VenueBrightnessState =
  | 'open'
  | 'closed'
  | 'opensSoon'
  | 'closesSoon';

type GetVenueBrightnessParams = {
  now?: Date;
  opensAt: Date;
  closesAt: Date;
  minutesBeforeOpen?: number;
  minutesBeforeClose?: number;
};

export function getVenueBrightness({
  now = new Date(),
  opensAt,
  closesAt,
  minutesBeforeOpen = 30,
  minutesBeforeClose = 60,
}: GetVenueBrightnessParams): {
  brightness: number;
  state: VenueBrightnessState;
} {
  const nowMs = now.getTime();
  const opensMs = opensAt.getTime();
  const closesMs = closesAt.getTime();

  const isOpen = nowMs >= opensMs && nowMs < closesMs;

  const minsUntilOpen = (opensMs - nowMs) / 60000;
  const minsUntilClose = (closesMs - nowMs) / 60000;

  if (isOpen && minsUntilClose > 0 && minsUntilClose <= minutesBeforeClose) {
    return {
      brightness: Math.round((minsUntilClose / minutesBeforeClose) * 100),
      state: 'closesSoon',
    };
  }

  if (!isOpen && minsUntilOpen > 0 && minsUntilOpen <= minutesBeforeOpen) {
    return {
      brightness: Math.round(
        ((minutesBeforeOpen - minsUntilOpen) / minutesBeforeOpen) * 100
      ),
      state: 'opensSoon',
    };
  }

  if (isOpen) {
    return {
      brightness: 100,
      state: 'open',
    };
  }

  return {
    brightness: 0,
    state: 'closed',
  };
}
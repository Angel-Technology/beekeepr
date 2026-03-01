type HexColor = `#${string}`;
type RgbaColor = `rgba(${string})`;
export type ColorValue = HexColor | RgbaColor;

type BrandColors = {
  readonly primary: ColorValue;
  readonly secondary: ColorValue;
  readonly tertiary: ColorValue;
  readonly accent: ColorValue;
};

type TextColors = {
  readonly inverse: ColorValue;
  readonly inverseSubtle: ColorValue;
  readonly weak: ColorValue;
  readonly default: ColorValue;
  readonly secondary: ColorValue;
  readonly strong: ColorValue;
  readonly primary: ColorValue;
  readonly critical: ColorValue;
  readonly warning: ColorValue;
  readonly success: ColorValue;
  readonly informational: ColorValue;
  readonly actionEmphasis: ColorValue;
  readonly disabled: ColorValue;
};

type BackgroundColors = {
  readonly default: ColorValue;
  readonly weak: ColorValue;
  readonly medium: ColorValue;
  readonly strong: ColorValue;
  readonly primary: ColorValue;
  readonly primarySubtle: ColorValue;
  readonly critical: ColorValue;
  readonly criticalSubtle: ColorValue;
  readonly warning: ColorValue;
  readonly warningSubtle: ColorValue;
  readonly success: ColorValue;
  readonly successSubtle: ColorValue;
  readonly informational: ColorValue;
  readonly informationalSubtle: ColorValue;
  readonly disabled: ColorValue;
  readonly disabledSubtle: ColorValue;
  readonly mutedSubtle: ColorValue;
  readonly mutedWeak: ColorValue;
  readonly mutedMedium: ColorValue;
  readonly mutedStrong: ColorValue;
};

type BorderColors = {
  readonly inverse: ColorValue;
  readonly subtle: ColorValue;
  readonly weak: ColorValue;
  readonly default: ColorValue;
  readonly strong: ColorValue;
  readonly primary: ColorValue;
  readonly primarySubtle: ColorValue;
  readonly critical: ColorValue;
  readonly warning: ColorValue;
  readonly success: ColorValue;
  readonly informational: ColorValue;
  readonly disabled: ColorValue;
};

type ActionTextColors = {
  readonly default: ColorValue;
  readonly hover: ColorValue;
  readonly onAction: ColorValue;
};

type ActionBackgroundColors = {
  readonly solid: ColorValue;
  readonly solidHover: ColorValue;
  readonly tinted: ColorValue;
  readonly tintedHover: ColorValue;
};

type ActionBorderColors = {
  readonly default: ColorValue;
  readonly hover: ColorValue;
};

type ActionIntent = {
  readonly text: ActionTextColors;
  readonly background: ActionBackgroundColors;
  readonly border: ActionBorderColors;
};

type DisabledActionColors = {
  readonly text: ColorValue;
  readonly background: ColorValue;
  readonly border: ColorValue;
};

type ActionColors = {
  readonly brand: ActionIntent;
  readonly brandDynamic: ActionIntent;
  readonly neutral: ActionIntent;
  readonly disabled: DisabledActionColors;
};

export type Colors = {
  readonly brand: BrandColors;
  readonly text: TextColors;
  readonly bg: BackgroundColors;
  readonly border: BorderColors;
  readonly action: ActionColors;
};

export const colors: Colors = {
  brand: {
    primary: '#FFBF00',
    secondary: '#FFF8CB',
    tertiary: '#E5AC03',
    accent: '#000000',
  },
  text: {
    inverse: '#FFFFFF',
    inverseSubtle: 'rgba(0, 0, 0, 0.3)',
    weak: 'rgba(0, 0, 0, 0.5)',
    default: '#000000',
    secondary: 'rgba(0, 0, 0, 0.7)',
    strong: '#000000',
    primary: '#E5AC03',
    critical: '#FF0000',
    warning: '#FFBF00',
    success: '#00A93E',
    informational: '#1489E6',
    actionEmphasis: '#E5AC03',
    disabled: 'rgba(0, 0, 0, 0.35)',
  },
  bg: {
    default: '#FFFFFF',
    weak: '#EEEEEE',
    medium: '#DDDDDD',
    strong: '#000000',
    primary: '#FFBF00',
    primarySubtle: '#FFF8CB',
    critical: '#FF0000',
    criticalSubtle: 'rgba(0, 0, 0, 0.08)',
    warning: '#FFBF00',
    warningSubtle: '#F7E6A7',
    success: '#00A93E',
    successSubtle: 'rgba(0, 0, 0, 0.08)',
    informational: '#1489E6',
    informationalSubtle: 'rgba(0, 0, 0, 0.08)',
    disabled: 'rgba(0, 0, 0, 0.08)',
    disabledSubtle: 'rgba(0, 0, 0, 0.08)',
    mutedSubtle: 'rgba(0, 0, 0, 0.08)',
    mutedWeak: '#EEEEEE',
    mutedMedium: '#DDDDDD',
    mutedStrong: '#000000',
  },
  border: {
    inverse: '#FFFFFF',
    subtle: 'rgba(0, 0, 0, 0.08)',
    weak: 'rgba(0, 0, 0, 0.16)',
    default: 'rgba(0, 0, 0, 0.32)',
    strong: '#000000',
    primary: '#FFBF00',
    primarySubtle: '#FFF8CB',
    critical: '#FF0000',
    warning: '#FFBF00',
    success: '#00A93E',
    informational: '#1489E6',
    disabled: 'rgba(0, 0, 0, 0.2)',
  },
  action: {
    brand: {
      text: {
        default: '#000000',
        hover: 'rgba(0, 0, 0, 0.5)',
        onAction: '#FFFFFF',
      },
      background: {
        solid: '#FFBF00',
        solidHover: '#E5AC03',
        tinted: '#FFF8CB',
        tintedHover: '#F7E6A7',
      },
      border: {
        default: '#FFF8CB',
        hover: '#FFBF00',
      },
    },
    brandDynamic: {
      text: {
        default: '#000000',
        hover: 'rgba(0, 0, 0, 0.5)',
        onAction: '#FFFFFF',
      },
      background: {
        solid: '#FFBF00',
        solidHover: '#E5AC03',
        tinted: '#FFF8CB',
        tintedHover: '#F7E6A7',
      },
      border: {
        default: '#E5AC03',
        hover: '#FFBF00',
      },
    },
    neutral: {
      text: {
        default: 'rgba(0, 0, 0, 0.7)',
        hover: '#000000',
        onAction: '#FFFFFF',
      },
      background: {
        solid: '#000000',
        solidHover: 'rgba(0, 0, 0, 0.7)',
        tinted: 'rgba(0, 0, 0, 0.08)',
        tintedHover: 'rgba(0, 0, 0, 0.16)',
      },
      border: {
        default: 'rgba(0, 0, 0, 0.3)',
        hover: '#000000',
      },
    },
    disabled: {
      text: 'rgba(0, 0, 0, 0.35)',
      background: 'rgba(0, 0, 0, 0.08)',
      border: 'rgba(0, 0, 0, 0.2)',
    },
  },
};

export type BrandColorKey = keyof Colors['brand'];
export type TextColorKey = keyof Colors['text'];
export type BackgroundColorKey = keyof Colors['bg'];
export type BorderColorKey = keyof Colors['border'];
export type ActionIntentKey = Exclude<keyof Colors['action'], 'disabled'>;

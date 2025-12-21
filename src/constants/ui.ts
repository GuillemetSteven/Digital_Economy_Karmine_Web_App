/**
 * UI Constants
 * Centralizes all magic numbers and configuration values used across the application
 */

export const ZOOM = {
  MIN: 1,
  MAX: 3,
  STEP: 0.25,
  DEFAULT: 1,
} as const;

export const ANIMATIONS = {
  FADE_DURATION: 300,
  HOVER_DELAY: 50,
  TRANSITION_DURATION: 500,
} as const;

export const IMAGE_BRIGHTNESS = {
  /** Threshold for considering an image as "light" (0-255 scale) */
  LIGHT_THRESHOLD: 127,
  /** Canvas sample size for brightness detection */
  SAMPLE_SIZE: 100,
} as const;

export const LIGHTBOX = {
  /** Maximum image container size percentage */
  MAX_IMAGE_SIZE: 90,
  /** Navigation button size in pixels */
  NAV_BUTTON_SIZE: 28,
  /** Zoom controls icon size in pixels */
  ZOOM_ICON_SIZE: 16,
} as const;

export const FUZZY_SEARCH = {
  /** Score for a single character match */
  CHAR_MATCH: 1,
  /** Bonus for consecutive character matches */
  CONSECUTIVE_BONUS: 2,
  /** Bonus for matching at word start */
  WORD_START_BONUS: 5,
} as const;

export const BREAKPOINTS = {
  MOBILE: 640,
  TABLET: 768,
  DESKTOP: 1024,
  WIDE: 1280,
} as const;

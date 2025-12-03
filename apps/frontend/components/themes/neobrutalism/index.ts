/**
 * Neobrutalism Theme
 *
 * Bold, playful style with offset shadows and pink accents.
 * Features:
 * - 4px offset shadows
 * - 2px solid borders
 * - Rounded corners (16px)
 * - System fonts with bold weights
 * - Pink accent color (#ff90e8)
 */

import { THEMES } from '@/lib/themes';
import type { ThemeRegistration } from '../base/types';
import {
  TitleSlide,
  ContentSlide,
  BulletsSlide,
  QuoteSlide,
  SectionSlide,
  ChartSlide,
} from './slides';

export const neobrutalismTheme: ThemeRegistration = {
  config: THEMES.neobrutalism,
  components: {
    TitleSlide,
    ContentSlide,
    BulletsSlide,
    QuoteSlide,
    SectionSlide,
    ChartSlide,
  },
};

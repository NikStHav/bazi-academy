// Content packs per language (English is the source and lives in the modules themselves).
// Each pack has the same shape as the German one; a missing entry falls back to English.
import { lang } from '../i18n.js';
import * as DE_DATA from './de-data.js';
import * as ES_DATA from './es-data.js';
import * as DE_MISC from './de-misc.js';
import * as ES_MISC from './es-misc.js';
import * as DE_READING from './de-reading.js';
import * as ES_READING from './es-reading.js';
import { DAY_PILLARS as DE_DAY } from './daypillars-de.js';
import { DAY_PILLARS as ES_DAY } from './daypillars-es.js';
import { LESSONS_1 as DE_L1 } from './lessons-de-1.js';
import { LESSONS_2 as DE_L2 } from './lessons-de-2.js';
import { LESSONS_1 as ES_L1 } from './lessons-es-1.js';
import { LESSONS_2 as ES_L2 } from './lessons-es-2.js';
import * as ES_EXTRA from './es-extra.js';

const pickPack = (o) => o[lang] || null;
export const DATA = pickPack({ de: DE_DATA, es: ES_DATA });
export const MISC = pickPack({ de: DE_MISC, es: ES_MISC });
export const READING = pickPack({ de: DE_READING, es: ES_READING });
export const DAY_PILLARS = pickPack({ de: DE_DAY, es: ES_DAY });
export const LESSONS = pickPack({ de: [...DE_L1, ...DE_L2], es: [...ES_L1, ...ES_L2] });
/** Texts that are kept inline for German (stages, hour deities, guide, day-card themes). */
export const EXTRA = pickPack({ es: ES_EXTRA });

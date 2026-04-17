// Экспортируем все команды

import * as create from './create/index.mjs';
import * as injectComponentStyle from './injectComponentStyle.mjs';
import * as base64Converter from './base64Converter.mjs';
import * as imagemin from './imagemin.mjs';

export const COMMANDS = [create, injectComponentStyle, base64Converter, imagemin];

// Экспортируем все команды

import * as create from './create/index.js';
import * as injectComponentStyle from './injectComponentStyle.js';
import * as base64Converter from './base64Converter.js';
import * as imagemin from './imagemin.js';

export const COMMANDS = [create, injectComponentStyle, base64Converter, imagemin];

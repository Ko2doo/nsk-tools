// Export all commands
import type { CommandModule } from 'yargs';

import * as create from './create/index.js';
import * as importCmd from './import/index.js';
import * as base64Converter from './base64Converter.js';
import * as imagemin from './imagemin.js';

type AnyYargsCommand = CommandModule<object, object>;

export const COMMANDS: AnyYargsCommand[] = [
  create as AnyYargsCommand,
  importCmd as AnyYargsCommand,
  base64Converter as AnyYargsCommand,
  imagemin as AnyYargsCommand,
];

import type { Argv } from 'yargs';

import * as style from './styles.js';

export const command = 'import <command>';
export const describe = 'Импортировать (style, и т.д.)';

export const builder = (yargs: Argv): Argv => {
  /*prettier-ignore*/
  return yargs
    .command(style)
    .demandCommand()
    .strict();
};

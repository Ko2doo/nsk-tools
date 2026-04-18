import type { Argv } from 'yargs';

import * as archive from './archive.js';
import * as component from './component.js';

export const command = 'create <entity>';
export const describe = 'Создать сущности (component, archive, и т.д.)';

export const builder = (yargs: Argv): Argv => {
  /*prettier-ignore*/
  return yargs
    .command(archive)
    .command(component)
    .demandCommand()
    .strict();
};

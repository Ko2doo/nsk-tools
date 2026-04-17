import * as archive from './archive.mjs';
import * as component from './component.mjs';

export const command = 'create <entity>';
export const describe = 'Создать сущности (component, archive, и т.д.)';

export const builder = (yargs) => {
  /*prettier-ignore*/
  return yargs
    .command(archive)
    .command(component)
    .demandCommand()
    .strict();
};

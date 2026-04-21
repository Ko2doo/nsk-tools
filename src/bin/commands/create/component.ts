import type { Argv, ArgumentsCamelCase } from 'yargs';
import type { ComponentAppOption } from '../../@types/component.js';

export const command = 'component <names..>';
export const describe = `
  Создание njk компонента и необходимых файлов.

  Доступно пакетное создание файлов компонент,
  просто передайте имя нового компонента отделив его пробелом пример:
    $ npx nsk-tools create component Header Footer

  Полная команда:
    $ npx nsk-tools create component Header
  `.trim();

export const builder = (yargs: Argv): Argv<ComponentAppOption> => {
  yargs.positional('names', {
    type: 'string',
    array: true,
    describe: 'Названия создаваемых компонентов через пробел.',
    demandOption: true,
  });

  return yargs as Argv<ComponentAppOption>;
};

export const handler = async (argv: ArgumentsCamelCase<ComponentAppOption>): Promise<void> => {
  const { default: createComponentApp } = await import('../../utils/createComponentApp.js');

  await createComponentApp({
    names: argv.names,
  });

  // console.log(argv);
};

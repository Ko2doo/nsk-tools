import type { Argv, ArgumentsCamelCase } from 'yargs';
import type { ComponentAppOption } from '../../@types/component.js';

export const command = 'component <name>';
export const describe = `
  Создание njk компонента.

  Опции:
    -n или --name для указания названия создаваемого компонента.

  Полная команда:
    $ npx nsk-tools create component Header
  `.trim();

export const builder = (yargs: Argv): Argv<ComponentAppOption> => {
  yargs.positional('name', {
    type: 'string',
    describe: 'Название создаваемого компонента',
    demandOption: true,
  });

  return yargs as Argv<ComponentAppOption>;
};

export const handler = async (argv: ArgumentsCamelCase<ComponentAppOption>): Promise<void> => {
  const { default: createComponentApp } = await import('../../utils/createComponentApp.js');

  await createComponentApp({
    name: argv.name.trim(),
  });

  // console.log(argv);
};

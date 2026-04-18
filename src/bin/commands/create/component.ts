import type { Argv, ArgumentsCamelCase } from 'yargs';

// Type from command args
interface ComponentArgv {
  name: string;
}

export const command = 'component <name>';
export const describe = `
  Создание njk компонента.

  Опции:
    -n или --name для указания названия создаваемого компонента.

  Полная команда:
    $ npx nsk-tools create component Header
  `.trim();

export const builder = (yargs: Argv): Argv<ComponentArgv> => {
  yargs.positional('name', {
    type: 'string',
    describe: 'Название создаваемого компонента',
    demandOption: true,
  });

  return yargs as Argv<ComponentArgv>;
};

export const handler = async (argv: ArgumentsCamelCase<ComponentArgv>): Promise<void> => {
  const { default: createComponentApp } = await import('../../utils/createComponentApp.js');

  await createComponentApp({
    name: argv.name.trim(),
  });

  // console.log(argv);
};

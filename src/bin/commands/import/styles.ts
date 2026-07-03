import type { Argv, ArgumentsCamelCase } from 'yargs';
import type { InjectStyleAppOption } from '../../@types/styles.js';

export const command = 'style <names..>';
export const describe = `
  Импорт файла стилей компонента в _components_import.scss.
  При использовании не нужно указывать путь до файла стилей компонента,
  не нужно указывать расширение,
  необходимо передать название компонента.

  Доступно пакетный импорт стилей компонент,
  просто передайте имя нового импортируемого компонента отделив его пробелом пример:
    $ npx nsk-tools import style Header Footer

  Полная команда:
    $ npx nsk-tools import style Header
  `.trim();

export const builder = (yargs: Argv): Argv<InjectStyleAppOption> => {
  yargs.positional('names', {
    type: 'string',
    array: true,
    describe: 'Название импортируемых файлов (без расширения файла!)',
    demandOption: true,
  });

  return yargs as Argv<InjectStyleAppOption>;
};

export const handler = async (argv: ArgumentsCamelCase<InjectStyleAppOption>): Promise<void> => {
  const { default: injectComponentStyleApp } = await import('../../utils/injectComponentStyleApp.js');

  await injectComponentStyleApp({
    names: argv.names,
  });

  // console.log(argv);
};

import type { Argv, ArgumentsCamelCase } from 'yargs';
import type { InjectStyleAppOption } from '../@types/injectComponentStyle.js';

export const command = 'import';
export const describe = `
  Импорт файла стилей компонента в _components_import.scss.
  При использовании не нужно указывать путь до файла стилей компонента, не нужно указывать расширение, необходимо передать только название компонента т.к. файл стилей имеет аналагичное название.

  Опции:
    -s или --style - для указания названия файла стилей компонента.

  Полная команда:
    $ npx nsk-tools import --s Header
  `.trim();

export const builder = (yargs: Argv): Argv<InjectStyleAppOption> => {
  // Опция для передачи названия файла стилей
  yargs.option('style', {
    alias: 's',
    type: 'string',
    describe: 'задать название импортируемого файла (без расширения файла!)',
  });

  // необходимые опции для работы команды, иначе ошибка
  yargs.demandOption(
    'style',
    'Передайте вторым аргументом ключевую опцию style, и после название импортируемого файла стилей компонента.',
  );

  return yargs as Argv<InjectStyleAppOption>;
};

export const handler = async (argv: ArgumentsCamelCase<InjectStyleAppOption>): Promise<void> => {
  const { default: injectComponentStyleApp } = await import('../utils/injectComponentStyleApp.js');

  await injectComponentStyleApp({
    value: argv.style.trim(),
  });

  // console.log(argv);
};

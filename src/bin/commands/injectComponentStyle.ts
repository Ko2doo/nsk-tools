import type { Argv, ArgumentsCamelCase } from 'yargs';

interface InjectStyle {
  style: string;
}

export const command = 'import';
export const describe = `
  Импорт файла стилей компонента в _components_import.scss.
  При использовании не нужно указывать путь до файла стилей компонента, не нужно указывать расширение, необходимо передать только название компонента т.к. файл стилей имеет аналагичное название.

  Опции:
    -s или --style - для указания названия файла стилей компонента.

  Полная команда:
    $ npx nsk-tools import --s Header
  `.trim();

export const builder = (yargs: Argv): Argv<InjectStyle> => {
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

  return yargs as Argv<InjectStyle>;
};

export const handler = async (argv: ArgumentsCamelCase<InjectStyle>): Promise<void> => {
  const { default: injectComponentStyleApp } = await import('../utils/injectComponentStyleApp.js');

  await injectComponentStyleApp({
    value: argv.style.trim(),
  });

  // console.log(argv);
};

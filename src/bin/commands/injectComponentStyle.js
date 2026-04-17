// команда import -s --style style_name

export const command = 'import';
export const describe = `
  Импорт файла стилей компонента в _components_import.scss.
  При использовании не нужно указывать путь до файла стилей компонента, не нужно указывать расширение, необходимо передать только название компонента т.к. файл стилей имеет аналагичное название.

  Опции:
    -s или --style - для указания названия файла стилей компонента.

  Полная команда:
    $ node ./cli-app/cli-tools.mjs import -s Header
  `.trim();

export const builder = (yargs) => {
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
};

export const handler = async (argv) => {
  const { default: injectComponentStyleApp } = await import('../utils/injectComponentStyleApp.js');

  await injectComponentStyleApp({
    value: String(argv.style ?? '').trim(),
  });

  // console.log(argv);
};

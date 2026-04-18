import type { Argv, ArgumentsCamelCase } from 'yargs';
import type { ArchiveAppOption } from '../../@types/archive.js';

export const command = 'archive';
export const describe = `
    Архивирование файлов и директорий проекта.
    Возможно создание архивов формата tar.gz, tar, zip.
    Для создания архива необходимо указать опцию после команды, ей в свою очередь передать один из трёх параметров {tar, tgz, zip} и указать путь до дир-рии которую необходимо заархивировать.

    Опции:
      -o или --option - указываем после опции формат архива;
      -p или --path - глобальная опция, необходимая для указания пути;

    Аргументы:
      tgz - создаст архив с расширением tar.gz;
      tar - создаст архив с рашрирением tar;
      zip - создаст архив с расширением zip;

    Полная команда:
    $ npx nsk-tools create archive -o tgz -p build
  `.trim();

export const builder = (yargs: Argv): Argv<ArchiveAppOption> => {
  // Опция для указания формата архива
  yargs.option('options', {
    alias: 'o',
    type: 'string',
    choices: ['tgz', 'tar', 'zip'] as const, // выбор дополнительных опций
    describe: `
      после ввода -o или --options, введите в каком формате необходимо создать архив.

      Аргументы опции:
        tgz - создаст архив с расширением tar.gz;
        tar - создаст архив с рашрирением tar;
        zip - создаст архив с расширением zip`.trim(),
  });

  // необходимые опции для работы команды, иначе ошибка
  yargs.demandOption(
    ['options', 'path'],
    'Пожалуйста укажите опции архиватора и путь или название дир-рии что-бы создать архив.',
  );

  return yargs as Argv<ArchiveAppOption>;
};

export const handler = async (argv: ArgumentsCamelCase<ArchiveAppOption>): Promise<void> => {
  const { default: createArchiveApp } = await import('../../utils/createArchiveApp.js');

  await createArchiveApp({
    options: argv.options,
    path: argv.path,
  });

  // Debug
  // console.log(argv);
};

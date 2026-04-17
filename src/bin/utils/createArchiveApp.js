import {
  KITSYS as system,
  KITPLUGIN as plugin,
  KITCONFIG as config,
  CREATE_ARCHIVE as create_archive,
  errorThrower,
} from '../config/config.js';

const createArchiveApp = async ({ options, path }) => {
  try {
    const archive_mode = options;
    const get_dir_path = path;

    // debugging
    // console.log(`
    //   ${archive_mode} - формат архива переданный пользователем
    //   ${get_dir_path} - название и путь до архивируемой дир-рии
    //   `);

    // Валидация входных аргументов
    if (
      archive_mode === undefined ||
      archive_mode === null ||
      get_dir_path === undefined ||
      get_dir_path === null ||
      get_dir_path === ''
    ) {
      const badOptionErrorMsg = plugin.chalk.yellow(
        `
          ${plugin.chalk.bgRedBright.white('Ошибка!')}

          Для создания архива необходимо воспользоваться командой archive
          Далее передаём дополнительные команды после -o или --options:
            tgz - для создания tar.gz архива
            tar - для создания тарболла
            zip - для создания обычного zip архива

          Далее воспользуйтесь командой -p или --path для передачи после,
          названия дир-рии которую необходимо заархивировать.

          Для архивации корневой директории (директория с файлами всего проекта): -p . или -p ./

          Пример полной команды:
          $ npx nsk-tools create archive -o tgz -p build
          `,
      );

      errorThrower(badOptionErrorMsg);
    }

    // Абсолютный путь используем только для I/O
    // (проверка, вычисление родителя и имени каталога)
    const absDir = system.node_path.resolve(get_dir_path);

    // Проверяем, что каталог существует и это директория
    const st = await system.fsPromises.stat(absDir).catch(() => null);
    if (!st || !st.isDirectory()) {
      return errorThrower(`Каталог не найден или не является директорией: ${absDir}`);
    }

    // Логи
    console.log(plugin.chalk.bgBlue('################################################'));
    console.log('Переданы аргументы:');
    console.log(`=>  Формат архива          : ${plugin.chalk.green(archive_mode)}`);
    console.log(`=>  Имя и путь до дир-рии  : ${plugin.chalk.green(get_dir_path)}`);
    console.log('=>  Архивирую...');
    console.log(plugin.chalk.bgBlue('################################################'));

    // console.log(`
    //   ${archive_mode} - формат архива переданный пользователем
    //   ${absDir} - название и путь до архивируемой дир-рии
    //   `);

    // функция создания архива, передаем в неё 3 параметра:
    // 1 - коллекцию объектов массива с параметрами для архиватора
    // 2 - опцию о расширении архива {tgz, tar, zip} (получаем из консоли)
    // 3 - имя директории, так-же получаем из консоли (то что ввёл пользователь)
    create_archive(config.archive, archive_mode, absDir);
  } catch (error) {
    console.error(error.message);
  }
};

export default createArchiveApp;

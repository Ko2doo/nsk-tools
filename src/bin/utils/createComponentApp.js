// Утилита для создания компонента
import {
  KITSYS as system,
  KITPLUGIN as plugin,
  KITCONFIG as cfg,
  CREATE_FILES as createFiles,
  errorThrower,
} from '../config/config.js';

const createComponentApp = async ({ name }) => {
  try {
    if (!name) {
      return errorThrower(`
        ${plugin.chalk.bgRedBright.white('Ошибка!')}

        Не передано имя компонента.
        Пример:
        $ npx nsk-tools create component Header
        `);
    }

    // Разрешаем: латиница/цифры/_/- ; начинаться с буквы
    if (!/^[A-Za-z][A-Za-z0-9_-]*$/.test(name)) {
      return errorThrower(`
          Некорректное имя компонента "${name}".
          Разрешены: латинские буквы, цифры, "_" и "-"; имя должно начинаться с буквы.
        `);
    }

    // пути
    const component_dir = cfg.template.spawn_dir(name);
    const data_dir = cfg.template.data_dir;

    const component_dir_absolute = system.node_path.resolve(component_dir);
    const data_dir_absolute = system.node_path.resolve(data_dir);

    // Для логов
    const component_out_dir_log = system.node_path.join(component_dir, system.node_path.basename(name));
    const data_out_dir_log = system.node_path.join(data_dir, system.node_path.basename(name));

    // проверка на дубликаты
    try {
      const st = await system.fsPromises.stat(component_dir_absolute);

      if (st.isDirectory()) {
        return errorThrower(`Компонент ${name} уже существует: ${component_out_dir_log}`);
      } else {
        return errorThrower(`Путь существует, но это не директория: ${component_out_dir_log}`);
      }
    } catch (error) {
      // ENOENT - директории нет, можно создавать; прочее - пробрасываем
      if (error.code !== 'ENOENT') return errorThrower(error);
    }

    // Гарантируем наличие директорий
    await system.fsPromises.mkdir(component_dir_absolute, { recursive: true });
    await system.fsPromises.mkdir(data_dir_absolute, { recursive: true });

    // Списки файлов для генерации
    const files_collection = [
      // Шаблон компонента: <name>.njk
      `${name}${cfg.template.extension}`,
      // Модуль js компонента: <name>.mjs
      `${name}.mjs`,
      // SCSS partial компонента: _<name>.scss
      `_${name}${cfg.styles.extension}`,
    ];

    // Файл данных компонента: <name>.json
    const component_data = [`${name}.json`];

    // Создаём файлы CREATE_FILES создаёт пустые файлы по именам из массивов
    await createFiles(component_data, data_dir);
    await createFiles(files_collection, component_dir);

    console.log(
      plugin.chalk.green(
        `Компонент "${name}" успешно создан в: ${component_out_dir_log}\nДанные: ${data_out_dir_log}.json`,
      ),
    );
  } catch (error) {
    console.error(error.message);
  }
};

export default createComponentApp;

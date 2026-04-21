import type { ComponentAppOption } from '../@types/component.js';

// Утилита для создания компонента
import {
  KITSYS as system,
  KITPLUGIN as plugin,
  KITCONFIG as cfg,
  CREATE_FILES as createFiles,
  errorThrower,
} from '../config/config.js';

const createComponentApp = async ({ names }: ComponentAppOption): Promise<void> => {
  try {
    for (const name of names) {
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
          console.warn(plugin.chalk.yellow(`Пропуск: компонент "${name}" уже существует: ${component_out_dir_log}`));
          continue;
        } else {
          return errorThrower(`Путь существует, но это не директория: ${component_out_dir_log}`);
        }
      } catch (error) {
        interface NodeJSException {
          code?: string;
        }

        if (error instanceof Error) {
          // ENOENT - директории нет, можно создавать; прочее - пробрасываем
          if ((error as NodeJSException).code !== 'ENOENT') return errorThrower(error);
        } else {
          return errorThrower(String(error));
        }
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

      console.log(plugin.chalk.green(`Набор данных компонента: "${name}" успешно созданы.`));
      console.log(plugin.chalk.bgGrey('################################################'));
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
  }
};

export default createComponentApp;

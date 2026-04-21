import type { InjectStyleAppOption } from '../@types/styles.js';

// Утилита для инъекции стилей компонента в главный файл стилей
// с помощью конструкции @use '';

import { KITSYS as system, KITPLUGIN as plugin, KITCONFIG as cfg, errorThrower } from '../config/config.js';

const injectComponentStyleApp = async ({ names }: InjectStyleAppOption): Promise<void> => {
  try {
    for (const name of names) {
      // Проверяем передачу аргумента и не пустая ли там строка
      if (!name) {
        const nameErrorMsg = `
        ${plugin.chalk.bgRedBright.white('Ошибка!')}

        Не передано имя компонента. Пример:
        $ npx nsk-tools import style Header`;

        errorThrower(nameErrorMsg);
      }

      // Формируем пути
      const component_dir = `${cfg.styles.component_path}/${name}`;
      const stylesheet_path = cfg.styles.component_stylesheet(component_dir, name);
      const index_path = cfg.styles.include_in;

      // Проверяем наличие SCSS-файла компонента
      const style_abs = system.node_path.resolve(stylesheet_path);
      const st = await system.fsPromises.stat(style_abs).catch(() => null);

      if (!st || !st.isFile()) {
        return errorThrower(`
          ${plugin.chalk.bgRedBright.white('Ошибка!')}

          Не найден файл стилей компонента:
          ${style_abs}
        `);
      }

      // Подготовка строки импорта и исключение дублей
      const import_line = cfg.styles.import_stylesheet(name); // генерирует строку вида: @use '../../views/components/<name>/_<name>.scss';
      const index_abs = system.node_path.resolve(index_path);

      const current = await system.fsPromises.readFile(index_abs, 'utf8').catch(() => '');

      if (current.includes(import_line)) {
        console.warn(plugin.chalk.yellow(`Импорт уже существует, пропуск: ${import_line}`));

        return;
      }

      // Добавляем импорт
      await system.fsPromises.appendFile(index_abs, import_line, 'utf8');
      console.log(plugin.chalk.green(`Добавлен импорт: ${import_line}`));
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
  }
};

export default injectComponentStyleApp;

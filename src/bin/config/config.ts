// Import types
import type { StyleConfig, KitPlugin, KitSys, ArchiveMode, ArchiveItem, KitConfig } from '../@types/config.js';

// Import Libraries
import * as fs from 'node:fs';
import * as fsPromises from 'node:fs/promises';
import * as node_path from 'node:path';

import archiver from 'archiver';
import chalk from 'chalk';
import svg64Plugin from 'svg64';

const __dirname = node_path.resolve();
const CWD = process.cwd();

// часто используемые плагины
export const KITPLUGIN: KitPlugin = {
  chalk: chalk,
  archiver: archiver,
  svg64: svg64Plugin,
};

// часто используемые системные и прочие API Node.js
export const KITSYS: KitSys = {
  fs: fs,
  fsPromises: fsPromises,
  node_path: node_path,
  __dirname: __dirname,
};

// Функция фабрика, для создания необходимых файлов и импортов
function createStyleConfig(extension: string, component_path: string, include_in: string): StyleConfig {
  return {
    extension,
    component_path,
    include_in,

    component_stylesheet: function (dir_path, value) {
      return KITSYS.node_path.join(dir_path, `_${value}${extension}`);
    },
    import_stylesheet: function (value) {
      return `\n@use '../../views/components/${value}/_${value}${extension}';\n`;
    },
  };
}

export const KITCONFIG: KitConfig = {
  template: {
    extension: '.njk',
    data_dir: KITSYS.node_path.resolve(CWD, 'src/views/data/'),
    spawn_dir: function (value) {
      return KITSYS.node_path.resolve(CWD, `src/views/components/${value}/`);
    },
  },
  styles: createStyleConfig(
    '.scss',
    KITSYS.node_path.resolve(CWD, 'src/views/components/'),
    KITSYS.node_path.resolve(CWD, 'src/assets/styles/_components_import.scss'),
  ),
  archive: [
    {
      options: {
        mode: 'tgz',
        extension: 'tar.gz',
        make: () =>
          KITPLUGIN.archiver('tar', {
            gzip: true,
            gzipOptions: { level: 1 },
          }),
      },
    },
    {
      options: {
        mode: 'tar',
        extension: 'tar',
        make: () => KITPLUGIN.archiver('tar'),
      },
    },
    {
      options: {
        mode: 'zip',
        extension: 'zip',
        make: () => KITPLUGIN.archiver('zip'),
      },
    },
  ],
  // параметры для svgo
  svgocfg: {
    js2svg: {
      indent: 2, // number
      pretty: false, // boolean
    },
    plugins: [
      // Читай документацию: https://svgo.dev/docs/plugins/
      'convertColors',
      'convertOneStopGradients',
      'mergeStyles',
      'removeComments',
      'removeDesc',
      'removeEditorsNSData',
      'removeEmptyAttrs',
      'removeEmptyContainers',
      'sortAttrs',
      'sortDefsChildren',
      // {
      //   name: 'removeAttrs',
      //   params: {
      //     // attrs: 'stroke', // fill|stroke
      //     preserveCurrentColor: 'currentcolor',
      //   },
      // },
    ],
  },
  // параметры для jpegtran
  jpegtrancfg: {
    progressive: true,
  },
  // параметры для pngcuant
  pngquantcfg: {
    quality: [0.4, 0.6],
  },
  // параметры для webp
  webpcfg: {
    quality: 75,
    method: 5,
    lossless: false, // by default
    nearLossless: false, // by default
  },
};

// Проектный корень и единый каталог архивов
// Архив всегда лежит в '<PROJECT_ROOT>/archives'
// export const PROJECT_ROOT = KITSYS.__dirname;
export const PROJECT_ROOT = CWD;

// функция помощник, созданная для прокидывания ошибок
export function errorThrower(msg: unknown): never {
  if (msg instanceof Error) throw msg;

  if (typeof msg === 'string') {
    throw new Error(msg.trim());
  }

  throw new Error(String(msg));
}

// @type function
// 1 аргументом передаём массив с коллекцией файлов
// 2 аргументом передаём путь до дир-рии, в которой создаём объекты
// @param: CREATE_FILES(collection, dir_path)
export const CREATE_FILES = async (collection: readonly string[], dir_path: string): Promise<void> => {
  await Promise.all(
    collection.map(async (file) => {
      const target = KITSYS.node_path.join(dir_path, KITSYS.node_path.basename(file));

      await KITSYS.fsPromises.mkdir(KITSYS.node_path.dirname(target), { recursive: true });
      await KITSYS.fsPromises.writeFile(target, '', 'utf8'); // пустая заготовка

      console.info(KITPLUGIN.chalk.yellowBright(`Файл компонента создан: ${target}`));
    }),
  );
};

// @type function
// функция создания архива, передаем в неё 3 параметра:
// 1 - коллекцию объектов массива с параметрами для архиватора
// 2 - опцию о расширении архива {tgz, tar, zip} (получаем из консоли)
// 3 - имя директории, так-же получаем из консоли (то что ввёл пользователь)
export const CREATE_ARCHIVE = (
  archive_option_collection: readonly ArchiveItem[],
  input_option: ArchiveMode,
  input_values: string,
): void => {
  try {
    // в цикле перебираем массив с коллекцией объектов опций для архиватора
    archive_option_collection.forEach((collection) => {
      // ищем совпадение в массиве объектов с тем, что пришло от пользователя в консоли
      // const item_compare = collection.options.mode.includes(input_option);
      const isMatch = collection.options.mode === input_option;

      // проверяем результат
      if (isMatch) {
        // debug mode
        console.log(
          isMatch
            ? `Успешное сравнение: ${KITPLUGIN.chalk.green(
                isMatch,
              )} - совпадает со значением пришедшим из консоли, перехожу к созданию архива...`
            : `Неудачное сравнение: ${KITPLUGIN.chalk.red(
                isMatch,
              )} - не совпадает со значением пришедшим из консоли, останавливаю работу.`,
        );

        const extension = collection.options.extension;
        const archive_option = collection.options.make();

        // Безопасные пути для архива (абсолютные пути архивируемой директории)
        const srcAbs = KITSYS.node_path.resolve(input_values);
        const base = KITSYS.node_path.basename(srcAbs);

        const outDir = KITSYS.node_path.join(PROJECT_ROOT, `archives`);
        KITSYS.fs.mkdirSync(outDir, { recursive: true });

        const current_date = new Date();
        const stamp = `${current_date.toLocaleDateString()}-${current_date.toLocaleTimeString()}`;

        const destination = KITSYS.node_path.join(outDir, `${base}-${stamp.replace(/[:.]/g, '-')}.${extension}`);
        const destination_stream = KITSYS.fs.createWriteStream(destination);

        destination_stream.on('close', function () {
          console.log(KITPLUGIN.chalk.yellow(archive_option.pointer() + ' total bytes'));
          console.log('Архиватор был завершен, и дескриптор выходного файла закрылся.\nАрхив успешно создан.');
        });

        archive_option.on('error', function (err) {
          errorThrower(err);
        });

        archive_option.pipe(destination_stream);

        // Игнорируем всё под 'archives/**'
        const ignorePatterns = [];

        // Если архивируем корень проекта, то игнорируем:
        // PROJECT_ROOT/archives/**, PROJECT_ROOT/node_modules/**, PROJECT_ROOT/.git/**
        if (srcAbs === PROJECT_ROOT) {
          ignorePatterns.push('archives/**', 'node_modules/**', '.git/**');

          // исключаем и конкретный файл архива, если он попадает в cwd
          const outRel = KITSYS.node_path.relative(srcAbs, destination);

          if (outRel && !outRel.startsWith('..') && !KITSYS.node_path.isAbsolute(outRel)) {
            ignorePatterns.push(outRel);
          }
        }

        // Используем archive.glob вместо directory, чтобы применить ignorePatterns
        // dot: true - захватываем скрытые файлы (например .env), если нужно
        // prefix: base/ > внутри архива корневой каталог будет называться как исходная папка
        archive_option.glob('**/*', { cwd: srcAbs, dot: true, ignore: ignorePatterns }, { prefix: `${base}/` });

        archive_option.finalize();
      }
    });
  } catch (error) {
    console.error(error);
  }
};

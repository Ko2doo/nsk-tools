// команда imagemin - для оптимизации изображений, используется imagemin и прочие плагины.

import { KITSYS } from '../config/config.mjs';
const node_path = KITSYS.node_path;

export const command = 'imagemin';
export const describe = `
  Оптимизация изображений с помощью imagemin.
  Для оптимизации указываем путь до дир-рии с изображениями.

  Опции:
    -m или --minify для указания аргументов, название аргумента = название плагина imagemin.
    -c или --convert для выбора формата конвертации изображения.
    -i или --input опция для указания пути до дир-рии исходников.
    -o или --output опция для указания пути до выходного каталога куда будут сложены оптимизированные файлы.

  Аргументы:
    gif   - для оптимизации .gif;
    jpeg  - для оптимизации .jpeg;
    png   - для оптимизации .png;
    svg   - для оптимизации .svg;
    webp  - для конвертации jpg,png в .webp (работает с опцией -c или --convert);
    all   - для оптимизации всех форматов (кроме .webp);

  Полная команда:
    $ npx nsk-tools imagemin -m jpeg --input="./src/assets/img" --output="./build/assets/img"
`.trim();

export const builder = (yargs) => {
  // Опция для выбора режима работы
  yargs.option('minify', {
    alias: 'm',
    type: 'string',
    choices: ['gif', 'jpeg', 'png', 'svg', 'all'],
    describe: `
      после ввода -m или --minify, введите опцию какой формат изображений нужно оптимизировать.

      доступные опции:
        gif   - для оптимизации .gif;
        jpeg  - для оптимизации .jpeg;
        png   - для оптимизации .png;
        svg   - для оптимизации .svg;
        all   - для оптимизации всех вышеперечисленных форматов;
    `.trim(),
  });

  yargs.option('input', {
    alias: 'i',
    type: 'string',
    describe: 'Путь до каталога с изображениями.',
    // приводим значение к абсолютному пути, чтобы utils не думали о платформе
    coerce: (p) => (p ? node_path.resolve(p) : p),
  });

  yargs.option('output', {
    alias: 'o',
    type: 'string',
    describe: 'Путь до выходного каталога.',
    // приводим значение к абсолютному пути, чтобы utils не думали о платформе
    coerce: (p) => (p ? node_path.resolve(p) : p),
  });

  // Опция по конвертации изображений в разные форматы
  yargs.option('convert', {
    alias: 'c',
    type: 'string',
    choices: ['webp'],
    describe: `
      после ввода -c или --convert, введите в какой формат конвертировать (например, webp).

      доступные опции:
        webp - для конвертации jpg,png в webp формат;
    `.trim(),
  });

  // необходимые опции для работы команды, иначе ошибка
  yargs.demandOption(['input', 'output'], 'Необходимо указать опции с путями: --input (или -i) и --output (или -o)');
};

export const handler = async (argv) => {
  const { default: imageminApp } = await import('../utils/imageminApp.mjs');

  await imageminApp({
    cmd: argv._[0], // команда imagemin
    minifyCMD: argv.minify,
    convertCMD: argv.convert,
    input: argv.input,
    output: argv.output,
  });

  // console.log('handler:\n', argv);
};

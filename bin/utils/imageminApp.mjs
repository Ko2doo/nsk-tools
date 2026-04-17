/* eslint-disable n/no-unpublished-import */
// Оптимизация, и конвертация изображений.
// Используется плагин imagemin и его дополнительные плагины.

import imagemin from 'imagemin';
import imageminJPEGtran from 'imagemin-jpegtran';
import imageminPNGquant from 'imagemin-pngquant';
import imageminGIFsicle from 'imagemin-gifsicle';
import imageminSVGO from 'imagemin-svgo';
import imageminWEBP from 'imagemin-webp';

import { KITPLUGIN as plugin, KITCONFIG as cfg, errorThrower } from '../config/config.mjs';

const imageminApp = async ({ cmd, minifyCMD, convertCMD, input, output }) => {
  try {
    // debugging
    // console.log('imageOptimization:\n', argv);

    // фун-ция помощник вывода информации в консоль
    // Принимает объект пришедший из yargs (в данном случае argv)
    function consoleInformer() {
      // Вывод информации в консоль
      console.log(plugin.chalk.bgBlue(';----------------------------------------------------:'));
      console.log('Получены данные для оптимизации:');
      console.log(`Получена команда: ${plugin.chalk.green(cmd)}`.trim());

      // Обрабатываем опции команды, и выводим сообщение только если пришла правильная опция
      if (minifyCMD) {
        console.log(`Аргументы команды: ${plugin.chalk.green(`--minify="${minifyCMD}"`)}`.trim());
      }

      if (convertCMD) {
        console.log(`Аргументы команды: ${plugin.chalk.green(`--convert="${convertCMD}"`)}`.trim());
      }

      console.log(`Исходные изображения: ${plugin.chalk.green(input)}`.trim());
      console.log(`Оптимизированные изображения: ${plugin.chalk.blue(output)}`.trim());
      console.log(plugin.chalk.bgBlue(';----------------------------------------------------:'));
    }

    // Проверяем команду, аргументы, и пути
    // если путые и неопределённые - то сообщаем об ошибке.
    if (!input || !output) {
      errorThrower(
        `
        ${plugin.chalk.bgRedBright.white('Ошибка!')}

        Необходимо указать пути:
        -i (--input) и -o (--output)
        `,
      );
    }

    if (!minifyCMD && !convertCMD) {
      errorThrower(
        `
        ${plugin.chalk.bgRedBright.white('Ошибка!')}

        Укажите:
        -m (--minify) иил -c (--convert)
        `,
      );
    }

    // Выводим информацию в консоль
    consoleInformer();

    // Обработка опций для оптимизации изображений
    switch (minifyCMD || convertCMD) {
      // argument - all
      case 'all':
        {
          const files = await imagemin([`${input}/*.{jpg,jpeg,png,svg,gif}`], {
            destination: output,
            plugins: [
              imageminJPEGtran(cfg.jpegtrancfg),
              imageminPNGquant(cfg.pngquantcfg),
              imageminSVGO(cfg.svgocfg),
              imageminGIFsicle(),
            ],
          });

          console.log('Оптимизация:\n', files);
        }
        break;
      // argument - gif
      case 'gif':
        {
          const files = await imagemin([`${input}/*.gif`], {
            destination: output,
            plugins: [imageminGIFsicle()],
          });

          console.log('Оптимизация:\n', files);
        }
        break;
      // argument - jpg
      case 'jpeg':
        {
          const files = await imagemin([`${input}/*.{jpeg,jpg}`], {
            destination: output,
            plugins: [imageminJPEGtran(cfg.jpegtrancfg)],
          });

          console.log('Оптимизация:\n', files);
        }
        break;
      // argument - png
      case 'png':
        {
          const files = await imagemin([`${input}/*.png`], {
            destination: output,
            plugins: [imageminPNGquant(cfg.pngquantcfg)],
          });

          console.log('Оптимизация:\n', files);
        }
        break;
      // argument - svg
      case 'svg':
        {
          const files = await imagemin([`${input}/*.svg`], {
            destination: output,
            plugins: [imageminSVGO(cfg.svgocfg)],
          });

          console.log('Оптимизация:\n', files);
        }
        break;
      // argument - webp (конвертация)
      case 'webp':
        {
          const files = await imagemin([`${input}/*.{jpg,jpeg,png}`], {
            destination: `${output}/webp-converting/`,
            plugins: [imageminWEBP(cfg.webpcfg)],
          });

          console.log('Конвертация:\n', files);
        }
        break;

      default:
        console.error(plugin.chalk.red('Внимание!\nПереданы неверные данные!'));
        break;
    }
  } catch (error) {
    console.error(error.message);
  }
};

export default imageminApp;

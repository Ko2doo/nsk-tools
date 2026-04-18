import type { Options } from 'yargs';

export const GLOBALOPTIONS = {
  path: {
    alias: 'p',
    type: 'string',
    describe: 'после ввода -p или --path, укажите путь до файла или дир-рии',
  },
} as const satisfies Record<string, Options>;

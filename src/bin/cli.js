#!/usr/bin/env node

/**
 * Читайте документацию по yargs API, по ссылке ниже
 * https://yargs.js.org/docs/
 */

'use strict';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { KITSYS as system } from './config/config.js';

const yargApp = yargs(hideBin(process.argv));
const pkg = JSON.parse(system.fs.readFileSync(system.node_path.resolve(system.__dirname, './package.json'), 'utf-8'));

import { COMMANDS } from './commands/index.js';
import { GLOBALOPTIONS } from './options/global.js';

yargApp
  .scriptName('nsk-tools')
  .version(pkg.version)
  .alias('v', 'version')
  .usage(
    `
    ${pkg.description}
    Usage: $0 <command> [option]
    `,
  )
  .command(COMMANDS)
  .option(GLOBALOPTIONS)
  .demandCommand()
  .recommendCommands()
  .strict(true) // -> Любой аргумент командной строки, который не требуется или не имеет соответствующего описания, будет сообщен как ошибка.
  .wrap(yargApp.terminalWidth()) // -> максимизируем ширину инструкций для красивого вывода справки
  .help()
  .alias('h', 'help')
  // Комманда по умолчанию для отображения справки если не было аргументов
  .command(
    '*',
    false,
    (y) => y,
    (argv) => {
      yargApp.showHelp();
    },
  )
  // Единый перехват ошибок CLI: красивый вывод + корректный exit code
  .fail((msg, err) => {
    const text = msg || err?.message;

    if (text) console.error('\n' + text + '\n');
    process.exitCode = 1;
  })
  .parse();

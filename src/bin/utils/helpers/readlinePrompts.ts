import { KITSYS as system } from '../../config/config.js';

/**
 *
 * @param question 'Your ask questions'
 * @returns 'Y/n (Yes/not)'
 */
export function askConfirm(question: string): Promise<boolean> {
  const rl = system.readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`${question} Y/n (Yes/no): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() !== 'n');
    });
  });
}

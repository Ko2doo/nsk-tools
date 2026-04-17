// команда creat -c или --component component_name

export const command = 'component <name>';
export const describe = `
  Создание njk компонента.

  Опции:
    -n или --name для указания названия создаваемого компонента.

  Полная команда:
    $ npx nsk-tools create component Header
  `.trim();

export const handler = async (argv) => {
  const { default: createComponentApp } = await import('../../utils/createComponentApp.js');

  await createComponentApp({
    name: String(argv.name ?? '').trim(),
  });

  // console.log(argv);
};

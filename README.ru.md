# nsk-tools

![npm version](https://img.shields.io/npm/v/@galaxyrobot1x/nsk-tools)
![license](https://img.shields.io/npm/l/@galaxyrobot1x/nsk-tools)
![node](https://img.shields.io/node/v/@galaxyrobot1x/nsk-tools)

**nsk-tools** (Nunjucks Starter Kit tools) — CLI-инструменты для
[gulp-nunjucks-starter-kit](https://github.com/Template-Craft/gulp-nunjucks-starter-kit).
Теперь это отдельный инструмент и опциональное дополнение к основному стартер-киту —
можно использовать как вместе с ним, так и в любом другом проекте.

## Содержание

- [Почему?](#почему)
- [Установка](#установка)
- [Команды](#команды)
  - [create component](#create-component)
  - [import style](#import-style)
  - [imagemin](#imagemin)
  - [create archive](#create-archive)
  - [base64Converter](#base64converter)

## Почему?

1. Каждый инструмент не должен зависеть от других и должен качественно выполнять свою работу.
2. Возможность применить и углубить знания TypeScript, переписав один из своих инструментов на нём.
3. У _imagemin_ и его семейства плагинов регулярно возникают проблемы с безопасностью — вынесение
   в отдельный, независимый пакет снижает связность с основным build-инструментом.
4. Задел на расширение функциональности в будущем.
5. Независимость инструментов друг от друга.

> Следующие пакеты — обёртки над системными утилитами:
> `imagemin-gifsicle` (gifsicle) · `imagemin-jpegtran` (libjpeg) ·
> `imagemin-pngquant` (pngquant) · `imagemin-webp` (cwebp)

## Установка

```bash
npm install --save-dev @galaxyrobot1x/nsk-tools
```

# либо без установки, разово

```bash
npx @galaxyrobot1x/nsk-tools <команда>
```

Требования: Node.js ≥ 22, npm ≥ 10. Поддерживаемые платформы: macOS, Linux, Windows.

Полная справка по всем командам:

```bash
npx nsk-tools
```

## Команды

### create component

Создаёт `.njk`-компонент и сопутствующие файлы.

# одиночное создание

```bash
npx nsk-tools create component Header
```

# пакетное создание — через пробел

```bash
npx nsk-tools create component Header Footer
```

Создаёт структуру в `src/`:

```text
src/
└── views/
├── components/
│ └── Header/
│ ├── Header.njk
│ ├── Header.scss
│ └── Header.mjs
└── data/
└── Header.json
```

### import style

Подключает файл стилей компонента в `_components_import.scss`. Указывать путь и
расширение не нужно — только имя компонента.

# одиночный импорт

```bash
npx nsk-tools import style Header
```

# пакетный импорт

```bash
npx nsk-tools import style Header Footer
```

Добавит строку вида:

```scss
@use "../../views/components/Header/_Header.scss";
```

### imagemin

Оптимизация и конвертация изображений на основе `imagemin` и его плагинов.

```bash
npx nsk-tools imagemin -m jpeg --input=./src/assets/img --output=./build/assets/img
```

| Опция       | Алиас | Описание                                                   |
| ----------- | ----- | ---------------------------------------------------------- |
| `--minify`  | `-m`  | Формат для оптимизации: `gif`, `jpeg`, `png`, `svg`, `all` |
| `--convert` | `-c`  | Конвертация в другой формат: `webp` (для jpg/png)          |
| `--input`   | `-i`  | Путь до директории с исходными изображениями               |
| `--output`  | `-o`  | Путь до директории для сохранения результата               |

# конвертация в webp

```bash
npx nsk-tools imagemin -m jpeg -c webp --input=./src/assets/img --output=./build/assets/img
```

### create archive

Архивирует файлы и директории проекта в `tgz`, `zip` или `tar`.

```bash
npx nsk-tools create archive -o zip -p <directory>
npx nsk-tools create archive -o tgz -p <directory>
npx nsk-tools create archive -o tar -p <directory>
```

### base64Converter

Конвертация SVG в base64 — одиночная или пакетная.

# одиночный файл — результат выводится в консоль

```bash
npx nsk-tools base64Converter -m single -p ./src/assets/img/icon.svg
```

# вся директория — результат сохраняется в текстовый файл

```bash
npx nsk-tools base64Converter -m all -p ./src/assets/img
```

---

Полная справка по любой команде:

```bash
npx nsk-tools <command> --help
```

## Лицензия

MIT

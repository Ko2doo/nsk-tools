# nsk-tools

![npm version](https://img.shields.io/npm/v/@galaxyrobot1x/nsk-tools)
![license](https://img.shields.io/npm/l/@galaxyrobot1x/nsk-tools)
![node](https://img.shields.io/node/v/@galaxyrobot1x/nsk-tools)

**nsk-tools** (Nunjucks Starter Kit tools) — CLI tools for
[gulp-nunjucks-starter-kit](https://github.com/Template-Craft/gulp-nunjucks-starter-kit).
Now a standalone tool and optional companion to the main starter kit — usable either
alongside it or in any other project.

## Contents

- [Why?](#why)
- [Installation](#installation)
- [Commands](#commands)
  - [create component](#create-component)
  - [import style](#import-style)
  - [imagemin](#imagemin)
  - [create archive](#create-archive)
  - [base64Converter](#base64converter)

## Why?

1. No tool should depend on another — each should do its own job well.
2. A chance to apply and deepen TypeScript knowledge by rewriting one of my own tools in it.
3. _imagemin_ and its family of plugins have a recurring history of security issues — moving
   this out into a separate, independent package reduces coupling with the core build system.
4. Room for future functionality.
5. Independence between tools.

> The following packages are wrappers around system utilities:
> `imagemin-gifsicle` (gifsicle) · `imagemin-jpegtran` (libjpeg) ·
> `imagemin-pngquant` (pngquant) · `imagemin-webp` (cwebp)

## Installation

```bash
npm install --save-dev @galaxyrobot1x/nsk-tools
```

# or run it directly without installing

```bash
npx @galaxyrobot1x/nsk-tools <command>
```

Requirements: Node.js ≥ 22, npm ≥ 10. Supported platforms: macOS, Linux, Windows.

Full help for all commands:

```bash
npx nsk-tools
```

## Commands

### create component

Generates an `.njk` component and its accompanying files.

# single component

```bash
npx nsk-tools create component Header
```

# batch creation — space-separated

```bash
npx nsk-tools create component Header Footer
```

Creates the following structure in `src/`:

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

Adds the component's stylesheet import to `_components_import.scss`. No path or
extension needed — just the component name.

# single import

```bash
npx nsk-tools import style Header
```

# batch import

```bash
npx nsk-tools import style Header Footer
```

Adds a line like:

```scss
@use "../../views/components/Header/_Header.scss";
```

### imagemin

Image optimization and conversion built on `imagemin` and its plugins.

```bash
npx nsk-tools imagemin -m jpeg --input=./src/assets/img --output=./build/assets/img
```

| Option      | Alias | Description                                            |
| ----------- | ----- | ------------------------------------------------------ |
| `--minify`  | `-m`  | Format to optimize: `gif`, `jpeg`, `png`, `svg`, `all` |
| `--convert` | `-c`  | Convert to another format: `webp` (for jpg/png)        |
| `--input`   | `-i`  | Path to the source images directory                    |
| `--output`  | `-o`  | Path to the output directory                           |

# convert to webp

```bash
npx nsk-tools imagemin -m jpeg -c webp --input=./src/assets/img --output=./build/assets/img
```

### create archive

Archives project files and directories into `tgz`, `zip`, or `tar`.

```bash
npx nsk-tools create archive -o zip -p <directory>
npx nsk-tools create archive -o tgz -p <directory>
npx nsk-tools create archive -o tar -p <directory>
```

### base64Converter

Converts SVG files to base64 — single file or batch.

# single file — output printed to console

```bash
npx nsk-tools base64Converter -m single -p ./src/assets/img/icon.svg
```

# entire directory — output saved to a text file

```bash
npx nsk-tools base64Converter -m all -p ./src/assets/img
```

---

Full help for any command:

```bash
npx nsk-tools <command> --help
```

## License

MIT

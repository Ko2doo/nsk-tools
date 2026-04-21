## nsk-tools

<p>
  <b>nsk-tools</b> - Nunjucks Starter Kit tools - инструменты командной строки, для <a href="https://github.com/Template-Craft/gulp-nunjucks-starter-kit" target="_blank">gulp-nunjucks-starter-kit.</a>
  <br>
  Теперь это отдельный инструмент и является опциональным дополнением к основному (gulp-nunjucks-starter-kit).
</p>

## Почему?

1. Я считаю что каждый инструмент не должен зависить друг от друга и выполнять свою работу качественно.
2. Я активно изучаю TS и мне стало интересно переписать один из своих инструментов на него.
3. У _imagemin_ и его семейства плагинов постоянные проблемы с безопасностью (кому-то это может не понравится).
4. Возможное расширение функционала в будущем.
5. Независимость инструментов.

## Особенности

_Внимание!_

Следующие пакеты являются обёртками над утилитами:

- imagemin-gifsicle: Обёртка над утилитой gifsicle.
- imagemin-jpegtran: Обёртка над утилитой jpegtran (часть libjpeg).
- imagemin-pngquant: Обёртка над утилитой pngquant.
- imagemin-webp: Обёртка над утилитой cwebp.

---

## Возможности

Для получения полной справки воспользуйтесь командой:

```bash
$ npx nsk-tools
```

#### Создание компонент

Быстрое создание _компонент_ и их файлов командой:

Одиночное создание:

```bash
$ npx nsk-tools create component <componentName>
```

Пакетное создание:

```bash
$ npx nsk-tools create component <componentName> <componentName2> <componentName3> ...etc
```

Создаст директории с файлами в **src/**:

```text
src/
└── views/
    └── components/
        └── ComponentName/
            └── ComponentName.njk
            └── ComponentName.scss
            └── ComponentName.mjs
```

А так же данные для компоненты:

```text
src/
└── views/
    └── data/
        └── ComponentName/json
```

---

#### Подключение файлов стилей

Быстрое подключение файла стилей компоненты командой:

Импорт одного компонента:

```bash
$ npx nsk-tools import style <componentName>
```

Пакетный импорт:

```bash
$ npx nsk-tools import style <componentName> <componentName2> <componentName3> ...etc
```

Эта команда подключит файл стилей в:

```text
src/
└── assets/
    └── styles/
        └── _components_import.scss
```

Пример подключаемой строки внутри **\_components_import.scss**:

```scss
@use "../../views/components/ComponentName/_ComponentName.scss";
```

Для получения полной справки воспользуйтесь командой:

```bash
$ npx nsk-tools import --help
```

---

#### Минификация, трансформация изображений

Возможность минификации, трансформации некоторых изображений посредством использования заготовленных настроек для **imagemin** и его плагинов.

Для получения полной справки воспользуйтесь командой:

```bash
$ npx nsk-tools imagemin --help
```

---

#### Создание архивов

Возможность создания архивов формата: **tgz, zip, tar**.

Создание _zip_ архива:

```bash
$ npx nsk-tools create archive -o zip -p <yourDirectory>
```

Создание _tgz_ архива:

```bash
$ npx nsk-tools create archive -o tgz -p <yourDirectory>
```

Создание _tar_ архива:

```bash
$ npx nsk-tools create archive -o tar -p <yourDirectory>
```

Для получения полной справки воспользуйтесь командой:

```bash
$ npx nsk-tools create archive --help
```

---

#### Преобразование svg base64

Возможность пакетного или одиночного преобразования svg файлов в base64.

Следующая команда преобразует svg и выведет преобразование в консоль:

```bash
$ npx nsk-tools base64Converter -m single -p yourSvg.svg
```

Для получения полной справки воспользуйтесь командой:

```bash
$ npx nsk-tools create archive --help
```

// config/config.ts types collection

// Other Libraries types
import type { ChalkInstance } from 'chalk';
import type archiver from 'archiver';
import type svg64Plugin from 'svg64';
import type { Config as SvgoConfig } from 'svgo';

// Styles types
export type StyleConfig = {
  extension: string;
  component_path: string;
  include_in: string;

  component_stylesheet(dir_path: string, value: string): string;
  import_stylesheet(value: string): string;
};

// Plugin types
export type KitPlugin = {
  chalk: ChalkInstance;
  archiver: typeof archiver;
  svg64: typeof svg64Plugin;
};

// System types
export type KitSys = {
  fs: typeof import('node:fs');
  fsPromises: typeof import('node:fs/promises');
  node_path: typeof import('node:path');
  __dirname: string;
};

export type ArchiveMode = 'tgz' | 'tar' | 'zip';

export type ArchiveOptions = {
  mode: ArchiveMode;
  extension: string;
  make(): ReturnType<typeof archiver>;
};

export type ArchiveItem = {
  options: ArchiveOptions;
};

// Kit config types
export type KitConfig = {
  template: {
    extension: string;
    data_dir: string;
    spawn_dir(value: string): string;
  };

  styles: StyleConfig;

  archive: ArchiveItem[];

  svgocfg: SvgoConfig;
  jpegtrancfg: { progressive: boolean };
  pngquantcfg: { quality: [number, number] };
  webpcfg: {
    quality: number;
    method: number;
    lossless: boolean;
    nearLossless: boolean;
  };
};

// config/config.ts types collection

// Node libraries types
import type * as fsType from 'node:fs';
import type * as fsPromisesType from 'node:fs/promises';
import type * as nodePathType from 'node:path';
import type * as nodeReadline from 'node:readline';

// Other Libraries types
import type { ChalkInstance } from 'chalk';
import type archiver from 'archiver';
import type svg64Plugin from 'svg64';
import type { Config as SvgoConfig } from 'svgo';

// Styles types
export interface StyleConfig {
  extension: string;
  component_path: string;
  include_in: string;

  component_stylesheet(dir_path: string, value: string): string;
  import_stylesheet(value: string): string;
}

// Plugin types
export interface KitPlugin {
  chalk: ChalkInstance;
  archiver: typeof archiver;
  svg64: typeof svg64Plugin;
}

// System types
export interface KitSys {
  fs: typeof fsType;
  fsPromises: typeof fsPromisesType;
  node_path: typeof nodePathType;
  readline: typeof nodeReadline;
  __dirname: string;
}

export type ArchiveMode = 'tgz' | 'tar' | 'zip';

export interface ArchiveOptions {
  mode: ArchiveMode;
  extension: string;
  make(): ReturnType<typeof archiver>;
}

export interface ArchiveItem {
  options: ArchiveOptions;
}

// Kit config types
export interface KitConfig {
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
}

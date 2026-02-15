declare module 'node:fs' {
  export function cpSync(
    src: string,
    dest: string,
    options?: {
      recursive?: boolean;
    }
  ): void;

  export function existsSync(path: string): boolean;

  export function mkdirSync(
    path: string,
    options?: {
      recursive?: boolean;
    }
  ): void;

  export function rmSync(
    path: string,
    options?: {
      recursive?: boolean;
      force?: boolean;
    }
  ): void;
}

declare module 'node:path' {
  const path: {
    join: (...parts: string[]) => string;
  };

  export default path;
}

declare const process: {
  env: Record<string, string | undefined>;
  cwd: () => string;
};

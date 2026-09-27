const files = import.meta.glob<string>('../assets/merchants/*.png', { eager: true, import: 'default' });

/** URL of a merchant logo by file name (without extension). */
export function merchantLogo(file: string): string {
  return files[`../assets/merchants/${file}.png`];
}

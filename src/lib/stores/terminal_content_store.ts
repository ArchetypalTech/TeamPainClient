import { writable } from 'svelte/store';
export type FormatType = 'input' | 'hash' | 'error' | 'out' | 'shog' ;

export type TerminalContentItem = {
  text: string;
  format: FormatType;
  useTypewriter?: boolean;
};

export const terminalContent = writable<TerminalContentItem[]>([]);

export function addTerminalContent(item: TerminalContentItem) {
  terminalContent.update(content => [...content, item]);
}

export function clearTerminalContent() {
  terminalContent.set([]);
}
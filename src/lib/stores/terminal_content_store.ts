import { writable } from 'svelte/store';

export type TerminalContentItem = {
  text: string;
  isHash: boolean;
};

export const terminalContent = writable<TerminalContentItem[]>([]);

export function addTerminalContent(item: TerminalContentItem) {
  terminalContent.update(content => [...content, item]);
}

export function clearTerminalContent() {
  terminalContent.set([]);
}
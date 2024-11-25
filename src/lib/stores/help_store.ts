import { writable } from 'svelte/store';

interface HelpContent {
    description: string;
    usage?: string;
    examples?: string[];
}

interface HelpState {
    currentText: string;
    isVisible: boolean;
    commands: Record<string, HelpContent>;
    topic?: string;
}

function createHelpStore() {
    const initialState: HelpState = {
        currentText: '',
        isVisible: false,
        commands: {
            'help': {
                description: 'Display available commands and their usage',
                usage: 'help [command]',
                examples: ['help', 'help spawn']
            },
            'spawn': {
                description: 'Create a new world instance',
                usage: 'spawn',
                examples: ['spawn']
            },
            'clear': {
                description: 'Clear the terminal screen',
                usage: 'clear'
            },
            'debug': {
                description: 'Toggle the debug window',
                usage: 'debug'
            }
        }
    };

    const { subscribe, set, update } = writable<HelpState>(initialState);

    return {
        subscribe,
        showHelp: (command?: string) => {
            update(state => {
                const helpText = getHelpText(state.commands, command);
                return {
                    ...state,
                    currentText: helpText,
                    isVisible: true,
                    topic: command
                };
            });
        },
        hide: () => {
            update(state => ({ ...state, isVisible: false }));
        },
        toggle: (command?: string) => {
            update(state => {
                const newIsVisible = !state.isVisible;
                return {
                    ...state,
                    isVisible: newIsVisible,
                    currentText: newIsVisible ? getHelpText(state.commands, command) : state.currentText,
                    topic: command || state.topic
                };
            });
        }
    };
}

function getHelpText(commands: Record<string, HelpContent>, command?: string): string {
    if (!command) {
        return `Available commands:\n\n${
            Object.entries(commands)
                .map(([cmd, content]) => 
                    `${cmd.padEnd(10)} - ${content.description}`)
                .join('\n')
        }\n\nType 'help <command>' for more information about a specific command.`;
    }

    const helpContent = commands[command];
    if (!helpContent) {
        return `Unknown command: '${command}'\nType 'help' to see available commands.`;
    }

    let output = `${command.toUpperCase()}\n`;
    output += `\nDescription:\n  ${helpContent.description}`;
    
    if (helpContent.usage) {
        output += `\n\nUsage:\n  ${helpContent.usage}`;
    }
    
    if (helpContent.examples?.length) {
        output += `\n\nExamples:\n${
            helpContent.examples.map(ex => `  ${ex}`).join('\n')
        }`;
    }

    return output;
}

export const helpStore = createHelpStore(); 
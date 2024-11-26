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

const helpTexts: Record<string, string> = {
    'default': 'Type "help close" to close this window\n' +
              '--------------------------------\n' +
              'Command Syntax:\n' +
              'The parser understands natural language like "I want to open the door" or\n' +
              '"please kick the ball at the troll", but you can save typing by using\n' +
              'shorter forms like "open door", "kick ball troll", or just "n" for "go north".\n' +
              'Most commands follow the pattern: <verb> <object> [target/direction]\n' +
              '--------------------------------\n' +
              'Available commands:\n' +
              'help <topic> - Show help for a specific topic\n' +
              '\nTopics:\n' +
              'move        - Navigate through the world\n' +
              'look        - Examine your surroundings\n' +
            //   'kick        - Kick an object or person\n' +
            //   'hit         - Hit an object or person\n' +
            //   'drink       - Drink a liquid\n' +
            //   'fight       - Fight with an opponent\n' +
            //   'sleep       - Sleep to recover health\n' +
            //   'smash       - Smash an object\n' +
            //   'pray        - Pray to a deity\n' +
            //   'open        - Open a door or container\n' +
            //   'break       - Break an object\n' +
              'burn        - Burn an object\n' +
              'light       - Light a object like a lantern or synonym for burn/ignite\n' +
              'ignite      - Set on fire\n' +
              'spawn       - Create a new world instance\n' +
              'take        - Take an object\n' +
              'help        - Display available commands and their usage\n' +
              'pour        - Pour a liquid\n' +
            //   'follow      - Follow a person or object\n' +
            //   'jump        - Jump to a higher location\n' +
            //   'block       - Block an attack\n' +
              'soak        - Soak an object\n' +
              'empty       - Empty a container\n' +
              'close       - Close this help window\n' +
              'hear        - Control ambient sounds',
    'close': 'Close command:\nUse "help close" to close this help window.',
    'go': 'Move command:\nUse "go <direction>" to move in that direction.\nValid directions are north, south, east, west, up, down.',
    'look': 'Look command:\nUse "look [around]" to examine your surroundings.\nUse "look at <object>" to examine specific things.',
    // 'hit': 'HIT\n\n' +
    //       'Description:\n' +
    //       '  Strike something with force - more general than kick\n\n' +
    //       'Syntax:\n' +
    //       '  Long form: "I want to hit the wall" or "strike the dummy"\n' +
    //       '  Short form: "hit wall", "hit dummy"\n\n' +
    //       'Examples:\n' +
    //       '  "hit wall"\n' +
    //       '  "strike dummy"\n' +
    //       '  "I want to hit the target"',
    // 'drink': 'DRINK\n\n' +
    //         'Description:\n' +
    //         '  Consume liquids from containers or sources\n\n' +
    //         'Syntax:\n' +
    //         '  Long form: "I want to drink the potion" or "drink from the fountain"\n' +
    //         '  Short form: "drink potion", "drink water"\n\n' +
    //         'Examples:\n' +
    //         '  "drink potion"\n' +
    //         '  "drink from fountain"\n' +
    //         '  "I want to drink the water"\n' +
    //         'Warning:\n' +
    //         '  Be careful what you drink - not all liquids are safe!',
    // 'sleep': 'SLEEP\n\n' +
    //         'Description:\n' +
    //         '  Rest to recover health and energy\n\n' +
    //         'Syntax:\n' +
    //         '  Long form: "I want to sleep here" or "rest in this spot"\n' +
    //         '  Short form: "sleep", "rest"\n\n' +
    //         'Examples:\n' +
    //         '  "sleep"\n' +
    //         '  "rest here"\n' +
    //         '  "I want to sleep now"\n' +
    //         'Warning:\n' +
    //         '  Make sure you\'re in a safe location before sleeping',
    // 'smash': 'SMASH\n\n' +
    //         'Description:\n' +
    //         '  Violently destroy objects - more forceful than break\n\n' +
    //         'Syntax:\n' +
    //         '  Long form: "I want to smash the crate" or "smash through the wall"\n' +
    //         '  Short form: "smash crate", "smash wall"\n\n' +
    //         'Examples:\n' +
    //         '  "smash crate"\n' +
    //         '  "smash the wall"\n' +
    //         '  "I want to smash everything"',
    'pray': 'PRAY\n\n' +
           'Description:\n' +
           '  Appeal to higher powers for aid or guidance\n\n' +
           'Syntax:\n' +
           '  Long form: "I want to pray for help" or "pray to the gods"\n' +
           '  Short form: "pray", "pray help"\n\n' +
           'Examples:\n' +
           '  "pray"\n' +
           '  "pray for help"\n' +
           '  "I want to pray to the gods"',
    // 'break': 'BREAK\n\n' +
    //         'Description:\n' +
    //         '  Damage or destroy objects - less violent than smash\n\n' +
    //         'Syntax:\n' +
    //         '  Long form: "I want to break the window" or "break open the box"\n' +
    //         '  Short form: "break window", "break box"\n\n' +
    //         'Examples:\n' +
    //         '  "break window"\n' +
    //         '  "break the box"\n' +
    //         '  "I want to break this"',
    'burn': 'BURN\n\n' +
           'Description:\n' +
           '  Set objects on fire - requires a fire source\n\n' +
           'Syntax:\n' +
           '  Long form: "I want to burn the papers" or "set fire to the wood"\n' +
           '  Short form: "burn papers", "burn wood"\n\n' +
           'Examples:\n' +
           '  "burn papers"\n' +
           '  "burn the wood"\n' +
           '  "I want to burn this"\n' +
           'Note:\n' +
           '  Requires a fire source or matches',
    'light': 'LIGHT\n\n' +
            'Description:\n' +
            '  Illuminate areas or ignite objects\n\n' +
            'Syntax:\n' +
            '  Long form: "I want to light the torch" or "light up the room"\n' +
            '  Short form: "light torch", "light room"\n\n' +
            'Examples:\n' +
            '  "light torch"\n' +
            '  "light the lantern"\n' +
            '  "I want to light this area"',
    'ignite': 'IGNITE\n\n' +
             'Description:\n' +
             '  Start fires - similar to light and burn\n\n' +
             'Syntax:\n' +
             '  Long form: "I want to ignite the fuel" or "ignite the campfire"\n' +
             '  Short form: "ignite fuel", "ignite fire"\n\n' +
             'Examples:\n' +
             '  "ignite fuel"\n' +
             '  "ignite the fire"\n' +
             '  "I want to ignite this"',
    'pour': 'POUR\n\n' +
           'Description:\n' +
           '  Empty liquid containers in a specific direction\n\n' +
           'Syntax:\n' +
           '  Long form: "I want to pour the water" or "pour water on the fire"\n' +
           '  Short form: "pour water", "pour water fire"\n\n' +
           'Examples:\n' +
           '  "pour water"\n' +
           '  "pour water on fire"\n' +
           '  "I want to pour this out"',
    // 'follow': 'FOLLOW\n\n' +
    //          'Description:\n' +
    //          '  Track or pursue a person or object\n\n' +
    //          'Syntax:\n' +
    //          '  Long form: "I want to follow the guard" or "follow those tracks"\n' +
    //          '  Short form: "follow guard", "follow tracks"\n\n' +
    //          'Examples:\n' +
    //          '  "follow guard"\n' +
    //          '  "follow the tracks"\n' +
    //          '  "I want to follow them"',
    // 'jump': 'JUMP\n\n' +
    //        'Description:\n' +
    //        '  Leap over obstacles or reach higher places\n\n' +
    //        'Syntax:\n' +
    //        '  Long form: "I want to jump over the gap" or "jump onto the platform"\n' +
    //        '  Short form: "jump gap", "jump platform"\n\n' +
    //        'Examples:\n' +
    //        '  "jump"\n' +
    //        '  "jump over gap"\n' +
    //        '  "I want to jump up there"',
    // 'block': 'BLOCK\n\n' +
    //         'Description:\n' +
    //         '  Obstruct paths or defend against attacks\n\n' +
    //         'Syntax:\n' +
    //         '  Long form: "I want to block the door" or "block the attack"\n' +
    //         '  Short form: "block door", "block attack"\n\n' +
    //         'Examples:\n' +
    //         '  "block door"\n' +
    //         '  "block the attack"\n' +
    //         '  "I want to block this"',
    'soak': 'SOAK\n\n' +
           'Description:\n' +
           '  Saturate objects with liquid\n\n' +
           'Syntax:\n' +
           '  Long form: "I want to soak the cloth" or "soak it in water"\n' +
           '  Short form: "soak cloth", "soak wood"\n\n' +
           'Examples:\n' +
           '  "soak cloth"\n' +
           '  "soak it in water"\n' +
           '  "I want to soak this"',
    'empty': 'EMPTY\n\n' +
            'Description:\n' +
            '  Remove contents from containers\n\n' +
            'Syntax:\n' +
            '  Long form: "I want to empty the chest" or "empty out the bag"\n' +
            '  Short form: "empty chest", "empty bag"\n\n' +
            'Examples:\n' +
            '  "empty chest"\n' +
            '  "empty the bag"\n' +
            '  "I want to empty this"',
    'explode': 'EXPLODE\n\n' +
              'Description:\n' +
              '  Cause violent destruction - be very careful!\n\n' +
              'Syntax:\n' +
              '  Long form: "I want to explode the barrel" or "blow up the wall"\n' +
              '  Short form: "explode barrel", "blow wall"\n\n' +
              'Examples:\n' +
              '  "explode barrel"\n' +
              '  "blow up the wall"\n' +
              '  "I want to explode this"\n' +
              'Warning:\n' +
              '  Extremely dangerous - maintain safe distance!',
    'disintegrate': 'DISINTEGRATE\n\n' +
                   'Description:\n' +
                   '  Completely destroy objects - no remains\n\n' +
                   'Syntax:\n' +
                   '  Long form: "I want to disintegrate the evidence" or "disintegrate that completely"\n' +
                   '  Short form: "disintegrate evidence", "disintegrate box"\n\n' +
                   'Examples:\n' +
                   '  "disintegrate evidence"\n' +
                   '  "disintegrate the box"\n' +
                   '  "I want to disintegrate this"\n' +
                   'Warning:\n' +
                   '  Permanent and complete destruction - cannot be undone',
    'hear': 'HEAR\n\n' +
           'Description:\n' +
           '  Control the ambient sound system\n\n' +
           'Syntax:\n' +
           '  hear wind [on|off] - Control wind sound\n' +
           '  hear tone [on|off] - Control tonal sound\n' +
           '  hear help         - Show this help\n\n' +
           'Examples:\n' +
           '  "hear wind off"   - Disable wind sound\n' +
           '  "hear wind on"    - Enable wind sound\n' +
           '  "hear tone off"   - Disable tonal sound\n' +
           '  "hear tone on"    - Enable tonal sound\n\n' +
           'Note:\n' +
           '  Changes are applied smoothly with a short fade'
};

function createHelpStore() {
    const initialState: HelpState = {
        currentText: '',
        isVisible: false,
        commands: {
            'help': {
                description: 'Open the help window.',
                usage: 'help [command]\nwhere [command] is passed will print long form.',
                examples: ['help', 'help jump']
            },
            'help list': {
                description: 'Show the list of verbs',
                usage: 'help list',
                examples: ['help', 'help list']
            },
            'help-close': {
                description: 'Close the help window.',
                usage: 'help-close',
                examples: ['help-close']
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
            update(state => ({
                ...state,
                currentText: getHelpText(state.commands, command),
                isVisible: true,
                topic: command
            }));
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

    // Check helpTexts first for long-form help
    if (helpTexts[command]) {
        return helpTexts[command];
    }

    // Fall back to commands for basic help
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

export function handleHelp(command: string) {
    const parts = command.split(' ');
    const topic = parts.length > 1 ? parts[1].toLowerCase() : 'default';

    // If help is typed alone, show default help
    if (command.trim().toLowerCase() === 'help') {
        helpStore.showHelp();
        return;
    }

    // If "help close" or "help-close" is typed, close the window
    if (command.trim().toLowerCase() === 'help-close' || topic === 'close') {
        helpStore.hide();
        return;
    }

    // Show help for specific verb
    helpStore.showHelp(topic);
}

export const helpStore = createHelpStore(); 
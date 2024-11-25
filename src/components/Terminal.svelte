<script lang="ts">
	import { onMount, tick } from "svelte";
	import { sendCommand } from "../api/terminal";
	import { terminalContent, addTerminalContent, clearTerminalContent, type TerminalContentItem } from "$lib/stores/terminal_content_store";
    import Typewriter from "$components/Typewriter.svelte";
    import { windowsStore, WindowType } from '$lib/stores/windows_store';
    import { helpStore } from '$lib/stores/help_store';
    import HelpTerminal from './HelpTerminal.svelte';


	let headerText = [
		"Archetypal Tech. Innovation in frustration",
		"",
		"\n",
		"The O'Ruggin Trail, no:23",
		"from the good folk at",		
	];
	let inputValue = "";
	let originalInputValue = "";
	let inputHistory: string[] = [];
	let inputHistoryIndex = 0;
	let terminalForm: HTMLFormElement;
	let terminalInput: HTMLInputElement;


	/**
	 * we actually have no concept of a user at this point
	 * but this will be a combination of address and some guid we will
	 * generate from somewhere
	 */
	let step = 1;
  	let username = "";
  	let roomID = 0;
	
	function handleKeyDown(e: KeyboardEvent) {
		// up down cycle through prevInputs or back to originalInputValue
		if (e.key === "ArrowUp") {
			e.preventDefault();
			if (inputHistoryIndex === 0) {
				originalInputValue = inputValue;
			}
			if (inputHistoryIndex < inputHistory.length) {
				inputHistoryIndex++;
				inputValue = inputHistory[inputHistory.length - inputHistoryIndex];
			}
		} else if (e.key === "ArrowDown") {
			e.preventDefault();
			if (inputHistoryIndex > 0) {
				inputHistoryIndex--;
				if (inputHistoryIndex === 0) {
					inputValue = originalInputValue;
				} else {
					inputValue = inputHistory[inputHistory.length - inputHistoryIndex];
				}
			}
		}
	}

	onMount(async () => {
		addTerminalContent({ 
			text: "type \"spawn\" to create a world, or \"help\"", 
			format: 'shog', 
			useTypewriter: true });
	});

	async function submitForm(e: SubmitEvent) {
		e.preventDefault();
		const command = inputValue;
		inputHistoryIndex = 0;
		if (command === "") return;

		inputValue = "";
		await tick();

		// Add command to history and display
		inputHistory = [...inputHistory, command];
		addTerminalContent({ text: command, format: 'input', useTypewriter: false });

		// Parse command and arguments
		const [cmd, ...args] = command.trim().toLowerCase().split(/\s+/);

		// Handle built-in commands
		switch (cmd) {
			case 'clear':
				clearTerminalContent();
				return;

			case 'debug':
				windowsStore.toggle(WindowType.DEBUG);
				addTerminalContent({ 
					text: `Debug window ${windowsStore.get(WindowType.DEBUG) ? 'enabled' : 'disabled'}`, 
					format: 'out', 
					useTypewriter: false 
				});
				return;

			case 'help':
				helpStore.toggle(args[0]);
				addTerminalContent({ 
					text: `Help window ${helpStore.isVisible ? 'enabled' : 'disabled'}`, 
					format: 'out', 
					useTypewriter: false 
				});
				return;
		}

		// Handle other commands via GQL
		try {
			const response = await sendCommand(command);
			/**
			 * we dont actually do anything now as we wait on the GQL subscription
			 * to actually return us bacon, via the `ToriiSub` component which updates
			 * the store and thus the UI
			 * */			
		} catch (e) {
			console.error(e);
		}
	}

</script>

<form
	bind:this={terminalForm}
	on:submit={async (e) => {
		terminalInput.disabled = true;
		await submitForm(e);
		terminalInput.disabled = false;
		terminalInput.focus();
	}}
	on:click={(e) => terminalInput.focus()}
	on:keydown={(e) => terminalInput.focus()}
	aria-label="Terminal"
	role=""
	class="font-mono overflow-y-auto h-full bg-black text-green-500 border border-green-500 rounded-md p-4"
>
	<div class="text-center">
		{#each headerText as headerLine}
			<div class="min-h-6">{headerLine}</div>
		{/each}
		<div class="bastard">
			<b>B</b>est <b>A</b>rchetypal <b>S</b>ystem <b>T</b>erminals <b>A</b>nd <b>R</b>etrograde
			<b>D</b>evices
		</div>
	</div>
	<br />
	<ul class="w-full">
		{#each $terminalContent as content}
			{#if content.useTypewriter}
				<Typewriter
					text={content.text} 
					sentenceDelay={1000}
					minTypingDelay={30}
					maxTypingDelay={100}
					/>
			{:else}
				<li class="break-words {content.format}-style">{content.text}</li>
			{/if}
		{/each}
	</ul>
	<div class="w-full flex flex-row gap-2">
		<span>&#x3e;</span><input
			class="bg-black text-green-700 w-full"
			type="text"
			bind:value={inputValue}
			bind:this={terminalInput}
			on:keydown={(e) => handleKeyDown(e)}
		/>
	</div>
</form>

<style>
	input {
		outline: none;
	}
	.hash-style {
		color: #ffd700; 
		font-weight: bold;
		font-size: 0.7em; 
	}
	.out-style {
		color: #309810; 
		/* font-weight: bold; */
		font-size: 1.1em; 
	}
	.shog-style {
		color: #309810; 
		/* font-weight: bold; */
		font-size: 1.1em; 
	}
	.input-style {
		color: #25642a; 
		/* font-weight: bold; */
		font-size: 0.9em; 
	}
</style>

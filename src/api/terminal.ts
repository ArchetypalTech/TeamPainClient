
export function sendCommand(command: string): Promise<string> {
	return new Promise(async (resolve, reject) => {
		// we have a string here so we probably want to split and process
		// further pre throwing it at the contracts wall
		// but for now: FIXME
		const response = await fetch("/api", {
			method: "POST",
			body: JSON.stringify({ entry: command }),
		});
	});
}

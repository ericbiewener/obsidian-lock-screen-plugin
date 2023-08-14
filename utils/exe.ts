import assert from "assert";
import execa, { SyncOptions } from "execa";
import { isString } from "./is-string";

type Options = { throwError?: boolean } & SyncOptions;

const baseExe = (cmd: string, args?: any[], options?: Options) => {
	const { throwError, ...exeOptions } = options || {};

	try {
		const { exitCode, stderr, stdout } = execa.sync(
			cmd,
			args?.filter(isString),
			{
				stdio: "inherit",
				...exeOptions,
			},
		);
		if (exitCode) process.exit(exitCode);
		if (stderr) process.exit(1);
		return stdout;
	} catch (e) {
		if (throwError || exeOptions.stdio === "pipe") {
			throw e;
		}
		// Catch the error so that we don't have to see the JS stack trace. The executed command will
		// have had its own output.
		process.exit(1);
	}
};

type Exe = {
	(args?: any[], options?: Options): ReturnType<typeof baseExe>;
	(...args: any[]): ReturnType<typeof baseExe>;
};

type ExeWithCmd = Record<string, Exe>;

export const exe = new Proxy({} as ExeWithCmd, {
	get(_target, cmd): Exe {
		assert(typeof cmd === "string");
		return (...args) =>
			Array.isArray(args[0])
				? baseExe(cmd, args[0], args[1])
				: baseExe(cmd, args);
	},
});

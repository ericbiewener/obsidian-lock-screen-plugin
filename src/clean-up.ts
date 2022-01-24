type CleanUpFn = () => void;

const fns: CleanUpFn[] = [];

export const cleanupService = {
	registerFn: (fn: CleanUpFn) => {
		fns.push(fn);
	},
	cleanUp: () => {
		console.log('cleaning up')
		for (const fn of fns) fn();
	},
};

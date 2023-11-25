type TryActResult<T, U> = { result?: U; error?: T };

function isPromiseLike<T>(obj: any): obj is PromiseLike<T> {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	return typeof obj?.then === 'function';
}

export function catchActError<T = Error, U = unknown>(callback: () => Promise<U>): Promise<TryActResult<T, U>>;
export function catchActError<T = Error, U = unknown>(callback: () => U): TryActResult<T, U>;
export function catchActError<T = Error, U = unknown>(callback: () => U | Promise<U>): TryActResult<T, U> | Promise<TryActResult<T, U>> {
	try {
		const callbackResult = callback();

		if (isPromiseLike<U>(callbackResult)) {
			return callbackResult.then(
				(result) => ({ result }),
				(error) => ({ error: error as T }),
			);
		}

		return { result: callbackResult };
	} catch (e) {
		return { error: e as T };
	}
}

/**
 * @param promise
 * @param finallyCallback
 * @returns
 */
export function simpleAwait(promise, finallyCallback) {
    return promise
        .then((data) => {
        return [undefined, data];
    })
        .catch((e) => {
        return [e, undefined];
    })
        .finally(() => {
        if (finallyCallback)
            finallyCallback();
    });
}

export const helper = {
    json: {
        safeParse: (json: string) => {
            try {
                return JSON.parse(json);
            } catch (error) {
                return null;
            }
        }
    },
    env: {
        isBrowser: typeof window !== 'undefined',
    }
}
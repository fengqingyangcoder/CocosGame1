export class Debug {

    public static Log(tag: string, ...msg: unknown[]): void {
        console.log(`${tag} --> `, ...msg);
    }

    public static Warn(tag: string, ...msg: unknown[]): void {
        console.warn(`${tag} --> `, ...msg);
    }

    public static Error(tag: string, ...msg: unknown[]): void {
        console.error(`${tag} --> `, ...msg);
    }

}



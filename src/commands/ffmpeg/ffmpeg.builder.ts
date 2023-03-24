export class FfmpegBuilder {
    private options: Map<string, string> = new Map();
    private path: string;

    constructor() {
        this.options.set('-c:v', 'libx264');
    }

    addResolution (width: number, height: number) {
        this.options.set('-s', `${width}x${height}`);
        return this;
    }

    addPath (pathArg: string) {
        this.path = pathArg;
        return this;
    }

    build (nameArg: string) {
        if(!this.path){
            throw new Error ('Не указан путь')
        }

        const args: string[] = ['-i', this.path];
        this.options.forEach((val, key) => {
            args.push(key);
            args.push(val);
        })
        args.push(`${nameArg}.mp4`);
        return args;
    }
}
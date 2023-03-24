import { FfmpegExecutor } from "./commands/ffmpeg/ffmpeg.executor.js";
import { ConsoleLogger } from "./out/console-logger.ts/console-logger.js";

export class App{
    async run(){
        new FfmpegExecutor(ConsoleLogger.getInstance()).execute();
    }
}

const app = new App().run();
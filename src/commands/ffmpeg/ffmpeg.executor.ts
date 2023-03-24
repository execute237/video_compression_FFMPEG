import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import { CommandExecutor } from "../../core/executor/command.executor.js";
import { FileService } from "../../core/files/file.service.js";
import { IStreamLogger } from "../../core/handlers/stream-logger.interface";
import { StreamHandler } from "../../core/handlers/stream.handler.js";
import { PromptService } from "../../core/prompt/prompt.service.js";
import { FfmpegBuilder } from "./ffmpeg.builder.js";
import { ICommandExecFfmpeg, IFfmpegInput } from "./ffmpeg.types";

export class FfmpegExecutor extends CommandExecutor<IFfmpegInput> {

    private fileService: FileService = new FileService();
    private promptService: PromptService = new PromptService();

    constructor(logger: IStreamLogger) {
        super(logger);
    }

    protected  async prompt(): Promise<IFfmpegInput> {
        const width = await this.promptService.input<number>('Ширина', 'number');
        const height = await this.promptService.input<number>('Высота', 'number');
        const path = await this.promptService.input<string>('Путь до файла', 'input');
        const name = await this.promptService.input<string>('Имя (Без указания расширения)', 'input');
        return {width, height, path, name}
    }

    protected build({width, height, path, name}: IFfmpegInput): ICommandExecFfmpeg {
        const output = this.fileService.getFilePath(path, name, 'mp4');
        const args = (new FfmpegBuilder)
            .addPath(path)
            .addResolution(width, height)
            .build(name);
        return {command: 'ffmpeg', args, output};
    }

    protected spawn({output, command, args}: ICommandExecFfmpeg): ChildProcessWithoutNullStreams {
        this.fileService.deleteFileIfExists(output);
        console.log(`${command} ${args}`);
        return spawn(command, args);
    }

    protected processStream(stream: ChildProcessWithoutNullStreams, logger: IStreamLogger): void {
        const handler = new StreamHandler(logger);
        handler.processOutput(stream);
    }

}
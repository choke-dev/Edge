import { ConsoleColor } from "../handler/index";

export function getLoggerLogMessage(message: string): string {
    return `${ConsoleColor.Blue}[INFO] ${message}${ConsoleColor.Reset}`;
}
export function getLoggerWarnMessage(message: string): string {
    return `${ConsoleColor.Yellow}[WARNING] ${message}${ConsoleColor.Reset}`;
}
export function getLoggerErrorMessage(message: string): string {
    return `${ConsoleColor.Red}[ERROR] ${message}${ConsoleColor.Reset}`;
}

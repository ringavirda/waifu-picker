import chalk from "chalk";

export default {
  info: (part: string, message: string) => {
    console.log(
      chalk.gray(
        `[${part} ${"INFO"} ${new Date().toLocaleTimeString()}]: ${message}`,
      ),
    );
  },
  warn: (part: string, message: string) => {
    console.log(
      chalk.yellow(
        `[${part} ${chalk.underline("WARN")} ${new Date().toLocaleTimeString()}}]: ${message}`,
      ),
    );
  },
  error: (part: string, message: string) => {
    console.log(
      chalk.red(
        `[${part} ${chalk.bold.underline("ERROR")} ${new Date().toLocaleTimeString()}()}]: ${message}`,
      ),
    );
  },
};

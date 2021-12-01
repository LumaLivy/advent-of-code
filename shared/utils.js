import chalk from "chalk";
import yargs from "yargs";

const colorize = (input) =>
  input
    .split(" ")
    .map((v) => {
      const trimmed = v.trim();
      if (typeof parseInt(trimmed) === "number" && !isNaN(parseInt(trimmed))) {
        return chalk.red(v);
      }
      if (v === "true" || v === "false") {
        return chalk.green(v);
      }
      return chalk.white(v);
    })
    .join(" ");

const pluralize = (word, occurances) => (occurances > 1 ? word + "s" : word);

const getArgs = (argv, solutionNumber) =>
  yargs(argv)
    .usage(`Usage: ./${solutionNumber}/$0 [options]`)
    .example(
      `./${solutionNumber}/$0 -f "./${solutionNumber}/custom.txt"`,
      "Use your custom input file with the\nsolution. Must be wrapped in quotes if the\npath contains spaces."
    )
    .wrap(null)
    .boolean(["v", "h"])
    .describe("v", "Log verbose output")
    .alias("h", "help")
    .alias("v", "verbose")
    .alias("f", "file")
    .default("f", "./01/input.txt").argv;

export { colorize, pluralize, getArgs };

import chalk from "chalk";
import yargs from "yargs";

const colorize = (input) => {
  let result = input;
  result = result.replace(/(^|[^\w]+)+(\d+)/g, `$1${chalk.red("$2")}`);
  result = result.replace(/true|false/g, chalk.green("$&"));
  return result;
};

const pluralize = (word, occurances) => (occurances > 1 ? word + "s" : word);

const getArgs = (argv, year, solutionNumber) =>
  yargs(argv)
    .usage(`Usage: ./${year}/${solutionNumber}/$0 [options]`)
    .example(
      `./${year}/${solutionNumber}/$0 -f "./${year}/${solutionNumber}/custom.txt"`,
      "Use your custom input file with the\nsolution. Must be wrapped in quotes if the\npath contains spaces."
    )
    .wrap(null)
    .boolean(["v", "h"])
    .describe("v", "Log verbose output")
    .alias("h", "help")
    .alias("v", "verbose")
    .alias("f", "file")
    .default("f", `./${year}/${solutionNumber}/input.txt`).argv;

export { colorize, pluralize, getArgs };

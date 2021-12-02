import chalk from "chalk";
import yargs from "yargs";

const colorize = (input) => {
  let result = input;
  result = result.replace(/\d+/g, (match) => chalk.red(match));
  result = result.replace(/true|false/g, (match) => chalk.green(match));
  return result;
};

console.log(colorize("this is true, this is false."));

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
    .default("f", `./${solutionNumber}/input.txt`).argv;

export { colorize, pluralize, getArgs };

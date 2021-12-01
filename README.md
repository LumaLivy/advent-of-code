# advent-of-code

My [advent of code](https://adventofcode.com/2021/) 2021 submissions.

## Dependencies

- [yargs](http://yargs.js.org/)
- [chalk](https://github.com/chalk/chalk)

You can install them easily by running the following command from the project root directory:

```
yarn install

or

npm install
```

## Running the Solutions

To run a particular solution (01/, 02/, 03/, ..., 25/), you can execute the following from the project root directory (for example, 01):

```
node 01/index.js

or (with bash):

./01/index.js
```

When using the `./` syntax, you may need to `chmod` the file first:

```
chmod +x ./01/index.js
```

This will allow you to execute the file as your user.

## Options/Flags

Each solution can make use of the following (optional) flags:

### --help / -h

Reminds you how to use the following flags.

### --verbose / -v

Causes the solution to provide (optional) verbose output. (For example):

```
node 01/index.js --verbose
```

This usually means any intermediate calculations or values will be shown in the console. The result of each solution (both parts) will **always** be shown at the end of all logging, regardless of the verbose flag.

### --file / -f [path]

Specifies a custom file for the solution to process. Your path should be relative to the root directory. Spaces in the path are fine, just wrap it with quotes! For example:

```
node 01/index.js --file ./01/custom_input.txt

...

node 01/index.js --file "./01/I use spaces in my paths for some reason.txt"
```

The standard naming convention I use for the input file is `input.txt`. If the default `input.txt` is found in a solution's folder (for example, `01/input.txt`), you may exclude the file flag.
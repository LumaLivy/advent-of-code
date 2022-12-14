#!/usr/bin/env node
import fs from "fs";
import process from "process";
import { getArgs, colorize } from "../../shared/utils.js";

const argv = getArgs(process.argv.slice(2), "2022", "11");

const verbose = argv.v;
const file = argv.f;

// Main function to calculate and display part one
const partOne = (data) => {
  const cleaned = processData(data);
  let inspected = [...new Array(cleaned.length)].map(() => 0);
  for (let round = 0; round < 20; round++) {
    cleaned.forEach((monkey) => {
      if (verbose) console.log(`Monkey ${monkey.id}:`);
      monkey.items.forEach((item, itemId) => {
        if (verbose) console.log(`  Monkey inspects item with worry ${item}`);

        inspected[monkey.id] += 1;
        const newValue = eval(monkey.operation.replace(/old/g, item));

        if (verbose) console.log(`    Worry ${item} -> ${newValue}`);

        const boredValue = Math.floor(newValue / 3);

        if (verbose)
          console.log(`    Monkey bored. Worry ${newValue} -> ${boredValue}`);

        if (verbose)
          console.log(
            newValue % monkey.test === 0
              ? `    Divisible by ${monkey.test}, item thrown to monkey ${monkey.ifTrue}`
              : `    Not divisible by ${monkey.test}, item thrown to monkey ${monkey.ifFalse}`
          );
        cleaned[
          boredValue % monkey.test === 0 ? monkey.ifTrue : monkey.ifFalse
        ].items.push(boredValue);
        monkey.items[itemId] = -1;
      });
      monkey.items = monkey.items.filter((i) => i !== -1);
    });
  }

  inspected.sort((a, b) => b - a);
  const monkeyBusiness = inspected[0] * inspected[1];

  return monkeyBusiness;
};

// Main function to calculate and display part two
const partTwo = (data) => {
  const cleaned = processData(data);
  let inspected = [...new Array(cleaned.length)].map(() => 0);

  const multiplier = cleaned.reduce((a, c) => a * c.test, 1);
  for (let round = 0; round < 10000; round++) {
    cleaned.forEach((monkey) => {
      monkey.items.forEach((item, itemId) => {
        inspected[monkey.id] += 1;
        const newValue = eval(monkey.operation.replace(/old/g, item));

        let boredValue = newValue;

        boredValue = boredValue % multiplier;
        cleaned[
          boredValue % monkey.test === 0 ? monkey.ifTrue : monkey.ifFalse
        ].items.push(boredValue);
        monkey.items[itemId] = -1;
      });
      monkey.items = monkey.items.filter((i) => i !== -1);
    });
  }

  if (verbose) console.log(inspected);
  inspected.sort((a, b) => b - a);
  const monkeyBusiness = inspected[0] * inspected[1];

  return monkeyBusiness;
};

// Read the input data
const processData = (data) => {
  const ins = [{}];

  const keyMap = ["id", "items", "operation", "test", "ifTrue", "ifFalse"];

  data
    .trim()
    .split("\n")
    .forEach((n, ni) => {
      if (ni > 0 && (ni + 1) % 7 === 0) {
        ins.push({});
        return;
      }

      let value;
      const key = keyMap[ni % 7];
      switch (key) {
        case "id":
          value = +[...n.matchAll(/Monkey (\d+):/g)][0][1];
          break;
        case "items":
          value = [...n.matchAll(/: (.*)/g)][0][1].split(",").map((d) => +d);
          break;
        case "operation":
          value = [...n.matchAll(/: new = (.*)/g)][0][1];
          break;
        case "test":
          value = +[...n.matchAll(/: .* by (\d+)/g)][0][1];
          break;
        case "ifTrue":
        case "ifFalse":
          value = +[...n.matchAll(/: .* monkey (\d+)/g)][0][1];
          break;
      }
      ins[ins.length - 1][key] = value;
    });

  return ins;
};

const main = () => {
  fs.readFile(file, "utf8", (err, data) => {
    if (err) return console.log(err);
    if (verbose) console.log("---\nBeginning calcuation of part one:\n---");
    const res1 = partOne(data);
    if (verbose) console.log("---\nBeginning calcuation of part two:\n---");
    const res2 = partTwo(data);

    if (verbose) console.log("---\nResults:\n---");
    console.log("Part One:", res1);
    console.log("Part Two:", res2);
  });
};

if (!argv.h) main();

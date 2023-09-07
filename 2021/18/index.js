#!/usr/bin/env node
import chalk from "chalk";
import fs from "fs";
import process from "process";
import { getArgs, colorize } from "../../shared/utils.js";

const argv = getArgs(process.argv.slice(2), "2021", "18");

const verbose = argv.v;
const file = argv.f;

const repeatStr = (str, amount) =>
  [...new Array(amount)].map(() => str).join("");

const buildSnailFishNumber = (depthList, flatList) => {
  let last;
  let rep = 0;
  const str =
    repeatStr("[", depthList[0]) +
    depthList
      .map((v, vi) => {
        let n = flatList[vi];
        let res;
        let pref;
        let suff = "";

        if (last === v) rep++;

        if (last < v) {
          pref = "," + repeatStr("[", v - last);
          rep = 0;
        } else if (last > v) {
          rep = 0;
          pref = repeatStr("]", last - v + 1) + ",";
          suff = "[";
        } else if (rep > 0 && rep % 2 !== 0) {
          pref = ",";
        } else {
          pref = "";
        }

        if (rep > 0 && rep % 2 === 0) {
          suff = repeatStr("]", rep / 2) + "," + repeatStr("[", rep / 2);
        }

        if (rep === 4) rep = 0;

        res = `${pref}${suff}${n}`;
        last = v;
        return res;
      })
      .join("") +
    repeatStr("]", depthList[depthList.length - 1]);
  return JSON.parse(str);
};

const oldBuild = (depthList, flatList) => {
  let last = 0;
  let runningSame = 0;
  const rebuiltStr =
    depthList
      .map((v, vi) => {
        let res;
        if (!last || last < v) {
          runningSame = 0;
          res =
            [...new Array(v - last)].map(() => "[").join("") +
            `${flatList[vi]},`;
        } else if (last > v) {
          runningSame = 0;
          res =
            [...new Array(last - v)].map(() => "]").join("") +
            (v > 1 && last - v > 1
              ? `],[${flatList[vi]},`
              : last > 1
              ? `,${flatList[vi]}],[`
              : `,${flatList[vi]}`);
        } else {
          if (runningSame++ > 0) {
            res = `,${flatList[vi]}`;
            if (runningSame === 2) {
              res = `],[${flatList[vi]},`;
              runningSame = 0;
            }
          } else res = `${flatList[vi]}`;
        }

        last = v;
        return res;
      })
      .join("") +
    [...new Array(depthList[depthList.length - 1])].map(() => "]").join("");

  const res = JSON.parse(rebuiltStr);

  return res;
};

const canSplit = (a) => flatten(a).some((e) => e > 9);

const printSnailFishNumber = (a) =>
  `[${a.reduce((acc, c) => {
    if (!acc && acc !== 0) acc = "";

    if (typeof c !== "number")
      return acc || acc === 0
        ? `${acc}, ${printSnailFishNumber(c)}`
        : printSnailFishNumber(c);
    else return acc || acc === 0 ? `${acc}, ${c}` : c;
  }, "")}]`;

const getDepthList = (a, depth = 1) =>
  a.reduce((acc, c) => {
    if (!acc || !acc.length) acc = [];
    let d = typeof c === "number" ? [depth] : getDepthList(c, depth + 1);
    return [...acc, ...d];
  }, []);

const flatten = (a) =>
  JSON.parse(`[${JSON.stringify(a).replace(/\[|\]/g, "")}]`);

// calculates the depth of a snailfish number
const findDepth = (a) =>
  a.reduce(
    (acc, c) => (typeof c !== "number" ? Math.max(findDepth(c) + 1, acc) : acc),
    1
  );

const split = (a) => {
  const flatList = flatten(a);
  const depthList = getDepthList(a);

  console.log({ flatList, depthList });

  const splitIndex = flatList.findIndex((e) => e > 9);
  if (splitIndex === -1) return a;

  let pop = flatList.splice(splitIndex, 1);
  flatList.splice(splitIndex, 0, Math.floor(pop / 2), Math.ceil(pop / 2));

  const depth = depthList[splitIndex];
  depthList.splice(splitIndex, 1, depth + 1, depth + 1);

  console.log({ flatList, depthList });

  return buildSnailFishNumber(depthList, flatList);
};

const explode = (a) => {
  const flatList = flatten(a);
  const depthList = getDepthList(a);

  const deepIndex = depthList.findIndex((i) => i > 4);
  if (deepIndex === -1) return a;

  if (deepIndex === 0) {
    let pop = flatList.splice(0, 2)[1];
    flatList[0] += pop;
    flatList.unshift(0);

    depthList.splice(0, 2, 4);
  } else if (deepIndex === depthList.length - 2) {
    let pop = flatList.splice(depthList.length - 2, 2)[0];
    flatList[flatList.length - 1] += pop;
    flatList.push(0);
    depthList.splice(depthList.length - 2, 2, 4);
  } else {
    let [pl, pr] = flatList.splice(deepIndex, 2, 0);
    flatList[deepIndex - 1] += pl;
    flatList[deepIndex + 1] += pr;
    depthList.splice(deepIndex, 2, 4);
  }

  return buildSnailFishNumber(depthList, flatList);
};

const snailReducer = (acc, c) => {
  let res;

  if (!acc || !acc.length) res = c;
  else res = [acc, c];

  while (findDepth(res) > 4 || canSplit(res)) {
    console.log({
      res: printSnailFishNumber(res),
      depth: findDepth(res),
      canSplit: canSplit(res),
    });
    while (findDepth(res) > 4) {
      console.log({ explode: printSnailFishNumber(res) });
      res = explode(res);
    }
    while (canSplit(res)) {
      console.log({ split: printSnailFishNumber(res) });
      res = split(res);
    }
  }

  return res;
};

// Main function to calculate and display part one
const partOne = (data) => {
  const dt = processData(data);
  const cleaned = dt.slice(
    0,
    dt.findIndex((i) => i === "---")
  );
  //cleaned.forEach((e) => console.log(e));

  //console.log("-------");
  //console.log(colorize(printSnailFishNumber(cleaned[0])));
  //console.log("depth", findDepth(cleaned[0]));

  //console.log("explode", explode(cleaned[0]));

  //console.log("flat", flatten(cleaned[0]));

  //console.log("depthlist", getDepthList(cleaned[0]));

  const res = cleaned.reduce(snailReducer, []);

  console.log("Final result:", printSnailFishNumber(res));

  return res;
};

// Main function to calculate and display part two
const partTwo = (data) => {
  const cleaned = processData(data);
  console.log("Todo");
};

// Read the input data
const processData = (data) =>
  data
    .trim()
    .split("\n")
    .map((n) => (n === "---" ? n : JSON.parse(n)));

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

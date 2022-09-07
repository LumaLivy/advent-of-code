#!/usr/bin/env node
import fs from "fs";
import process from "process";
import chalk from "chalk";
import { getArgs } from "../../shared/utils.js";

const argv = getArgs(process.argv.slice(2), "2021", "16");

const verbose = argv.v;
const file = argv.f;

const decodePacket = (packet, packetCollector) => {
  // push the cursor to infinity, this packet is done being analyzed (we hit trailing zeroes)
  if (packet.split("").every((d) => d === "0")) {
    return [Infinity, null];
  }

  // extract packet header
  const version = packet.substring(0, 3);
  const typeId = packet.substring(3, 6);

  if (typeId === "100") {
    // It's a "literal value" packet, so extract contents into groups of 5
    let contents = packet.substring(6).match(/.{1,5}/g);

    // double check that the last element has only trailing zeroes if it isn't a full byte + prefix
    if (
      contents[contents.length - 1].length < 5 &&
      contents[contents.length - 1].split("").some((d) => d !== "0")
    ) {
      console.log("Warning, corrupt bits detected in packet.");
    }

    // keep only the literals we need
    contents = contents.slice(
      0,
      contents.findIndex((i) => i.slice(0, 1) === "0") + 1
    );

    // cut off the indicator bits and convert to decimal value
    const literalValue = parseInt(contents.map((b) => b.slice(1)).join(""), 2);

    const data = { packet, version, typeId, contents, literalValue };
    packetCollector.push(data);

    // tell where to start the next decoding operation
    return [6 + contents.join("").length, literalValue];
  } else {
    // check to see what kind of operator packet we're dealing with
    const lengthTypeId = packet.substring(6, 7);

    let accumulator;
    let currentValue;

    let operation;

    //calculate the operation to be performed on the subpackets
    switch (typeId) {
      case "000":
        operation = (acc, cur) => acc + cur;
        accumulator = 0;
        break;
      case "001":
        operation = (acc, cur) => acc * cur;
        accumulator = 1;
        break;
      case "010":
        operation = Math.min;
        accumulator = Infinity;
        break;
      case "011":
        operation = Math.max;
        accumulator = -1;
        break;
      case "101":
        operation = (acc, cur) => (acc !== null ? +(acc > cur) : cur);
        accumulator = null;
        break;
      case "110":
        operation = (acc, cur) => (acc !== null ? +(acc < cur) : cur);
        accumulator = null;
        break;
      case "111":
        operation = (acc, cur) => (acc !== null ? +(acc === cur) : cur);
        accumulator = null;
        break;
    }

    if (lengthTypeId === "0") {
      // count subpackets by total length
      const lengthOfSubPackets = parseInt(packet.substring(7, 22), 2);
      packetCollector.push({ packet, version, typeId, lengthOfSubPackets });

      let nextIndex = 0;
      let cursor = 0;
      while (cursor < lengthOfSubPackets) {
        [nextIndex, currentValue] = decodePacket(
          packet.substring(22 + cursor),
          packetCollector
        );

        if (currentValue !== null)
          accumulator = operation(accumulator, currentValue);
        cursor += nextIndex;
      }

      return [22 + lengthOfSubPackets, accumulator];
    } else if (lengthTypeId === "1") {
      // count subpackets by # of subpackets
      const numberOfSubPackets = parseInt(packet.substring(7, 18), 2);
      packetCollector.push({ packet, version, typeId, numberOfSubPackets });

      let nextIndex = 0;
      let sum = 0;
      let cursor = 0;
      while (sum < numberOfSubPackets) {
        [nextIndex, currentValue] = decodePacket(
          packet.substring(18 + cursor),
          packetCollector
        );
        if (currentValue !== null)
          accumulator = operation(accumulator, currentValue);
        cursor += nextIndex;
        sum += 1;
      }

      return [18 + cursor, accumulator];
    } else {
      //something is very wrong
      console.log("Warning, corrupt bits detected in packet.");
    }
  }
};

// Main function to calculate and display part one
const partOne = (data) => {
  let res;
  const cleaned = processData(data);
  cleaned.forEach((l) => {
    let packets = [];
    const bin = l
      .split("")
      .map((d) => parseInt(d, 16).toString(2).padStart(4, "0"))
      .join("");
    let nextIndex = 0;
    while (nextIndex < bin.length) {
      [nextIndex] = decodePacket(bin.slice(nextIndex), packets);
    }

    res = packets.reduce((acc, p) => {
      if (verbose) {
        if (p.contents) {
          console.log(
            `${chalk.red(p.version)}${chalk.green(p.typeId)}${chalk.blue(
              p.contents.join("")
            )} -> (${chalk.yellow(
              `${parseInt(p.contents.map((b) => b.slice(1)).join(""), 2)}`
            )})`
          );
        } else {
          console.log(
            `${chalk.red(p.version)}${chalk.green(p.typeId)} -> ${chalk.yellow(
              p.lengthOfSubPackets
                ? `${p.lengthOfSubPackets} bit(s)`
                : p.numberOfSubPackets
                ? `${p.numberOfSubPackets} packet(s)`
                : ""
            )}`
          );
        }
      }

      return acc + parseInt(p.version, 2);
    }, 0);
  });

  return res;
};

// Main function to calculate and display part two
const partTwo = (data) => {
  let res, acc;
  const cleaned = processData(data);
  cleaned.forEach((l) => {
    let packets = [];
    const bin = l
      .split("")
      .map((d) => parseInt(d, 16).toString(2).padStart(4, "0"))
      .join("");
    let nextIndex = 0;
    while (nextIndex < bin.length) {
      [nextIndex, acc] = decodePacket(bin.slice(nextIndex), packets);
      if (acc !== null) res = acc;
    }
  });

  return res;
};

// Read the input data
const processData = (data) =>
  data
    .trim()
    .split("\n")
    .map((n) => n);

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

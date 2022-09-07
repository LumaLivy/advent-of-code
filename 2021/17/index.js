#!/usr/bin/env node
import fs from "fs";
import process from "process";
import { getArgs, colorize } from "../../shared/utils.js";

const argv = getArgs(process.argv.slice(2), "2021", "17");

const verbose = argv.v;
const file = argv.f;

// I wrote this because I wasn't sure if I'd need math sum notation of an algebraic function. applying (i) => i to the func just sums up all the numbers between start and end
const sumFunc = (start, end, func) => {
  let res = 0;
  for (let i = start; i < end; i++) {
    res += func(i);
  }
  return res;
};

// Main function to calculate and display part one
const partOne = (data) => {
  const [[xMin, xMax], [yMin, yMax]] = processData(data);

  // NOTE: The gravity/water resistance in this world is 1 units/step, as per the problem, and the target zone is always below the starting point (because it's in the trench we're floating over, assumingly)

  // we can forget about the horizontal component of movement for part one

  // solution via reasoning: shooting upwards from height 0 (with positive vertical velocity) will eventually make the probe return back to height zero again, but with negative starting vertical velocity. The next step will have velocity [n - (1 units/step)], where n is the starting velocity. So, if the starting vertical velocity increases past the absolute value of the minimum depth (the bottom of the target range), the probe will end up missing it by one vertical unit on the way down and sink too far.

  // So, using the starting vertical velocity as the absolute value of the minimum target depth range, the maximum height reached will just be the sum of the velocities until the y velocity reaches zero (the apex). I used a shortcut for sum calculation with the common math formula n(n+1)/2.

  if (verbose) console.log({ xMin, yMin }, { xMax, yMax });

  return (yMin * (yMin + 1)) / 2;
};

// Main function to calculate and display part two
const partTwo = (data) => {
  const [[xMin, xMax], [yMin, yMax]] = processData(data);

  // for this part we can immediately know that the max horizontal velocity is the farthest edge (xMax) because if we go past that in the first step, we miss entirely. Maximum y velocity comes from part one

  // we now have a maximum velocity of [xMax, |yMin|]

  // Similarly, we can know the minimum vertical velocity because if we shoot further down than yMin in a single step, we'll miss the bottom of the range. The reason we don't look at yMax is because gravity will always take us downwards.

  // Now, to find the minimum horizontal velocity we need, we need to find a number such that we end up just barely touching the xMin with x velocity zero, or in other words, the maximum number of horizontal steps possible to barely make it to the zone. We could have also started from zero (or slightly higher from just guessing) but this optimizes the calculation slightly

  let minXVel = 0;
  let xDist = 0;
  while (xDist <= xMin) {
    minXVel++;
    xDist = (minXVel * (minXVel + 1)) / 2;
  }

  // So our minimum velocity is now [minXVel, yMin]

  // Now we have everything we need to just brute force :) sorry for not being more creative with it, but it gets the job done instantly for coordinates of this size anyways.

  if (verbose)
    console.log(
      "Checking all velocities in range of",
      colorize(`[${minXVel},${yMin}]..[${xMax},${Math.abs(yMin)}]`)
    );

  let res = 0;

  for (let xVel = minXVel; xVel <= xMax; xVel++) {
    for (let yVel = yMin; yVel <= Math.abs(yMin); yVel++) {
      let pos = [0, 0];
      let vel = [xVel, yVel];
      while (pos[0] <= xMax && pos[1] >= yMin) {
        pos[0] += Math.max(vel[0]--, 0);
        pos[1] += vel[1]--;
        if (
          pos[0] <= xMax &&
          pos[0] >= xMin &&
          pos[1] <= yMax &&
          pos[1] >= yMin
        ) {
          res++;
          break;
        }
      }
    }
  }
  return res;
};

// Read the input data
const processData = (data) =>
  data
    .trim()
    .split("\n")
    .map((n) => n.split(" "))[0]
    .slice(2)
    .map((n) =>
      n
        .slice(2)
        .split("..")
        .map((num) => parseInt(num))
        .sort((a, b) => a < b)
    );

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

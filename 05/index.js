#!/usr/bin/env node
import fs from "fs";
import process from "process";
import { getArgs, colorize } from "../shared/utils.js";

const argv = getArgs(process.argv.slice(2), "05");

const verbose = argv.v;
const file = argv.f;

function Line(p1, p2) {
  this.p1 = p1;
  this.p2 = p2;

  this.getSlope = function () {
    if (Math.abs(this.p2.x - this.p1.x) === 0) {
      if (Math.abs(this.p2.y - this.p1.y) === 0) {
        return null;
      }
      return Infinity;
    }
    return (this.p2.y - this.p1.y) / (this.p2.x - this.p1.x);
  };

  this.getIntercept = function () {
    const slope = this.getSlope();
    if (slope === null) return null;
    const intercept = this.p1.y - slope * this.p1.x;
    if (Math.abs(intercept) === Infinity) {
      if (verbose) console.log(`Intercept is null for ${this.toString()}`);
      return null;
    }
    return intercept;
  };

  this.isHorizontal = function () {
    return this.getSlope() === 0;
  };

  this.isVertical = function () {
    return Math.abs(this.getSlope()) === Infinity;
  };

  this.isOrthogonal = function () {
    return this.isVertical() || this.isHorizontal();
  };

  this.getRange = function () {
    return [
      new Point(Math.min(this.p1.x, this.p2.x), Math.min(this.p1.y, this.p2.y)),
      new Point(Math.max(this.p1.x, this.p2.x), Math.max(this.p1.y, this.p2.y)),
    ];
  };

  this.getMinMax = function () {
    return this.p1.x < this.p2.x ? [this.p1, this.p2] : [this.p2, this.p1];
  };

  this.toPolynomialString = function (detailed = false) {
    const intercept = this.getIntercept();
    const slope = this.getSlope();

    const ps = detailed ? ` | ${this.toString()}` : "";

    if (this.isHorizontal()) return `y = ${this.p1.y}${ps}`;
    if (this.isVertical()) return `x = ${this.p1.x}${ps}`;

    const interceptString =
      intercept > 0
        ? `+ ${intercept}`
        : intercept < 0
        ? `- ${Math.abs(intercept)}`
        : "";

    if (slope === 1) return `y = x ${interceptString}${ps}`;
    if (slope === -1) return `y = -x ${interceptString}${ps}`;
    return `y = ${slope}x ${interceptString}${ps}`;
  };

  this.toString = function () {
    return `${this.p1.toString()} -> ${this.p2.toString()}`;
  };

  this.equals = function (other) {
    return this.p1.equals(other.p1) && this.p2.equals(other.p2);
  };
}

function Point(x, y) {
  this.x = x;
  this.y = y;

  this.toString = function () {
    return colorize(`(${this.x}, ${this.y})`);
  };

  this.equals = function (other) {
    return this.x === other.x && this.y === other.y;
  };
}

// Main function to calculate and display part one
const partOne = (data) => {
  const orthoLines = data.filter((l) => l.isOrthogonal());

  let cWidth = 0;
  let cHeight = 0;
  orthoLines.forEach((l) => {
    const [, max] = l.getMinMax();
    cWidth = Math.max(max.x, cWidth);
    cHeight = Math.max(max.y, cHeight);
  });

  if (verbose)
    console.log(
      colorize(`${orthoLines.length}/${data.length} lines are orthogonal`)
    );

  const width = cWidth;
  const height = cHeight;

  const field = [...new Array(height + 1)].map(() =>
    [...new Array(width + 1)].map(() => {
      return 0;
    })
  );

  if (verbose) {
    console.log(
      colorize(`Created field of size (${width + 1}, ${height + 1})`)
    );
    console.log("Writing lines to field...");
  }
  orthoLines.forEach((l) => {
    const [min, max] = l.getRange();
    for (let x = min.x; x <= max.x; x++) {
      for (let y = min.y; y <= max.y; y++) {
        field[x][y]++;
      }
    }
  });

  console.log("Finding intersections...");

  const count = field.reduce((xTotal, x, xi) => {
    xTotal += x.reduce((yTotal, y, yi) => {
      if (y > 1) {
        yTotal += 1;
      }
      return yTotal;
    }, 0);
    return xTotal;
  }, 0);

  console.log(colorize(`Found ${count} intersection(s).`));
  return count;
};

// Main function to calculate and display part two
const partTwo = (data) => {
  let cWidth = 0;
  let cHeight = 0;
  data.forEach((l) => {
    const [, max] = l.getMinMax();
    cWidth = Math.max(max.x, cWidth);
    cHeight = Math.max(max.y, cHeight);
  });

  const width = cWidth;
  const height = cHeight;

  const field = [...new Array(height + 1)].map(() =>
    [...new Array(width + 1)].map(() => {
      return 0;
    })
  );

  if (verbose) {
    console.log(
      colorize(`Created field of size (${width + 1}, ${height + 1})`)
    );
    console.log("Writing lines to field...");
  }

  data.forEach((l) => {
    if (l.isOrthogonal()) {
      const [min, max] = l.getRange();
      for (let x = min.x; x <= max.x; x++) {
        for (let y = min.y; y <= max.y; y++) {
          field[x][y]++;
        }
      }
    } else {
      const [min, max] = l.getMinMax();
      let i = 0;
      for (let x = min.x; x <= max.x; x++) {
        const y = min.y + i;
        i += min.y < max.y ? 1 : -1;
        field[x][y]++;
      }
    }
  });

  console.log("Finding intersections...");

  const count = field.reduce((xTotal, x, xi) => {
    xTotal += x.reduce((yTotal, y, yi) => {
      if (y > 1) {
        yTotal += 1;
      }
      return yTotal;
    }, 0);
    return xTotal;
  }, 0);

  console.log(colorize(`Found ${count} intersection(s).`));
  return count;
};

// Read the input data
const processData = (data) =>
  data
    .trim()
    .split("\n")
    .map((n) => {
      const [p1, p2] = n.split("->");
      const [x1, y1] = p1.split(",");
      const [x2, y2] = p2.split(",");
      return new Line(
        new Point(parseInt(x1), parseInt(y1)),
        new Point(parseInt(x2), parseInt(y2))
      );
    });

const main = () => {
  fs.readFile(file, "utf8", (err, data) => {
    if (err) return console.log(err);
    const cleaned = processData(data);
    if (verbose) console.log("---\nBeginning calcuation of part one:\n---");
    const res1 = partOne(cleaned, verbose);
    if (verbose) console.log("---\nBeginning calcuation of part two:\n---");
    const res2 = partTwo(cleaned, verbose);

    if (verbose) console.log("---\nResults:\n---");
    console.log("Part One:", res1);
    console.log("Part Two:", res2);
  });
};

if (!argv.h) main();

const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const mcd = (x, y) => {
  if (typeof x !== "number" || typeof y !== "number") return false;
  x = Math.abs(x);
  y = Math.abs(y);
  while (y) {
    let t = y;
    y = x % y;
    x = t;
  }
  return x;
};

const jug = (
  levelFirst,
  levelSecond,
  target,
  levelNameFirst,
  levelNameSecond
) => {
  let levelSecondTo = levelSecond;
  let levelFirstFrom = 0;

  const steps = [];
  steps.push({
    [levelNameFirst]: levelFirstFrom,
    [levelNameSecond]: levelSecondTo,
    Explanation: `Fill ${levelNameSecond}`,
  });

  while (levelSecondTo !== target && levelFirstFrom !== target) {
    const temp = Math.min(levelSecondTo, levelFirst - levelFirstFrom);

    levelFirstFrom += temp;
    levelSecondTo -= temp;

    steps.push({
      [levelNameFirst]: levelFirstFrom,
      [levelNameSecond]: levelSecondTo,
      Explanation: `Transfer ${levelNameSecond} to ${levelNameFirst}`,
    });

    if (levelSecondTo === target || levelFirstFrom === target) {
      break;
    }

    if (levelSecondTo === 0) {
      levelSecondTo = levelSecond;
      steps.push({
        [levelNameFirst]: levelFirstFrom,
        [levelNameSecond]: levelSecondTo,
        Explanation: `Fill ${levelNameSecond}`,
      });
    }

    if (levelFirstFrom === levelFirst) {
      levelFirstFrom = 0;
      steps.push({
        [levelNameFirst]: levelFirstFrom,
        [levelNameSecond]: levelSecondTo,
        Explanation: `Empty ${levelNameFirst}`,
      });
    }
  }
  return steps;
};

const llenarX = (firstBucket, secondBucket, target) =>
  jug(firstBucket, secondBucket, target, "Bucket X", "Bucket Y");
const llenarY = (firstBucket, secondBucket, target) =>
  jug(firstBucket, secondBucket, target, "Bucket Y", "Bucket X");

const orderFunction = (value) => {
  return Object.keys(value)
    .sort()
    .reduce((obj, key) => {
      obj[key] = value[key];
      return obj;
    }, {});
};

const orderKeys = (array) => {
  return array.map(orderFunction);
};

const shortestPath = (x, y, z) => {
  let finalResult = null;
  const startX = llenarX(x, y, z);
  const startY = llenarY(y, x, z);

  if (startX.length > startY.length) {
    finalResult = orderKeys(startY);
  }

  if (startY.length > startX.length) {
    finalResult = orderKeys(startX);
  }

  return finalResult;
};

const waterJugChallenge = (x, y, z) => {
  if (z > y && z > x) return null;
  if (z % mcd(x, y) !== 0) return null;
  if (z % mcd(y, x) !== 0) return null;

  return shortestPath(x, y, z);
};

const startOverQuestions = () => {
  rl.question("Start over? [y/N]: ", (answer) => {
    if (answer.toLowerCase() === "y") {
      startQuestions();
    } else if (answer.toLowerCase() === "n") {
      rl.close();
    } else {
      console.log("unknown answer, try again");
      console.log("\t");
      startOverQuestions();
    }
  });
};

const startQuestions = () => {
  rl.question("Bucket X: ", (bucketX) => {
    rl.question("Bucket Y: ", (bucketY) => {
      rl.question("Amount wanted Z: ", (targetZ) => {
        const result = waterJugChallenge(
          Number(bucketX),
          Number(bucketY),
          Number(targetZ)
        );
        if (result == null) {
          console.log("No Solution");
          startOverQuestions();
          return;
        }

        console.table(result);
        startOverQuestions();
      });
    });
  });
};

startQuestions();

rl.on("close", function () {
  console.log("\nBYE BYE !!!");
  process.exit(0);
});

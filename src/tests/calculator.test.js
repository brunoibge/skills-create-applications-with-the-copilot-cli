const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const path = require("node:path");
const test = require("node:test");
const { calculate, modulo, power, squareRoot } = require("../calculator");

const calculatorPath = path.join(__dirname, "..", "calculator.js");

function runCLI(...args) {
  return spawnSync(process.execPath, [calculatorPath, ...args], {
    encoding: "utf8",
  });
}

test("addition supports the image example and the + symbol", () => {
  assert.equal(calculate(2, "addition", 3), 5);
  assert.equal(calculate(2, "+", 3), 5);
  assert.equal(calculate(-2, "addition", 3), 1);
});

test("subtraction supports the image example and subtraction symbols", () => {
  assert.equal(calculate(10, "subtraction", 4), 6);
  assert.equal(calculate(10, "-", 4), 6);
  assert.equal(calculate(10, "−", 4), 6);
  assert.equal(calculate(3, "subtraction", 5), -2);
});

test("multiplication supports the image example and multiplication symbols", () => {
  assert.equal(calculate(45, "multiplication", 2), 90);
  assert.equal(calculate(45, "*", 2), 90);
  assert.equal(calculate(45, "×", 2), 90);
  assert.equal(calculate(-3, "multiplication", 4), -12);
  assert.equal(calculate(0, "multiplication", 4), 0);
});

test("division supports the image example and division symbols", () => {
  assert.equal(calculate(20, "division", 5), 4);
  assert.equal(calculate(20, "/", 5), 4);
  assert.equal(calculate(20, "÷", 5), 4);
  assert.equal(calculate(7, "division", 2), 3.5);
  assert.equal(calculate(-12, "division", 3), -4);
});

test("modulo returns the remainder and rejects a zero divisor", () => {
  assert.equal(modulo(10, 3), 1);
  assert.equal(modulo(-10, 3), -1);
  assert.equal(calculate(10, "modulo", 3), 1);
  assert.equal(calculate(10, "%", 3), 1);
  assert.throws(() => modulo(10, 0), /módulo por zero/);
  assert.throws(() => calculate(10, "%", 0), /módulo por zero/);
});

test("power raises a base to an exponent", () => {
  assert.equal(power(2, 3), 8);
  assert.equal(power(2, -2), 0.25);
  assert.equal(calculate(2, "power", 3), 8);
  assert.equal(calculate(2, "^", 3), 8);
});

test("squareRoot returns the square root and rejects negative numbers", () => {
  assert.equal(squareRoot(9), 3);
  assert.equal(squareRoot(0), 0);
  assert.equal(squareRoot(2), Math.sqrt(2));
  assert.throws(() => squareRoot(-1), /número negativo/);
});

test("operation names are case-insensitive", () => {
  assert.equal(calculate(2, "ADDITION", 3), 5);
  assert.equal(calculate(10, "Subtraction", 4), 6);
  assert.equal(calculate(45, "MULTIPLICATION", 2), 90);
  assert.equal(calculate(20, "Division", 5), 4);
});

test("rejects division by zero for every division operator", () => {
  for (const operation of ["division", "/", "÷"]) {
    assert.throws(() => calculate(20, operation, 0), /dividir por zero/);
  }
});

test("rejects unsupported operations", () => {
  assert.throws(() => calculate(2, "logarithm", 3), /Operação inválida/);
});

test("CLI prints the calculation result", () => {
  const result = runCLI("2", "+", "3");

  assert.equal(result.status, 0);
  assert.equal(result.stdout.trim(), "5");
  assert.equal(result.stderr, "");
});

test("CLI supports modulo, power, and square root", () => {
  const moduloResult = runCLI("5", "%", "2");
  assert.equal(moduloResult.status, 0);
  assert.equal(moduloResult.stdout.trim(), "1");

  const powerResult = runCLI("2", "^", "3");
  assert.equal(powerResult.status, 0);
  assert.equal(powerResult.stdout.trim(), "8");

  const squareRootResult = runCLI("squareRoot", "16");
  assert.equal(squareRootResult.status, 0);
  assert.equal(squareRootResult.stdout.trim(), "4");

  const negativeSquareRoot = runCLI("squareRoot", "-1");
  assert.notEqual(negativeSquareRoot.status, 0);
  assert.match(negativeSquareRoot.stderr, /número negativo/);
});

test("CLI reports invalid arguments and numbers", () => {
  const missingArguments = runCLI("2", "+");
  assert.notEqual(missingArguments.status, 0);
  assert.match(missingArguments.stderr, /Uso:/);

  const invalidNumber = runCLI("two", "+", "3");
  assert.notEqual(invalidNumber.status, 0);
  assert.match(invalidNumber.stderr, /números válidos/);
});

test("CLI reports division by zero and unsupported operations", () => {
  const divisionByZero = runCLI("20", "/", "0");
  assert.notEqual(divisionByZero.status, 0);
  assert.match(divisionByZero.stderr, /dividir por zero/);

  const invalidOperation = runCLI("2", "logarithm", "3");
  assert.notEqual(invalidOperation.status, 0);
  assert.match(invalidOperation.stderr, /Operação inválida/);
});

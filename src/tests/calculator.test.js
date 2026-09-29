const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const path = require("node:path");
const test = require("node:test");
const { calculate } = require("../calculator");

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
  assert.throws(() => calculate(2, "power", 3), /Operação inválida/);
});

test("CLI prints the calculation result", () => {
  const result = runCLI("2", "+", "3");

  assert.equal(result.status, 0);
  assert.equal(result.stdout.trim(), "5");
  assert.equal(result.stderr, "");
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

  const invalidOperation = runCLI("2", "^", "3");
  assert.notEqual(invalidOperation.status, 0);
  assert.match(invalidOperation.stderr, /Operação inválida/);
});

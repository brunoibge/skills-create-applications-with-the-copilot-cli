#!/usr/bin/env node

function modulo(a, b) {
  if (b === 0) {
    throw new Error("Não é possível calcular o módulo por zero.");
  }

  return a % b;
}

function power(base, exponent) {
  return base ** exponent;
}

function squareRoot(n) {
  if (n < 0) {
    throw new Error("Não é possível calcular a raiz quadrada de um número negativo.");
  }

  return Math.sqrt(n);
}

// Operações suportadas: addition (+), subtraction (-), multiplication (×), division (÷),
// modulo (%) e power (^).
const operations = {
  addition: (a, b) => a + b,
  "+": (a, b) => a + b,
  subtraction: (a, b) => a - b,
  "-": (a, b) => a - b,
  "−": (a, b) => a - b,
  multiplication: (a, b) => a * b,
  "*": (a, b) => a * b,
  "×": (a, b) => a * b,
  division: (a, b) => a / b,
  "/": (a, b) => a / b,
  "÷": (a, b) => a / b,
  modulo,
  "%": modulo,
  power,
  "^": power,
};

function calculate(first, operation, second) {
  const normalizedOperation = operation.toLowerCase();
  const calculateOperation = operations[normalizedOperation];

  if (!calculateOperation) {
    throw new Error(
      "Operação inválida. Use addition, subtraction, multiplication, division, modulo ou power.",
    );
  }

  if (
    ["division", "/", "÷", "modulo", "%"].includes(normalizedOperation)
  ) {
    if (second === 0) {
      throw new Error(
        normalizedOperation === "modulo" || normalizedOperation === "%"
          ? "Não é possível calcular o módulo por zero."
          : "Não é possível dividir por zero.",
      );
    }
  }

  return calculateOperation(first, second);
}

function main(args) {
  const isSquareRoot =
    args.length === 2 &&
    ["squareroot", "sqrt"].includes(args[0].toLowerCase());
  if (args.length !== 3 && !isSquareRoot) {
    throw new Error(
      "Uso: node src/calculator.js <número1> <operação> <número2> ou node src/calculator.js squareRoot <número>",
    );
  }

  if (isSquareRoot) {
    const input = args[1];
    if (input.trim() === "") {
      throw new Error("Informe um número válido.");
    }
    const number = Number(input);
    if (!Number.isFinite(number)) {
      throw new Error("Informe um número válido.");
    }

    console.log(squareRoot(number));
    return;
  }

  const [firstInput, operation, secondInput] = args;
  if (firstInput.trim() === "" || secondInput.trim() === "") {
    throw new Error("Informe dois números válidos.");
  }

  const first = Number(firstInput);
  const second = Number(secondInput);
  if (!Number.isFinite(first) || !Number.isFinite(second)) {
    throw new Error("Informe dois números válidos.");
  }

  console.log(calculate(first, operation, second));
}

if (require.main === module) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { calculate, modulo, power, squareRoot };

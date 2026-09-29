#!/usr/bin/env node

// Operações suportadas: addition (+), subtraction (-), multiplication (×) e division (÷).
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
};

function calculate(first, operation, second) {
  const normalizedOperation = operation.toLowerCase();
  const calculateOperation = operations[normalizedOperation];

  if (!calculateOperation) {
    throw new Error(
      "Operação inválida. Use addition, subtraction, multiplication ou division.",
    );
  }

  if (normalizedOperation === "division" || ["/", "÷"].includes(normalizedOperation)) {
    if (second === 0) {
      throw new Error("Não é possível dividir por zero.");
    }
  }

  return calculateOperation(first, second);
}

function main(args) {
  if (args.length !== 3) {
    throw new Error(
      "Uso: node src/calculator.js <número1> <operação> <número2>",
    );
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

module.exports = { calculate };

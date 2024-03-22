// Оперативная память

const RAM = "000b01020401030101";

// Регистры процессора

let instructionPointer;
let accumulator;
let operand_1;
let operand_2;

// Инструкции процессора

const instructions = {
  SET_A: "00",
  PRINT_A: "01",
  ADD_A: "02",
  DEC_A: "03",
};

// Виртуальная машина

function compute() {
  for (let i = 0; i < RAM.length; ) {
    instructionPointer = RAM.slice(i, i + 2);

    switch (instructionPointer) {
      case instructions["SET_A"]:
        operand_1 = RAM.slice(i + 2, i + 4);
        setAccumulator(operand_1);
        i += 4;
        resetOperandsRegisters();
        break;

      case instructions["PRINT_A"]:
        console.log(accumulator);
        i += 2;
        break;

      case instructions["ADD_A"]:
        operand_1 = RAM.slice(i + 2, i + 4);

        let decimalAccumulator_ADD_A = parseInt(accumulator, 16);
        let decimalOperand1_ADD_A = parseInt(operand_1, 16);
        let decimalSum = decimalAccumulator_ADD_A + decimalOperand1_ADD_A;

        accumulator = decimalSum.toString(16);
        i += 4;
        resetOperandsRegisters();
        break;

      case instructions["DEC_A"]:
        operand_1 = RAM.slice(i + 2, i + 4);

        let decimalAccumulator_DEC_A = parseInt(accumulator, 16);
        let decimalOperand1_DEC_A = parseInt(operand_1, 16);
        let decimalDec = decimalAccumulator_DEC_A - decimalOperand1_DEC_A;

        accumulator = decimalDec.toString(16);
        i += 4;
        resetOperandsRegisters();
        break;
    }
  }
}

compute();

// Функции инструкций

function setAccumulator(operand) {
  accumulator = parseInt(operand, 16);
}

function resetOperandsRegisters() {
  operand_1 = null;
  operand_2 = null;
}

const readlineSync = require('readline-sync');

const OPERATION_CODES = {
  TOTAL: 'TOTAL ',
  CREDIT: 'CREDIT',
  DEBIT: 'DEBIT ',
  READ: 'READ',
  WRITE: 'WRITE',
};

class DataProgram {
  constructor() {
    this.storageBalance = 1000.0;
  }

  execute(operationType, balance) {
    if (operationType === OPERATION_CODES.READ) {
      return this.storageBalance;
    }

    if (operationType === OPERATION_CODES.WRITE) {
      this.storageBalance = balance;
      return this.storageBalance;
    }

    return balance;
  }
}

class Operations {
  constructor(dataProgram) {
    this.dataProgram = dataProgram;
  }

  execute(operationType) {
    if (operationType === OPERATION_CODES.TOTAL) {
      const finalBalance = this.dataProgram.execute(OPERATION_CODES.READ, 0);
      console.log(`Current balance: ${finalBalance.toFixed(2)}`);
      return;
    }

    if (operationType === OPERATION_CODES.CREDIT) {
      const amount = this.promptForAmount('Enter credit amount: ');
      if (amount === null) {
        return;
      }

      let finalBalance = this.dataProgram.execute(OPERATION_CODES.READ, 0);
      finalBalance += amount;
      this.dataProgram.execute(OPERATION_CODES.WRITE, finalBalance);
      console.log(`Amount credited. New balance: ${finalBalance.toFixed(2)}`);
      return;
    }

    if (operationType === OPERATION_CODES.DEBIT) {
      const amount = this.promptForAmount('Enter debit amount: ');
      if (amount === null) {
        return;
      }

      let finalBalance = this.dataProgram.execute(OPERATION_CODES.READ, 0);
      if (finalBalance >= amount) {
        finalBalance -= amount;
        this.dataProgram.execute(OPERATION_CODES.WRITE, finalBalance);
        console.log(`Amount debited. New balance: ${finalBalance.toFixed(2)}`);
      } else {
        console.log('Insufficient funds for this debit.');
      }
    }
  }

  promptForAmount(promptText) {
    const input = readlineSync.question(promptText);
    const amount = Number.parseFloat(input);

    if (Number.isNaN(amount)) {
      console.log('Invalid amount. Please enter a numeric value.');
      return null;
    }

    return amount;
  }
}

function runApp() {
  const dataProgram = new DataProgram();
  const operations = new Operations(dataProgram);
  let continueFlag = 'YES';

  while (continueFlag !== 'NO') {
    console.log('--------------------------------');
    console.log('Account Management System');
    console.log('1. View Balance');
    console.log('2. Credit Account');
    console.log('3. Debit Account');
    console.log('4. Exit');
    console.log('--------------------------------');

    const choiceInput = readlineSync.question('Enter your choice (1-4): ');
    const userChoice = Number.parseInt(choiceInput, 10);

    switch (userChoice) {
      case 1:
        operations.execute(OPERATION_CODES.TOTAL);
        break;
      case 2:
        operations.execute(OPERATION_CODES.CREDIT);
        break;
      case 3:
        operations.execute(OPERATION_CODES.DEBIT);
        break;
      case 4:
        continueFlag = 'NO';
        break;
      default:
        console.log('Invalid choice, please select 1-4.');
        break;
    }
  }

  console.log('Exiting the program. Goodbye!');
}

if (require.main === module) {
  runApp();
}

module.exports = {
  runApp,
  DataProgram,
  Operations,
  OPERATION_CODES,
};

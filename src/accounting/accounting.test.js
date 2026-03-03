jest.mock('readline-sync', () => ({
  question: jest.fn(),
}));

const readlineSync = require('readline-sync');
const { runApp } = require('./index');

function captureLogs() {
  return jest.spyOn(console, 'log').mockImplementation(() => {});
}

function logMessages(logSpy) {
  return logSpy.mock.calls.map(([message]) => String(message));
}

function runWithInputs(inputs) {
  readlineSync.question.mockReset();
  inputs.forEach((input) => {
    readlineSync.question.mockImplementationOnce(() => input);
  });
  runApp();
}

describe('COBOL parity test plan scenarios', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('TC-001: displays the full main menu with options 1-4', () => {
    const logSpy = captureLogs();

    runWithInputs(['4']);

    const output = logMessages(logSpy);
    expect(output).toContain('Account Management System');
    expect(output).toContain('1. View Balance');
    expect(output).toContain('2. Credit Account');
    expect(output).toContain('3. Debit Account');
    expect(output).toContain('4. Exit');
    expect(readlineSync.question).toHaveBeenCalledWith('Enter your choice (1-4): ');
  });

  test('TC-002: option 1 shows initial balance 1000.00', () => {
    const logSpy = captureLogs();

    runWithInputs(['1', '4']);

    const output = logMessages(logSpy);
    expect(output).toContain('Current balance: 1000.00');
  });

  test('TC-003: credit increases balance and persists in same run', () => {
    const logSpy = captureLogs();

    runWithInputs(['2', '250.50', '1', '4']);

    const output = logMessages(logSpy);
    expect(output).toContain('Amount credited. New balance: 1250.50');
    expect(output).toContain('Current balance: 1250.50');
  });

  test('TC-004: debit decreases balance when funds are sufficient', () => {
    const logSpy = captureLogs();

    runWithInputs(['3', '200.00', '1', '4']);

    const output = logMessages(logSpy);
    expect(output).toContain('Amount debited. New balance: 800.00');
    expect(output).toContain('Current balance: 800.00');
  });

  test('TC-005: debit is blocked when funds are insufficient', () => {
    const logSpy = captureLogs();

    runWithInputs(['3', '1500.00', '1', '4']);

    const output = logMessages(logSpy);
    expect(output).toContain('Insufficient funds for this debit.');
    expect(output).toContain('Current balance: 1000.00');
  });

  test('TC-006: invalid menu input is handled and loop continues', () => {
    const logSpy = captureLogs();

    runWithInputs(['9', '4']);

    const output = logMessages(logSpy);
    expect(output).toContain('Invalid choice, please select 1-4.');
    const menuCount = output.filter((line) => line === 'Account Management System').length;
    expect(menuCount).toBe(2);
  });

  test('TC-007: option 4 exits and terminates program', () => {
    const logSpy = captureLogs();

    runWithInputs(['4']);

    const output = logMessages(logSpy);
    const menuCount = output.filter((line) => line === 'Account Management System').length;
    expect(menuCount).toBe(1);
    expect(output).toContain('Exiting the program. Goodbye!');
  });

  test('TC-008: sequential transactions preserve in-memory balance', () => {
    const logSpy = captureLogs();

    runWithInputs(['2', '100.00', '3', '40.00', '1', '4']);

    const output = logMessages(logSpy);
    expect(output).toContain('Amount credited. New balance: 1100.00');
    expect(output).toContain('Amount debited. New balance: 1060.00');
    expect(output).toContain('Current balance: 1060.00');
  });

  test('TC-009: debit equal to current balance results in zero balance', () => {
    const logSpy = captureLogs();

    runWithInputs(['3', '1000.00', '1', '4']);

    const output = logMessages(logSpy);
    expect(output).toContain('Amount debited. New balance: 0.00');
    expect(output).toContain('Current balance: 0.00');
  });

  test('TC-010: zero credit amount is accepted and balance is unchanged', () => {
    const logSpy = captureLogs();

    runWithInputs(['2', '0.00', '1', '4']);

    const output = logMessages(logSpy);
    expect(output).toContain('Amount credited. New balance: 1000.00');
    expect(output).toContain('Current balance: 1000.00');
  });

  test('TC-011: zero debit amount is accepted and balance is unchanged', () => {
    const logSpy = captureLogs();

    runWithInputs(['3', '0.00', '1', '4']);

    const output = logMessages(logSpy);
    expect(output).toContain('Amount debited. New balance: 1000.00');
    expect(output).toContain('Current balance: 1000.00');
  });

  test('TC-012: each new app run starts with default balance 1000.00', () => {
    const logSpy = captureLogs();

    readlineSync.question.mockReset();
    ['2', '500.00', '4', '1', '4'].forEach((input) => {
      readlineSync.question.mockImplementationOnce(() => input);
    });

    runApp();
    runApp();

    const output = logMessages(logSpy);
    expect(output).toContain('Amount credited. New balance: 1500.00');
    expect(output).toContain('Current balance: 1000.00');
  });
});
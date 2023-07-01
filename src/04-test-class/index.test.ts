// Uncomment the code below and write your tests
import {
  getBankAccount,
  InsufficientFundsError,
  TransferFailedError,
  BankAccount,
  SynchronizationFailedError,
} from '.';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const initialBalance = 100;
    const account = getBankAccount(initialBalance);
    expect(account.getBalance()).toBe(initialBalance);
  });

  test('should throw InsufficientFundsError when withdrawing more than balance', () => {
    const initialBalance = 100;
    const withdrawalAmount = 150;
    const account = getBankAccount(initialBalance);
    expect(() => {
      account.withdraw(withdrawalAmount);
    }).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const initialBalance = 100;
    const transferAmount = 150;
    const account1 = getBankAccount(initialBalance);
    const account2 = getBankAccount(0);

    expect(() => {
      account1.transfer(transferAmount, account2);
    }).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring to the same account', () => {
    const initialBalance = 100;
    const transferAmount = 50;
    const account = getBankAccount(initialBalance);

    expect(() => {
      account.transfer(transferAmount, account);
    }).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    const initialBalance = 100;
    const depositAmount = 50;
    const account = getBankAccount(initialBalance);

    account.deposit(depositAmount);

    expect(account.getBalance()).toBe(initialBalance + depositAmount);
  });

  test('should withdraw money', () => {
    const initialBalance = 100;
    const withdrawalAmount = 50;
    const account = getBankAccount(initialBalance);

    account.withdraw(withdrawalAmount);

    expect(account.getBalance()).toBe(initialBalance - withdrawalAmount);
  });

  test('should transfer money', () => {
    const initialBalance1 = 100;
    const initialBalance2 = 200;
    const transferAmount = 50;
    const account1 = getBankAccount(initialBalance1);
    const account2 = getBankAccount(initialBalance2);

    account1.transfer(transferAmount, account2);

    expect(account1.getBalance()).toBe(initialBalance1 - transferAmount);
    expect(account2.getBalance()).toBe(initialBalance2 + transferAmount);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const account = new BankAccount(0);
    const balance = await account.fetchBalance();

    expect(typeof balance).toBe('number');
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const account = new BankAccount(0);
    const originalBalance = account.getBalance();

    // Mock the fetchBalance method to return a specific balance
    const mockBalance = 100;
    account.fetchBalance = jest.fn().mockResolvedValue(mockBalance);

    // Call the synchronizeBalance method to update the balance
    await account.synchronizeBalance();

    const newBalance = account.getBalance();

    expect(newBalance).toBe(mockBalance);
    expect(newBalance).not.toBe(originalBalance);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const account = new BankAccount(0);

    // Mock the fetchBalance method to return null
    account.fetchBalance = jest.fn().mockResolvedValue(null);

    // Expect the synchronizeBalance method to throw SynchronizationFailedError
    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});

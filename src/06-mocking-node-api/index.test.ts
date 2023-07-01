// Uncomment the code below and write your tests
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import { join } from 'path';
import fs from 'fs';

jest.mock('fs/promises', () => ({
  existsSync: jest.fn(),
  readFile: jest.fn(),
}));
jest.mock('path', () => ({
  ...jest.requireActual('path'),
  join: jest.fn(),
}));

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;
    const setTimeoutMock = jest.spyOn(global, 'setTimeout');

    doStuffByTimeout(callback, timeout);

    expect(setTimeoutMock).toHaveBeenCalledTimes(1);
    expect(setTimeoutMock).toHaveBeenCalledWith(expect.any(Function), timeout);

    jest.runAllTimers();

    expect(callback).toHaveBeenCalledTimes(1);

    setTimeoutMock.mockRestore();
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;

    doStuffByTimeout(callback, timeout);

    expect(callback).not.toBeCalled();

    jest.advanceTimersByTime(timeout - 1);

    expect(callback).not.toBeCalled();

    jest.advanceTimersByTime(1);

    expect(callback).toBeCalled();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    const interval = 1000;

    doStuffByInterval(callback, interval);

    expect(callback).not.toBeCalled();

    jest.advanceTimersByTime(interval - 1);

    expect(callback).not.toBeCalled();

    jest.advanceTimersByTime(1);

    expect(callback).toBeCalled();
    expect(callback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(interval * 2);

    expect(callback).toHaveBeenCalledTimes(3);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    const interval = 1000;
    const numIntervals = 3;

    doStuffByInterval(callback, interval);

    expect(callback).not.toBeCalled();

    for (let i = 0; i < numIntervals; i++) {
      jest.advanceTimersByTime(interval);
      expect(callback).toHaveBeenCalledTimes(i + 1);
    }
  });
});

describe.skip('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const pathToFile = 'example.txt';
    const existsSyncMock = jest.spyOn(fs, 'existsSync');
    const readFileMock = jest.spyOn(fs.promises, 'readFile');
    const joinMock = jest.spyOn(join.prototype, 'join');

    existsSyncMock.mockReturnValue(true);
    readFileMock.mockResolvedValue('file content');

    await readFileAsynchronously(pathToFile);

    expect(joinMock).toHaveBeenCalledWith(expect.any(String), pathToFile);
  });

  test('should return null if file does not exist', async () => {
    const pathToFile = 'example.txt';
    const fullPath = 'path/to/example.txt';
    const existsSyncMock = jest.spyOn(fs, 'existsSync');
    const joinMock = jest.spyOn(join.prototype, 'join');

    existsSyncMock.mockReturnValue(false);
    joinMock.mockReturnValue(fullPath);

    const result = await readFileAsynchronously(pathToFile);

    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const pathToFile = 'example.txt';
    const fullPath = 'path/to/example.txt';
    const fileContent = 'This is the file content';
    const existsSyncMock = jest.spyOn(fs, 'existsSync');
    const readFileMock = jest.spyOn(fs.promises, 'readFile');
    const joinMock = jest.spyOn(join.prototype, 'join');

    existsSyncMock.mockReturnValue(true);
    joinMock.mockReturnValue(fullPath);
    readFileMock.mockResolvedValue(fileContent);

    const result = await readFileAsynchronously(pathToFile);

    expect(result).toBe(fileContent);
  });
});

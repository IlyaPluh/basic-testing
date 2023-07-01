// Uncomment the code below and write your tests
import axios, { AxiosResponse } from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');

describe('throttledGetDataFromApi', () => {
  test('should create instance with provided base url', async () => {
    const axiosClientMock = axios.create as jest.MockedFunction<
      typeof axios.create
    >;
    const relativePath = '/posts';

    await throttledGetDataFromApi(relativePath);

    expect(axiosClientMock).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const axiosClientMock = axios.create as jest.MockedFunction<
      typeof axios.create
    >;
    const relativePath = '/posts';

    await throttledGetDataFromApi(relativePath);

    expect(axiosClientMock).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: expect.stringContaining(
          'https://jsonplaceholder.typicode.com',
        ),
        url: expect.stringContaining(relativePath),
      }),
    );
  });

  test('should return response data', async () => {
    const responseData = [{ id: 1, title: 'Test Post' }];
    const axiosClientMock = axios.create() as jest.Mocked<typeof axios>;
    axiosClientMock.get.mockResolvedValue({
      data: responseData,
    } as AxiosResponse);
    const relativePath = '/posts';

    const result = await throttledGetDataFromApi(relativePath);

    expect(result).toEqual(responseData);
  });
});

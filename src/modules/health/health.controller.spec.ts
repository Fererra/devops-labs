import { DataSource } from 'typeorm';
import { HealthController } from './health.controller';

type MockResponse = {
  status: jest.MockedFunction<(code: number) => MockResponse>;
  send: jest.MockedFunction<(body: string) => MockResponse>;
};

function createResponse(): MockResponse {
  const res = {
    status: jest.fn<(code: number) => MockResponse>(),
    send: jest.fn<(body: string) => MockResponse>(),
  } as MockResponse;

  res.status.mockReturnValue(res);
  res.send.mockReturnValue(res);

  return res;
}

describe('HealthController', () => {
  it('alive returns OK', () => {
    const dataSource = { query: jest.fn() } as unknown as DataSource;
    const controller = new HealthController(dataSource);
    const res = createResponse();

    controller.alive(res as never);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith('OK');
  });

  it('ready returns OK when DB is ready', async () => {
    const queryMock = jest.fn().mockResolvedValue([1]);
    const dataSource = {
      query: queryMock,
    } as unknown as DataSource;
    const controller = new HealthController(dataSource);
    const res = createResponse();

    await controller.ready(res as never);

    expect(queryMock).toHaveBeenCalledWith('SELECT 1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith('OK');
  });

  it('ready returns 500 when DB is not ready', async () => {
    const dataSource = {
      query: jest.fn().mockRejectedValue(new Error('db down')),
    } as unknown as DataSource;
    const controller = new HealthController(dataSource);
    const res = createResponse();

    await controller.ready(res as never);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('DB not ready');
  });
});

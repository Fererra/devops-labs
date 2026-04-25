import { HttpException } from '@nestjs/common';
import { AppController } from './app.controller';

type MockResponse = {
  send: jest.MockedFunction<(body: string) => MockResponse>;
  type: jest.MockedFunction<(contentType: string) => MockResponse>;
};

function createResponse(): MockResponse {
  const res = {
    send: jest.fn<(body: string) => MockResponse>(),
    type: jest.fn<(contentType: string) => MockResponse>(),
  } as MockResponse;

  res.send.mockReturnValue(res);
  res.type.mockReturnValue(res);

  return res;
}

describe('AppController', () => {
  let controller: AppController;

  beforeEach(() => {
    controller = new AppController();
  });

  it('returns HTML when Accept includes text/html', () => {
    const res = createResponse();

    controller.root('text/html,application/xhtml+xml', res as never);

    expect(res.type).toHaveBeenCalledWith('text/html');
    expect(res.send).toHaveBeenCalledTimes(1);
    const html = res.send.mock.calls[0]?.[0] ?? '';
    expect(html).toContain('<h1>mywebapp API</h1>');
    expect(html).toContain('GET /notes');
    expect(html).toContain('GET /health/ready');
  });

  it('throws 406 when Accept is not HTML', () => {
    const res = createResponse();

    expect(() => controller.root('application/json', res as never)).toThrow(
      HttpException,
    );

    try {
      controller.root('application/json', res as never);
    } catch (error) {
      const err = error as HttpException;
      expect(err.getStatus()).toBe(406);
      expect(err.message).toBe('HTML only');
    }

    expect(res.type).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });

  it('throws 406 when Accept header is missing', () => {
    const res = createResponse();

    expect(() => controller.root(undefined as never, res as never)).toThrow(
      HttpException,
    );
  });
});

import { getArg } from './get-arg.util';

describe('getArg', () => {
  const originalArgv = process.argv;

  afterEach(() => {
    process.argv = [...originalArgv];
  });

  it('returns argument value when present', () => {
    process.argv = [
      'node',
      'dist/main.js',
      '--port=3000',
      '--db-host=localhost',
    ];

    expect(getArg('port')).toBe('3000');
    expect(getArg('db-host')).toBe('localhost');
  });

  it('throws a clear error when argument is missing', () => {
    process.argv = ['node', 'dist/main.js', '--port=3000'];

    expect(() => getArg('db-user')).toThrow('Missing --db-user');
  });

  it('supports values containing equals sign', () => {
    process.argv = ['node', 'dist/main.js', '--db-password=abc=123'];

    expect(getArg('db-password')).toBe('abc');
  });
});

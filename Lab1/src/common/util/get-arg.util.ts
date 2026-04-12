export const getArg = (name: string): string => {
  const arg = process.argv.find((a) => a.startsWith(`--${name}=`));

  if (!arg) throw new Error(`Missing --${name}`);

  return arg.split('=')[1];
};

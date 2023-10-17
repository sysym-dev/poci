export async function execute(fn: () => any, message: string) {
  try {
    await fn();

    console.log(message);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

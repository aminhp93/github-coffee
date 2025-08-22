export function sum(a: number, b: number): number {
  return a + b;
}

export function test() {
  const xxx = "123";
  const yyy = "456";
  const zzz = sum(parseInt(xxx), parseInt(yyy));
  return zzz;
}
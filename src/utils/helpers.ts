type Constructor<T = any> = new (...args: any[]) => T;

type TypeGuard<T> = (value: unknown) => value is T;

/* Check whether array is of the specified type */
const isArrayOfType = <T>(
  arr: unknown[] | unknown,
  type: Constructor<T> | string
): arr is T[] => {
  if (!Array.isArray(arr)) return false;

  const typeGuard: TypeGuard<T> = (value: unknown): value is T => {
    if (typeof type === "string") {
      return typeof value === type;
    } else {
      return value instanceof type;
    }
  };

  return arr.every(typeGuard);
};

export default isArrayOfType;

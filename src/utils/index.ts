type classNamesArg =
  string |
  undefined |
  Record<string, boolean | null | undefined>;

export function classNames(...args: classNamesArg[]) {
  const classes: string[] = [];

  for (const arg of args) {
    if (!arg) continue;

    if (typeof arg === 'string') {
      classes.push(arg);
    } else if (
      arg !== null &&
      typeof arg === 'object' &&
      !Array.isArray(arg)
    ) {
      Object.entries(arg).forEach(([key, value]) => {
        if (value) {
          classes.push(key);
        }
      });
    }
  }

  return classes.join(' ');
}

export const isNumeric = (n: any) => (!isNaN(parseFloat(n)) && isFinite(n))

export const toFixed = (input: any, fractionDigits: number) => {
  return parseFloat(input as string).toFixed(fractionDigits);
}

export const capitalize = (input: string) => {
  return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}

export const padNumber = (num: number, length: number) => {
  var str = num.toString();

  while (str.length < length) {
    str = '0' + str;
  }

  return str;
}

export const formatTime = (ms: number, includeMs = false) => {
  const
    msAbs = Math.abs(ms),
    hours = Math.floor((msAbs / (1000 * 60 * 60)) % 24),
    minutes = Math.floor((msAbs / (1000 * 60)) % 60),
    seconds = Math.floor((msAbs / 1000) % 60),
    milliseconds = Math.round(msAbs % 1000);

  let out = '';

  if (ms < 0) {
    out += '-';
  }

  if (hours > 0 || hours < 0) {
    out += padNumber(hours, 2) + ':';
  }

  out += padNumber(minutes, 2) + ':';

  out += padNumber(seconds, 2);

  if (includeMs) {
    out += '.' + padNumber(milliseconds, 3);
  }

  return out;
}

export const clamp = (number: number, min: number, max: number) => {
  return Math.min(Math.max(number, min), max);
}

export const arraysAreEqual = (array1: string[], array2: string[]): boolean => {
  array1.sort();
  array2.sort();

  return (JSON.stringify(array1) === JSON.stringify(array2));
}

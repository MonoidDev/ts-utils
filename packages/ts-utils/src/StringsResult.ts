import { Result } from ".";
import { ResultType } from "./Result";

/**
 * A special result that returns a list of human messages when error.
 */
export type StringsResultType = ResultType<string[], true>;

const _cachedRight: StringsResultType = Result.ofRight(true);

export function ofLeft(x: string[]): StringsResultType {
  return Result.ofLeft(x);
}

export function ofLeftIf(cond: boolean, x: string[]): StringsResultType {
  if (cond) {
    return ofLeft(x);
  }
  return ofRight();
}

export function ofRight(): StringsResultType {
  return _cachedRight;
}

export function ofRightIf(cond: boolean, x: string[]): StringsResultType {
  return ofLeftIf(!cond, x);
}

export function mergeEveryLeft(x: StringsResultType[]) {
  const messages: string[] = [];

  for (const r of x) {
    if (Result.isLeft(r)) {
      messages.push(...r.left);
    }
  }

  if (messages.length) return ofLeft(messages);

  return ofRight();
}

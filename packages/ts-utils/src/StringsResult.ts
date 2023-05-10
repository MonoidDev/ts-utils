import R from "remeda";

import { Result } from ".";
import { ResultType, fold } from "./Result";

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

export function mergeLeft(y: StringsResultType) {
  return (x: StringsResultType) => {
    if (Result.isLeft(y)) {
      return R.pipe(
        x,
        fold(
          (x) => [...x, ...y.left],
          () => y.left
        ),
        ofLeft
      );
    }
    return x;
  };
}

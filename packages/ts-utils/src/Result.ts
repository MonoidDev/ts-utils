import { TSUtilsError } from "./errors";

export interface ResultLeft<L> {
  _tag: "Left";
  left: L;
}

export interface ResultRight<R> {
  _tag: "Right";
  right: R;
}

export type ResultType<L, R> = ResultLeft<L> | ResultRight<R>;

export type ResultErrorCode = "UNWRAP_ERROR";

export class ResultError<L, R> extends TSUtilsError {
  constructor(public result: ResultType<L, R>, public code: ResultErrorCode) {
    super(code);
  }
}

export function isLeft<L, R>(x: ResultType<L, R>): x is ResultLeft<L> {
  return x._tag === "Left";
}

export function isRight<L, R>(x: ResultType<L, R>): x is ResultRight<R> {
  return x._tag === "Right";
}

export function isLeftAnd<L, R>(
  x: ResultType<L, R>,
  f: (x: L) => boolean
): x is ResultLeft<L> {
  return isLeft(x) && f(x.left);
}

export function isRightAnd<L, R>(
  x: ResultType<L, R>,
  f: (x: R) => boolean
): x is ResultLeft<L> {
  return isRight(x) && f(x.right);
}

export function ofLeft<L, R>(left: L): ResultType<L, R> {
  return { _tag: "Left", left };
}

export function ofRight<L, R>(right: R): ResultType<L, R> {
  return {
    _tag: "Right",
    right,
  };
}

export function unwrap<L, R>(x: ResultType<L, R>): R {
  if (isLeft(x)) throw new ResultError(x, "UNWRAP_ERROR");
  return x.right;
}

export function unwrapOr<L, R>(x: ResultType<L, R>, or: R): R {
  if (isLeft(x)) return or;
  return x.right;
}

export function unwrapOrElse<L, R>(x: ResultType<L, R>, orElse: () => R): R {
  if (isLeft(x)) return orElse();
  return x.right;
}

export function fold<L, R, U, V>(
  foldLeft: (x: L) => U,
  foldRight: (x: R) => V
): (x: ResultType<L, R>) => U | V {
  return (x: ResultType<L, R>) => {
    if (isLeft(x)) {
      return foldLeft(x.left);
    } else {
      return foldRight(x.right);
    }
  };
}

/**
 *
 * @param y
 * @returns a function that returns its input if the input is left; else return y.
 * by piping this function, you first judge your given input, then judge y if your input is not left.
 * useful for chaining validations.
 */
export function and<L, R>(
  y: ResultType<L, R> | (() => ResultType<L, R>)
): (x: ResultType<L, R>) => ResultType<L, R> {
  return (x: ResultType<L, R>) => {
    if (isLeft(x)) {
      return x;
    }
    return y instanceof Function ? y() : y;
  };
}

/**
 *
 * @param x
 * @param f
 * @returns if x is left, apply f to x.left; else return x.
 */
export function mapLeft<L, R, U>(
  x: ResultType<L, R>,
  f: (x: L) => U
): ResultType<U, R> {
  if (isLeft(x)) {
    return ofLeft(f(x.left));
  }
  return x;
}

import * as R from "remeda";
import { describe, expect, it } from "vitest";

import { Result } from "../src";

describe("Result", () => {
  it("isLeft/isRight getters", () => {
    expect(Result.isLeft(Result.ofLeft(114514))).toBe(true);
    expect(Result.isLeft(Result.ofRight(114514))).toBe(false);

    expect(Result.isRight(Result.ofRight(114514))).toBe(true);
    expect(Result.isRight(Result.ofLeft(114514))).toBe(false);

    expect(Result.isLeftAnd(Result.ofRight(1), () => true)).toBe(false);
    expect(Result.isLeftAnd(Result.ofLeft(1), (x) => x > 0)).toBe(true);
    expect(Result.isLeftAnd(Result.ofLeft(1), (x) => x < 0)).toBe(false);

    expect(Result.isRightAnd(Result.ofLeft(1), () => true)).toBe(false);
    expect(Result.isRightAnd(Result.ofRight(1), (x) => x > 0)).toBe(true);
    expect(Result.isRightAnd(Result.ofRight(1), (x) => x < 0)).toBe(false);
  });

  it("unwrap", () => {
    expect(Result.unwrap(Result.ofRight(1))).toBe(1);

    expect(() => {
      Result.unwrap(Result.ofLeft(1));
    }).toThrow("UNWRAP_ERROR");

    expect(Result.unwrapOr(Result.ofLeft<null, number>(null), 1)).toBe(1);
    expect(Result.unwrapOr(Result.ofRight<null, number>(1), 2)).toBe(1);

    expect(
      Result.unwrapOrElse(Result.ofLeft<null, number>(null), () => 1)
    ).toBe(1);
    expect(Result.unwrapOrElse(Result.ofRight<null, number>(1), () => 2)).toBe(
      1
    );
  });

  it("fold", () => {
    expect(
      R.pipe(
        Result.ofLeft(1),
        Result.fold(
          (x) => x + 1,
          () => null
        )
      )
    ).toBe(2);

    expect(
      R.pipe(
        Result.ofLeft(1),
        Result.fold(
          (x) => x + 1,
          () => null
        )
      )
    ).toBe(2);
  });

  it("and", () => {
    expect(
      R.pipe(
        Result.ofRight<number, number>(1),
        Result.and(Result.ofRight<number, number>(2))
      )
    ).toMatchObject(Result.ofRight<number, number>(2));

    expect(
      R.pipe(
        Result.ofRight<number, number>(1),
        Result.and(Result.ofLeft<number, number>(2)), // Encountering the first left
        Result.and(Result.ofLeft<number, number>(3)),
        Result.and(Result.ofLeft<number, number>(4))
      )
    ).toMatchObject(Result.ofLeft<number, number>(2));

    expect(
      R.pipe(
        Result.ofLeft<number, number>(1),
        Result.and(Result.ofRight<number, number>(2)),
        Result.and(Result.ofLeft<number, number>(3))
      )
    ).toMatchObject(Result.ofLeft<number, number>(1));

    expect(
      R.pipe(
        Result.ofRight<number, number>(1),
        Result.and(() => Result.ofLeft<number, number>(2))
      )
    ).toMatchObject(Result.ofLeft<number, number>(2));
  });
});

import * as R from "remeda";
import { describe, expect, it } from "vitest";

import { Result, StringsResult } from "../src";

describe("StringsResult", () => {
  it("of", () => {
    expect(Result.isLeft(StringsResult.ofLeft([]))).toBe(true);
    expect(Result.isLeft(StringsResult.ofRight())).toBe(false);

    expect(Result.isRight(StringsResult.ofRight())).toBe(true);
    expect(Result.isLeft(StringsResult.ofRight())).toBe(false);

    // Should use the same object for effiency
    expect(StringsResult.ofRight() === StringsResult.ofRight()).toBe(true);

    expect(StringsResult.ofLeftIf(false, [])).toMatchObject(
      StringsResult.ofRight()
    );
    expect(StringsResult.ofLeftIf(true, [])).toMatchObject(
      StringsResult.ofLeft([])
    );
    expect(StringsResult.ofRightIf(true, ["shit!"])).toMatchObject(
      StringsResult.ofRight()
    );
    expect(StringsResult.ofRightIf(false, ["shit!"])).toMatchObject(
      StringsResult.ofLeft(["shit!"])
    );
  });

  it("merge strings", () => {
    expect(
      R.pipe(
        StringsResult.ofLeft(["too young"]),
        StringsResult.mergeLeft(StringsResult.ofLeft(["too simple"])),
        StringsResult.mergeLeft(StringsResult.ofRight()),
        StringsResult.mergeLeft(StringsResult.ofLeft(["shitjinping"]))
      )
    ).toMatchObject(
      StringsResult.ofLeft(["too young", "too simple", "shitjinping"])
    );
  });
});

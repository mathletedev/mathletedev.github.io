import { expect, test } from "bun:test";
import { getRandomTrack } from "../src/lib/music";

test("query jamendo", async () => {
    const res = await getRandomTrack();

    expect(res.id).toBeDefined();
});

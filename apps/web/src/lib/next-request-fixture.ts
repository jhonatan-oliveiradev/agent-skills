import { posix, win32 } from "node:path";

export function isFixtureLocationSafe(
  webRoot: string,
  fixtureRoot: string,
  platform: NodeJS.Platform = process.platform,
): boolean {
  const path = platform === "win32" ? win32 : posix;
  const webVolume = path.parse(webRoot).root;
  const fixtureVolume = path.parse(fixtureRoot).root;
  const sameVolume =
    platform === "win32"
      ? webVolume.toLowerCase() === fixtureVolume.toLowerCase()
      : webVolume === fixtureVolume;
  const fixturePathFromWebRoot = path.relative(webRoot, fixtureRoot);
  const outsideWebRoot =
    fixturePathFromWebRoot === ".." ||
    fixturePathFromWebRoot.startsWith(`..${path.sep}`);

  return sameVolume && outsideWebRoot;
}

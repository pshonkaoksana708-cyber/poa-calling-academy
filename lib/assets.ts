import { existsSync } from "fs";
import { join } from "path";

export function publicAssetExists(src: string) {
  const normalized = src.startsWith("/") ? src.slice(1) : src;

  return existsSync(join(process.cwd(), "public", normalized));
}

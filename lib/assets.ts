import { existsSync } from "fs";
import { join } from "path";

export function publicAssetExists(src: string) {
  const publicPath = src.startsWith("/media/images/")
    ? src.replace(/^\/media\//, "")
    : src;
  const normalized = publicPath.startsWith("/") ? publicPath.slice(1) : publicPath;

  return existsSync(join(process.cwd(), "public", normalized));
}

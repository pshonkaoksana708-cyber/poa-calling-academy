import { stat, readFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest } from "next/server";

const IMAGE_ROOT = path.join(process.cwd(), "public", "images");

const contentTypes: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".webp": "image/webp",
};

type MediaImageRouteProps = {
  params: Promise<{
    path: string[];
  }>;
};

export async function GET(
  _request: NextRequest,
  { params }: MediaImageRouteProps,
) {
  const { path: requestedPath } = await params;
  const normalizedPath = path.normalize(requestedPath.join(path.sep));
  const filePath = path.join(IMAGE_ROOT, normalizedPath);
  const extension = path.extname(filePath).toLowerCase();
  const contentType = contentTypes[extension];

  if (
    !contentType ||
    normalizedPath.startsWith("..") ||
    path.relative(IMAGE_ROOT, filePath).startsWith("..")
  ) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const [file, fileStat] = await Promise.all([readFile(filePath), stat(filePath)]);

    return new Response(file, {
      headers: {
        "Accept-Ranges": "none",
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": String(fileStat.size),
        "Content-Type": contentType,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

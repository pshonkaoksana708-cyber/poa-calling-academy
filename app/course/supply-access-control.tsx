import {
  getCourseTokenAccess,
  PackageAccessDenied as CoursePackageAccessDenied,
} from "@/app/course/course-access-control";

export function getSupplyTokenAccess(token?: string) {
  return getCourseTokenAccess("supply", token);
}

export function PackageAccessDenied({
  token,
}: {
  token?: string;
}) {
  return <CoursePackageAccessDenied professionSlug="supply" token={token} />;
}

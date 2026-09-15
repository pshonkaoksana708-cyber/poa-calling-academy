import { cookies } from "next/headers";
import { LOGISTICS_ACCESS_COOKIE } from "@/lib/course-access-cookie";

export async function getLogisticsAccessToken(queryToken?: string) {
  if (queryToken) {
    return queryToken;
  }

  return (await cookies()).get(LOGISTICS_ACCESS_COOKIE)?.value;
}

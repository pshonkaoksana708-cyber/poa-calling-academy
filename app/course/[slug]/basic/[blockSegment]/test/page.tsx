import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AssessmentTest } from "@/components/assessments/AssessmentTest";
import { AssessmentUnavailable } from "@/components/assessments/AssessmentUnavailable";
import { getBlockTestAssessment } from "@/data/assessments";
import { getProfession } from "@/data/professions";
import {
  getSupplyTokenAccess,
  PackageAccessDenied,
} from "@/app/course/supply-access-control";
import { noIndexRobots } from "@/lib/seo";

export const metadata: Metadata = {
  robots: noIndexRobots,
};

type BlockTestPageProps = {
  params: Promise<{
    blockSegment: string;
    slug: string;
  }>;
  searchParams: Promise<{
    token?: string;
  }>;
};

function parseBlockNumber(blockSegment: string) {
  const match = blockSegment.match(/^block-(\d)$/);
  const blockNumber = match ? Number(match[1]) : 0;

  return blockNumber >= 1 && blockNumber <= 3 ? blockNumber : null;
}

function nextStepHref(slug: string, blockNumber: number) {
  if (blockNumber === 1) {
    return `/course/${slug}/basic/block-2/lesson-1`;
  }

  if (blockNumber === 2) {
    return `/course/${slug}/basic/block-3/lesson-1`;
  }

  return `/course/${slug}/basic/final-project`;
}

function blockReviewHref(slug: string, blockNumber: number) {
  if (blockNumber === 1) {
    return `/course/${slug}/basic/lesson-1`;
  }

  return `/course/${slug}/basic/block-${blockNumber}/lesson-1`;
}

function appendToken(href: string, token?: string) {
  return token ? `${href}?token=${encodeURIComponent(token)}` : href;
}

export default async function BlockTestPage({
  params,
  searchParams,
}: BlockTestPageProps) {
  const { blockSegment, slug } = await params;
  const { token } = await searchParams;
  const profession = getProfession(slug);
  const blockNumber = parseBlockNumber(blockSegment);

  if (!profession || !blockNumber) {
    notFound();
  }

  if (slug === "supply") {
    const supplyAccess = getSupplyTokenAccess(token);

    if (!supplyAccess.ok || supplyAccess.blockCount < blockNumber) {
      return <PackageAccessDenied token={token} />;
    }
  }

  const assessment = getBlockTestAssessment(slug, blockNumber);
  const backHref = appendToken(`/course/${slug}/basic/assessment`, token);

  if (!assessment) {
    return (
      <AssessmentUnavailable
        backHref={backHref}
        title={`Тест после Блока ${blockNumber}`}
      />
    );
  }

  return (
    <AssessmentTest
      assessment={assessment}
      backHref={backHref}
      nextHref={appendToken(nextStepHref(slug, blockNumber), token)}
      nextLabel={
        blockNumber === 3
          ? "Перейти к итоговому проекту"
          : `Перейти к Блоку ${blockNumber + 1}`
      }
      reviewHref={appendToken(blockReviewHref(slug, blockNumber), token)}
    />
  );
}

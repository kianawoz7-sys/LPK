"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { LazyMotion, domAnimation, m, useReducedMotion } from "motion/react";
import { ArrowUpRight, Pin } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Step {
  title: string;
  description?: string;
  href?: string;
  image?: { src: string; alt: string; width: number; height: number };
}

export interface StepPosition {
  className?: string;
  rotate?: string;
}

export interface HowItWorksProps {
  features?: Step[];
  className?: string;
  stepPositions?: StepPosition[];
}

// The reference's staggered arrangement, with restrained rotations and white cards.
const DEFAULT_CARD_POSITIONS: StepPosition[] = [
  { className: "md:left-[6%]", rotate: "md:rotate-2" },
  { className: "md:right-[6%]", rotate: "md:-rotate-2" },
];
const CARD_SPACING = 240;
const CARD_HEIGHT_ALLOWANCE = 430;

function Card({ feature }: { feature: Step }) {
  const content = (
    <>
      <div className="flex h-9 items-center justify-center text-neutral-400">
        <Pin className="h-[18px] w-[18px]" aria-hidden="true" />
      </div>
      <div className="overflow-hidden rounded-[17px] border border-neutral-100 bg-white">
        {feature.image && (
          <Image
            src={feature.image.src}
            alt={feature.image.alt}
            width={feature.image.width}
            height={feature.image.height}
            sizes="(max-width: 767px) 90vw, 360px"
            className="block h-auto w-full"
          />
        )}
        <div className="p-4">
          <h3 className="how-card-title text-[21px] leading-tight font-semibold tracking-tight text-neutral-800">
            {feature.title}
          </h3>
          {feature.description && (
            <p className="mt-3 text-sm leading-relaxed text-neutral-500">{feature.description}</p>
          )}
          {feature.href && (
            <span className="mt-2 inline-flex min-h-11 items-center gap-2 text-xs font-medium text-neutral-500">
              Lihat detail <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </span>
          )}
        </div>
      </div>
    </>
  );
  const cardClass = "block rounded-[25px] border border-neutral-200 bg-white p-2 shadow-[0_10px_25px_rgba(0,0,0,0.045)] transition-shadow hover:shadow-[0_14px_30px_rgba(0,0,0,0.075)] focus-visible:outline-neutral-700";

  return feature.href ? (
    <Link href={feature.href} prefetch={false} className={cn(cardClass, "program-card")} aria-label={`Lihat detail ${feature.title}`}>
      {content}
    </Link>
  ) : <div className={cardClass}>{content}</div>;
}

export default function HowItWorks({ features = [], className, stepPositions }: HowItWorksProps) {
  const reducedMotion = useReducedMotion();
  if (!features.length) return null;
  const positions = stepPositions?.length ? stepPositions : DEFAULT_CARD_POSITIONS;
  const height = (features.length - 1) * CARD_SPACING + CARD_HEIGHT_ALLOWANCE;
  const path = features.reduce((result, _, index) => {
    const x = index % 2 === 0 ? 260 : 740;
    const y = 200 + index * CARD_SPACING;
    if (index === 0) return `M ${x} ${y}`;
    const previousY = y - CARD_SPACING;
    return `${result} C 500 ${previousY}, 500 ${y}, ${x} ${y}`;
  }, "");

  return (
    <LazyMotion features={domAnimation}>
      <div className={cn("how-it-works relative bg-white px-5 py-10 sm:px-8 md:py-16", className)}>
        <div
          className="relative z-[1] mx-auto flex h-auto w-full max-w-[1000px] flex-col gap-8 md:block md:h-[var(--md-height)]"
          style={{ "--md-height": `${height}px` } as React.CSSProperties}
        >
          {features.length > 1 && (
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
              viewBox={`0 0 1000 ${height}`}
              preserveAspectRatio="none"
            >
              <m.path
                d={path}
                stroke="currentColor"
                className="text-neutral-300"
                strokeWidth="2"
                strokeDasharray="8 6"
                fill="none"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                initial={{ strokeDashoffset: 0 }}
                animate={{ strokeDashoffset: reducedMotion ? 0 : -140 }}
                transition={reducedMotion ? { duration: 0 } : { duration: 6, repeat: Infinity, ease: "linear" }}
              />
            </svg>
          )}
          {features.map((feature, index) => {
            const position = positions[index % positions.length];
            return (
              <div
                key={feature.href || feature.title}
                className={cn(
                  "how-card-wrap relative z-10 w-full md:absolute md:top-[var(--card-top)] md:w-[40%] md:max-w-[360px]",
                  position.className,
                  position.rotate,
                )}
                style={{ "--card-top": `${index * CARD_SPACING}px` } as React.CSSProperties}
              >
                <Card feature={feature} />
              </div>
            );
          })}
        </div>
      </div>
    </LazyMotion>
  );
}

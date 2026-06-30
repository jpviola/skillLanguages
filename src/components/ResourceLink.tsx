"use client";
import { ExternalLink } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { isValidUrl, safeHref } from "@/lib/url";
import type { Resource } from "@/lib/types";

interface ResourceLinkProps {
  resource: Resource;
}

export default function ResourceLink({ resource }: ResourceLinkProps) {
  const href = safeHref(resource.url);

  if (!isValidUrl(resource.url)) {
    return (
      <span className="text-sm text-ink">{resource.title}</span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-primary hover:underline"
    >
      {resource.title} <ExternalLink size={11} />
    </a>
  );
}

interface ResourceBadgeProps {
  resource: Resource;
}

export function ResourceBadge({ resource }: ResourceBadgeProps) {
  const { L } = useI18n();
  return (
    <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${costBadgeStyle(resource.cost)}`}>
      {L.cost[resource.cost]}
    </span>
  );
}

function costBadgeStyle(cost: Resource["cost"]): string {
  switch (cost) {
    case "Free":
      return "bg-emerald-50 text-emerald-700";
    case "Low":
      return "bg-amber-50 text-amber-700";
    case "Premium":
      return "bg-red-50 text-red-700";
  }
}
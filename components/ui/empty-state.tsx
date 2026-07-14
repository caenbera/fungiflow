import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  className,
  children,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "surface-soft rounded-2xl flex flex-col items-center justify-center gap-3 px-6 py-12 text-center border border-[rgba(132,88,42,0.12)]",
        className,
      )}
    >
      <div className="bg-[#5A3519]/8 text-[#A36C35] flex h-12 w-12 items-center justify-center rounded-xl">
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-base font-bold text-[#2b1b10]" style={{ fontFamily: 'var(--font-serif)' }}>{title}</p>
        {description && <p className="text-sm text-[#705e4b] max-w-sm mx-auto">{description}</p>}
      </div>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-2" variant="default" size="sm">
          {actionLabel}
        </Button>
      )}
      {children && <div className="mt-2 flex w-full flex-col items-center">{children}</div>}
    </div>
  );
}

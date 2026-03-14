import { CalendarClock, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type TaskStatus = "inbox" | "in_progress" | "review" | "done";

interface TaskCardProps {
 title: string;
 status?: TaskStatus;
 priority?: string;
 assignee?: string;
 due?: string;
 isOverdue?: boolean;
 approvalsPendingCount?: number;
 tags?: Array<{ id: string; name: string; color: string }>;
 isBlocked?: boolean;
 blockedByCount?: number;
 onClick?: () => void;
 draggable?: boolean;
 isDragging?: boolean;
 onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void;
 onDragEnd?: (event: React.DragEvent<HTMLDivElement>) => void;
}

export function TaskCard({
 title,
 status,
 priority,
 assignee,
 due,
 isOverdue = false,
 approvalsPendingCount = 0,
 tags = [],
 isBlocked = false,
 blockedByCount = 0,
 onClick,
 draggable = false,
 isDragging = false,
 onDragStart,
 onDragEnd,
}: TaskCardProps) {
 const hasPendingApproval = approvalsPendingCount > 0;
 const needsLeadReview = status === "review" && !isBlocked && !hasPendingApproval;

 const leftBarClassName = isBlocked
 ? "bg-rose-400"
 : hasPendingApproval
 ? "bg-amber-400"
 : needsLeadReview
 ? "bg-indigo-400"
 : null;

 const priorityBadge = (value?: string) => {
 if (!value) return null;
 const normalized = value.toLowerCase();
 if (normalized === "high") return "bg-rose-500/20 text-rose-400";
 if (normalized === "medium") return "bg-amber-500/20 text-amber-400";
 if (normalized === "low") return "bg-emerald-500/20 text-emerald-400";
 return "bg-[var(--surface-muted)] text-[var(--text-quiet)]";
 };

 const priorityLabel = priority ? priority.toUpperCase() : "MEDIUM";
 const visibleTags = tags.slice(0, 3);

 return (
 <div
 className={cn(
 "group relative cursor-pointer rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:shadow-md",
 isDragging && "opacity-60 shadow-none",
 hasPendingApproval && "border-amber-500/30 bg-amber-500/5",
 isBlocked && "border-rose-500/30 bg-rose-500/5",
 needsLeadReview && "border-indigo-500/30 bg-indigo-500/5",
 )}
 draggable={draggable}
 onDragStart={onDragStart}
 onDragEnd={onDragEnd}
 onClick={onClick}
 role="button"
 tabIndex={0}
 onKeyDown={(event) => {
 if (event.key === "Enter" || event.key === " ") {
 event.preventDefault();
 onClick?.();
 }
 }}
 >
 {leftBarClassName ? (
 <span className={cn("absolute left-0 top-0 h-full w-1 rounded-l-lg", leftBarClassName)} />
 ) : null}

 <div className="flex items-start justify-between gap-3">
 <div className="min-w-0 space-y-2">
 <p className="text-sm font-medium text-[var(--text)] line-clamp-2 break-words">
 {title}
 </p>
 {isBlocked ? (
 <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-rose-400">
 <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
 Blocked{blockedByCount > 0 ? ` · ${blockedByCount}` : ""}
 </div>
 ) : null}
 {hasPendingApproval ? (
 <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-amber-400">
 <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
 Approval needed · {approvalsPendingCount}
 </div>
 ) : null}
 {needsLeadReview ? (
 <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-indigo-400">
 <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
 Waiting for lead review
 </div>
 ) : null}
 {visibleTags.length ? (
 <div className="flex flex-wrap items-center gap-1.5">
 {visibleTags.map((tag) => (
 <span
 key={tag.id}
 className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-2 py-0.5 text-[10px] font-semibold text-[var(--text-muted)]"
 >
 <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: `#${tag.color}` }} />
 {tag.name}
 </span>
 ))}
 {tags.length > visibleTags.length ? (
 <span className="text-[10px] font-semibold text-[var(--text-quiet)]">
 +{tags.length - visibleTags.length}
 </span>
 ) : null}
 </div>
 ) : null}
 </div>

 <div className="flex flex-shrink-0 flex-col items-end gap-2">
 <span className={cn(
 "inline-flex items-center rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide",
 priorityBadge(priority) ?? "bg-[var(--surface-muted)] text-[var(--text-quiet)]",
 )}>
 {priorityLabel}
 </span>
 </div>
 </div>

 <div className="mt-3 flex items-center justify-between text-xs text-[var(--text-quiet)]">
 <div className="flex items-center gap-2">
 <UserCircle className="h-4 w-4 text-[var(--text-quiet)]" />
 <span>{assignee ?? "Unassigned"}</span>
 </div>
 {due ? (
 <div className={cn("flex items-center gap-2", isOverdue && "font-semibold text-rose-400")}>
 <CalendarClock className={cn("h-4 w-4", isOverdue ? "text-rose-400" : "text-[var(--text-quiet)]")} />
 <span>{due}</span>
 </div>
 ) : null}
 </div>
 </div>
 );
}
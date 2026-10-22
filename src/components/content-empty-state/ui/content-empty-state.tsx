import type { ReactNode } from "react";
import { BookOpen, CalendarDays, FileText, Images, Newspaper, PanelsTopLeft } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Typography } from "@/shared/ui/typography";

const content = {
  events: {
    icon: CalendarDays,
    title: "Пока нет предстоящих событий",
    description: "Когда появятся новые анонсы, они будут здесь.",
  },
  projects: {
    icon: PanelsTopLeft,
    title: "Проектов пока нет",
    description: "Когда появятся новые проекты, мы расскажем о них здесь.",
  },
  news: {
    icon: Newspaper,
    title: "Новостей пока нет",
    description: "Новые публикации медиацентра появятся здесь.",
  },
  gallery: {
    icon: Images,
    title: "Фотоальбомов пока нет",
    description: "Новые фотографии и альбомы появятся здесь.",
  },
  documents: {
    icon: FileText,
    title: "Документы пока не опубликованы",
    description: "Новые документы появятся здесь.",
  },
  newspapers: {
    icon: BookOpen,
    title: "Газеты пока не добавлены",
    description: "Новые издания появятся в газетном киоске.",
  },
} as const;

type ContentEmptyStateProps = {
  kind: keyof typeof content;
  headingLevel?: "h2" | "h3";
  title?: string;
  description?: string;
  className?: string;
  children?: ReactNode;
};

export function ContentEmptyState({ kind, headingLevel = "h2", title, description, className, children }: ContentEmptyStateProps) {
  const { icon: Icon, title: defaultTitle, description: defaultDescription } = content[kind];

  return (
    <div className={cn("flex flex-col gap-4 rounded-3xl bg-card p-6 mobile:flex-row mobile:items-center mobile:gap-5 mobile:p-8", className)}>
      <span aria-hidden="true" data-text-decorative className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted text-primary">
        <Icon size={24} strokeWidth={1.6} />
      </span>
      <div className="min-w-0">
        <Typography as={headingLevel} variant="event-title">
          {title ?? defaultTitle}
        </Typography>
        <Typography variant="body" className="mt-2 text-muted-foreground">
          {description ?? defaultDescription}
        </Typography>
        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  );
}

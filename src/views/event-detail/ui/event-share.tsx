import { SocialLinks } from "@/components/social-links";
import { Typography } from "@/shared/ui/typography";

export function EventSocialLinks() {
  return (
    <section className="mt-8" aria-label="Социальные сети">
      <Typography variant="caption" className="mb-3 text-muted-foreground">
        Мы в социальных сетях:
      </Typography>
      <SocialLinks size="small" />
    </section>
  );
}

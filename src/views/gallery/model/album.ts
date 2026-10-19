import { contentImageUrl } from "@/shared/lib/content-image-url";
import type { ContentMedia } from "@/shared/types/model/content.type";

export type GalleryPhoto = { id: string; src: string; alt: string };
export type GalleryAlbum = {
  slug: string;
  title: string;
  description: string;
  date: string;
  dateTime?: string;
  photoCount: number;
  cover?: string;
  photos: GalleryPhoto[];
};

export function toGalleryAlbum(item: ContentMedia): GalleryAlbum {
  const photos = (item.images ?? []).map((image, index) => ({
    id: `${item.id}-${index}`,
    src: contentImageUrl(image.url) ?? "/images/no-image.png",
    alt: image.description || `Фотография ${index + 1} альбома «${item.title}»`,
  }));
  const dateMatch = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(item.published_at);

  return {
    slug: item.slug,
    title: item.title,
    description: item.description,
    date: item.published_at,
    dateTime: dateMatch ? `${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}` : undefined,
    photoCount: item.photo_count,
    cover: contentImageUrl(item.image) ?? photos[0]?.src,
    photos,
  };
}

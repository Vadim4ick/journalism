import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GalleryAlbumPage, GALLERY_ALBUMS, getGalleryAlbum } from "@/views/gallery";

export function generateStaticParams() {
  return GALLERY_ALBUMS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const album = getGalleryAlbum(slug);

  if (!album) return { title: "Альбом не найден — Дом журналистики" };

  return {
    title: album.title + " — Фотогалерея Дома журналистики",
    description: album.title + ": " + album.photos.length + " фотографий.",
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const album = getGalleryAlbum(slug);

  if (!album) notFound();

  return <GalleryAlbumPage album={album} />;
}

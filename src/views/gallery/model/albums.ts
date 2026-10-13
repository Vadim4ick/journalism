export type GalleryPhoto = {
  id: string;
  src: string;
  alt: string;
};

export type GalleryAlbum = {
  slug: string;
  title: string;
  date: string;
  dateTime: string;
  cover: GalleryPhoto;
  photos: GalleryPhoto[];
};

export const GALLERY_ALBUMS: GalleryAlbum[] = [
  {
    slug: "rural-blogger-module-2",
    title: "2 модуль проекта «Сельский блогер»",
    date: "15 сентября 2026",
    dateTime: "2026-09-15",
    cover: {
      id: "rural-blogger-workshop-cover",
      src: "/images/news/rural-blogger-workshop.png",
      alt: "Участники проекта «Сельский блогер» на занятии",
    },
    photos: [
      {
        id: "rural-blogger-workshop",
        src: "/images/news/rural-blogger-workshop.png",
        alt: "Участники проекта «Сельский блогер» работают за столами",
      },
      {
        id: "rural-blogger-studio",
        src: "/images/news/rural-blogger-studio.png",
        alt: "Съёмка в студии проекта «Сельский блогер»",
      },
      {
        id: "rural-blogger-speaker",
        src: "/images/news/rural-blogger-speaker.png",
        alt: "Участница выступает перед аудиторией проекта",
      },
    ],
  },
  {
    slug: "rural-blogger-module-1",
    title: "1 модуль проекта «Сельский блогер»",
    date: "2 сентября 2026",
    dateTime: "2026-09-02",
    cover: {
      id: "rural-blogger-presentation-cover",
      src: "/images/events/rural-blogger.png",
      alt: "Презентация проекта «Сельский блогер» в медиацентре",
    },
    photos: [
      {
        id: "rural-blogger-presentation",
        src: "/images/events/rural-blogger.png",
        alt: "Ведущий представляет проект «Сельский блогер»",
      },
      {
        id: "rural-blogger-workshop-2",
        src: "/images/news/rural-blogger-workshop.png",
        alt: "Участники встречи проекта «Сельский блогер»",
      },
      {
        id: "rural-blogger-speaker-2",
        src: "/images/news/rural-blogger-speaker.png",
        alt: "Спикер отвечает на вопросы участников",
      },
    ],
  },
  {
    slug: "kuban-film-and-exhibition",
    title: "Фестиваль кубанского кино и выставка «Пространство смысла»",
    date: "31 августа 2026",
    dateTime: "2026-08-31",
    cover: {
      id: "kuban-exhibition-cover",
      src: "/images/events/kuban-exhibition.png",
      alt: "Посетители рассматривают фотографии на выставке",
    },
    photos: [
      {
        id: "kuban-exhibition",
        src: "/images/events/kuban-exhibition.png",
        alt: "Посетители рассматривают фотографии на выставке",
      },
      {
        id: "exhibition-visitors",
        src: "/images/directory/photo-12.png",
        alt: "Посетители у фотографий в выставочном зале",
      },
      {
        id: "cinema-tour",
        src: "/images/gallery/media-tour.png",
        alt: "Группа школьников знакомится с киноаппаратурой во время экскурсии",
      },
      {
        id: "cinema-excursion",
        src: "/images/directory/photo-6.png",
        alt: "Экскурсовод показывает школьникам кинопроекционную аппаратуру",
      },
    ],
  },
  {
    slug: "region-93-2026",
    title: "Регион 93 (2026 год)",
    date: "1 сентября 2026",
    dateTime: "2026-09-01",
    cover: {
      id: "region-93-cover",
      src: "/images/directory/photo-8.png",
      alt: "Спикер выступает перед аудиторией на молодежном форуме",
    },
    photos: [
      {
        id: "region-93-speaker",
        src: "/images/directory/photo-8.png",
        alt: "Спикер выступает перед аудиторией на молодежном форуме",
      },
    ],
  },
  {
    slug: "dobro-rf-session",
    title: "Стратегическая сессия Добро.РФ",
    date: "1 сентября 2026",
    dateTime: "2026-09-01",
    cover: {
      id: "dobro-session-cover",
      src: "/images/directory/photo-8.png",
      alt: "Участник выступает на сессии перед аудиторией",
    },
    photos: [
      {
        id: "dobro-session-speaker",
        src: "/images/directory/photo-8.png",
        alt: "Участник выступает на сессии перед аудиторией",
      },
      {
        id: "dobro-session-discussion",
        src: "/images/news/rural-blogger-speaker.png",
        alt: "Участница выступает перед аудиторией",
      },
    ],
  },
  {
    slug: "journalism-house-excursion",
    title: "Экскурсия в Дом журналистики",
    date: "31 августа 2026",
    dateTime: "2026-08-31",
    cover: {
      id: "journalism-house-excursion-cover",
      src: "/images/gallery/media-tour.png",
      alt: "Экскурсовод показывает школьникам киноаппаратуру",
    },
    photos: [
      {
        id: "journalism-house-excursion",
        src: "/images/gallery/media-tour.png",
        alt: "Экскурсовод рассказывает школьникам о киноаппаратуре",
      },
      {
        id: "journalism-house-exhibition",
        src: "/images/directory/photo-6.png",
        alt: "Школьники рассматривают экспонаты во время экскурсии",
      },
      {
        id: "journalism-house-visit",
        src: "/images/directory/photo-12.png",
        alt: "Посетители знакомятся с выставкой в Доме журналистики",
      },
    ],
  },
];

export function getGalleryAlbum(slug: string) {
  return GALLERY_ALBUMS.find((album) => album.slug === slug);
}

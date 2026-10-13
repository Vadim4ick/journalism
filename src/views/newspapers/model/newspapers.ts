export type NewspaperIssue = {
  id: string;
  dateTime: string;
  date: string;
  title: string;
};

export type Newspaper = {
  slug: string;
  name: string;
  shortName: string;
  logo?: { src: string; width: number; height: number };
  website?: string;
  municipality?: string;
  socials?: readonly string[];
  issues: readonly NewspaperIssue[];
};

const MAYAKOV_DATES = [
  ["2026-06-18", "18.06.2026"],
  ["2026-06-02", "02.06.2026"],
  ["2026-05-18", "18.05.2026"],
  ["2026-05-02", "02.05.2026"],
  ["2026-04-18", "18.04.2026"],
  ["2026-04-02", "02.04.2026"],
  ["2026-03-18", "18.03.2026"],
  ["2026-03-02", "02.03.2026"],
  ["2026-02-18", "18.02.2026"],
  ["2026-02-02", "02.02.2026"],
] as const;

const MAYAKOV_ISSUES: NewspaperIssue[] = MAYAKOV_DATES.map(([dateTime, date], index) => ({
  id: dateTime,
  dateTime,
  date,
  title: index === 0 ? "Выпуск №25 (12475)" : `Выпуск от ${date}`,
}));

export const NEWSPAPERS: readonly Newspaper[] = [
  {
    slug: "svet-mayakov",
    name: "ООО «Редакция газеты „Свет маяков“»",
    shortName: "Свет маяков",
    logo: { src: "/images/gazeti/svet-mayakov.png", width: 560, height: 352 },
    website: "svet-mayakov.ru",
    municipality: "Новокубанский район",
    socials: ["ВКонтакте", "Одноклассники"],
    issues: MAYAKOV_ISSUES,
  },
  { slug: "voskhod", name: "ООО «Редакция газеты „Восход“»", shortName: "Восход", logo: { src: "/images/gazeti/voshod.png", width: 594, height: 180 }, issues: [] },
  { slug: "anapskoe-chernomorye", name: "ООО «Редакция газеты „Анапское Черноморье“»", shortName: "Анапское Черноморье", logo: { src: "/images/gazeti/anapa.png", width: 598, height: 208 }, issues: [] },
  { slug: "vestnik-predgorya", name: "ООО «Редакция газеты „Вестник предгорья“»", shortName: "Вестник предгорья", logo: { src: "/images/gazeti/vestnik.png", width: 600, height: 136 }, issues: [] },
  { slug: "armavirskiy-sobesednik", name: "ООО «Редакция газеты „Армавирский собеседник“»", shortName: "Армавирский собеседник", logo: { src: "/images/gazeti/armavir.png", width: 600, height: 160 }, issues: [] },
  { slug: "beloglinskiye-vesti", name: "ООО «Белоглинский информационный центр „Родная земля“»", shortName: "Белоглинские вести", logo: { src: "/images/gazeti/vesti.png", width: 600, height: 168 }, issues: [] },
  { slug: "vlast-sovetov", name: "ООО «Редакция газеты „Власть Советов“»", shortName: "Власть Советов", issues: [] },
  { slug: "priboy", name: "ООО «Редакция газеты „Прибой“»", shortName: "Прибой", issues: [] },
  { slug: "bryukhovetskiye-novosti", name: "ООО «Редакция газеты „Брюховецкие новости“»", shortName: "Брюховецкие новости", issues: [] },
  { slug: "ogni-kubani", name: "ООО «Редакция газеты „Огни Кубани“»", shortName: "Огни Кубани", issues: [] },
  { slug: "priazovskiye-stepi", name: "ООО «Редакция газеты „Приазовские степи“»", shortName: "Приазовские степи", issues: [] },
  { slug: "tribuna", name: "ООО «Редакция газеты „Трибуна“»", shortName: "Трибуна", issues: [] },
  { slug: "v-24-chasa", name: "ООО «Редакция газеты „В 24 часа“»", shortName: "В 24 часа", issues: [] },
  { slug: "goryachiy-klyuch", name: "ООО «Редакция газеты „Горячий Ключ“»", shortName: "Горячий Ключ", issues: [] },
  { slug: "kalininets", name: "ООО «Редакция газеты „Калининец“»", shortName: "Калининец", issues: [] },
];

export function getNewspaper(slug: string) {
  return NEWSPAPERS.find((newspaper) => newspaper.slug === slug);
}

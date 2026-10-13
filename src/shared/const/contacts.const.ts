import { Max } from "@/shared/icons/seti/max";
import { Tg } from "@/shared/icons/seti/tg";
import { Vk } from "@/shared/icons/seti/vk";
import { Yd } from "@/shared/icons/seti/yd";

export const CONTACTS = {
  hours: [
    "Понедельник — четверг: 09:00 – 18:00",
    "Пятница: 09:00 – 17:00",
    "Суббота, воскресенье: выходной",
  ],
  address: "г. Краснодар, ул. Гоголя, 70",
  phone: "+7 (861) 997-62-59",
  phoneHref: "tel:+78619976259",
  email: "gkukkmdzh@dsmi.krasnodar.ru",
  mapHref: "https://yandex.ru/maps/?ll=38.973660%2C45.026317&z=17",
  socials: [
    {
      name: "MAX",
      href: "https://max.ru/id2308296019_gos",
      Icon: Max,
    },
    {
      name: "Telegram",
      href: "https://t.me/kubdomzhur",
      Icon: Tg,
    },
    {
      name: "ВКонтакте",
      href: "https://vk.com/kubdomzhur",
      Icon: Vk,
    },
    {
      name: "Дзен",
      href: null,
      Icon: Yd,
    },
  ],
} as const;

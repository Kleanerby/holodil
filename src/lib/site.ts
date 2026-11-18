/**
 * Единый конфиг сайта.
 * TODO(content): перед запуском заменить название, телефон, адрес, УНП, домен и мессенджеры на реальные.
 * Все цифры (стаж, гарантия, время приезда) берутся только отсюда — чтобы на сайте не было противоречий,
 * как у конкурентов («гарантия до 3 лет» в шапке и «до 1 года» в тексте).
 */
export const site = {
  name: "Полюс",
  legalName: "ИП / ООО — указать", // TODO(content)
  unp: "000000000", // TODO(content)
  url: "https://polus-remont.by", // TODO(content): реальный домен
  locale: "ru_BY",
  city: "Минск",
  phone: "+375 (29) 000-00-00", // TODO(content)
  phoneHref: "tel:+375290000000",
  telegram: "https://t.me/", // TODO(content)
  viber: "viber://chat?number=%2B375290000000", // TODO(content)
  email: "info@polus-remont.by", // TODO(content)
  address: "г. Минск, выезд мастера на дом по всему городу и Минскому району",
  hours: "Ежедневно 8:00–22:00",
  hoursSchema: "Mo-Su 08:00-22:00",
  /** Ключевые обещания — одно место правды */
  arrival: "1–2 часа",
  arrivalMin: 60,
  warrantyMax: "до 24 месяцев",
  warrantyMin: "от 3 месяцев",
  diagnostics: "0 BYN при ремонте",
  diagnosticsRefusal: 25, // BYN, если клиент отказался от ремонта
  minPrice: 30,
  since: 2014, // TODO(content)
  masters: 6, // TODO(content)
  /** true — на карточках отзывов показывается пометка «демо». Выключить после замены на реальные. */
  demoContent: true,
} as const;

export const routes = {
  home: "/",
  services: "/uslugi",
  faults: "/neispravnosti",
  brands: "/brendy",
  areas: "/rajony",
  tech: "/tehnika",
  prices: "/tseny",
  reviews: "/otzyvy",
  about: "/o-kompanii",
  warranty: "/garantiya",
  contacts: "/kontakty",
  blog: "/blog",
} as const;

export type PartId =
  | "compressor"
  | "condenser"
  | "evaporator"
  | "thermostat"
  | "fan"
  | "board"
  | "seal"
  | "drain"
  | "pipes"
  | "relay"
  | "heater"
  | "sensor"
  | "hinge"
  | "lamp";

export const partNames: Record<PartId, string> = {
  compressor: "Компрессор",
  condenser: "Конденсатор",
  evaporator: "Испаритель",
  thermostat: "Термостат",
  fan: "Вентилятор No Frost",
  board: "Плата управления",
  seal: "Уплотнитель двери",
  drain: "Дренаж",
  pipes: "Контур с фреоном",
  relay: "Пусковое реле",
  heater: "ТЭН оттайки",
  sensor: "Датчик температуры",
  hinge: "Петли двери",
  lamp: "Освещение",
};

export type FridgeKind = "double" | "sbs" | "single" | "chest" | "wine" | "showcase";

/** Акцентный цвет страницы и подсветки узла — у каждой услуги свой */
export const partAccent: Record<PartId, string> = {
  compressor: "#ff8a4d",
  condenser: "#8aa6ff",
  evaporator: "#9be7ff",
  thermostat: "#ffc24a",
  fan: "#6fdcff",
  board: "#5ee6a8",
  seal: "#b79cff",
  drain: "#4fb6ff",
  pipes: "#6fdcff",
  relay: "#ff6b7a",
  heater: "#ff9a5c",
  sensor: "#f58ac4",
  hinge: "#d3dde8",
  lamp: "#ffe08a",
};

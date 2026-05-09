export const HOME_ROUTE = "/"
export const APP_NAME = "MedQuiz"
export const MEDICINA_ROUTE = "/medicina"
export const MEDICINA_TEST_ROUTE = "/medicina/test"
export const MEDICINA_CARDS_ROUTE = "/medicina/cards"
export const MEDICINA_GLOSSARY_ROUTE = "/medicina/glossary"
export const MEDICINA_PROGRESS_ROUTE = "/medicina/progress"
export const GET_STARTED_ROUTE = "/get-started"
export const FAQ_ROUTE = "/faq"

export const menuList = [
  {
    itemName: "Главная",
    itemLink: HOME_ROUTE,
  },
  {
    itemName: "Выбор раздела",
    itemLink: GET_STARTED_ROUTE,
  },
  {
    itemName: "FAQ",
    itemLink: FAQ_ROUTE,
  },
  {
    itemName: "Medicina legale",
    itemLink: MEDICINA_ROUTE,
    subItems: [
      { itemName: "Все наборы", itemLink: MEDICINA_ROUTE },
      { itemName: "Мой прогресс", itemLink: MEDICINA_PROGRESS_ROUTE },
      { itemName: "Тест", itemLink: MEDICINA_TEST_ROUTE },
      { itemName: "Карточки", itemLink: MEDICINA_CARDS_ROUTE },
      { itemName: "Словарь", itemLink: MEDICINA_GLOSSARY_ROUTE },
    ],
  },
]

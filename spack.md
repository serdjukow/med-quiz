План хороший и реалистичный. Я бы только чуть усилил архитектуру, чтобы потом не переделывать.

Главные правки:

Не сохранять ошибку в pickOption сразу как финальную статистику
Лучше разделить:

answerHistory внутри текущей сессии
сохранение в localStorage только при завершении теста

Иначе при перезагрузке/повторном клике можно получить грязную статистику.

Сделать единый ProgressProvider
Не просто utils, а слой:

ProgressProvider
useProgress()
progressStorage.js
progressMigrations.js

Тогда MedicinaTestPage, Header, Hub, ProgressPage не будут напрямую работать с localStorage.

Ошибки лучше хранить словарём, не массивом
mq:v1:mistakes:deck:<deckId> = {
  [questionId]: {
    questionId,
    selectedKey,
    correctKey,
    wrongCount,
    lastWrongAt,
    resolvedAt,
  }
}

promptIt, promptRu, explanation лучше не дублировать в storage, а брать из актуального deck.questions. Так меньше риска устаревших данных.

Сессии хранить ограниченно
Например последние 50:
mq:v1:sessions -> []

При добавлении новой:

sessions.unshift(newSession)
sessions.slice(0, 50)
Режим повтора ошибок
Лучше явно ввести test mode:
mode: 'normal' | 'mistakes'

И получать вопросы так:

const activeQuestions =
  mode === 'mistakes'
    ? deck.questions.filter(q => mistakeIds.includes(q.id))
    : deck.questions
resolved ошибка
Логика хорошая, но лучше:
если в режиме повтора пользователь ответил правильно → resolvedAt = now
если потом снова ошибся в обычном тесте → resolvedAt = null, wrongCount++
Статистика по deck
Я бы добавил ещё:
attempts,
accuracy,
bestAccuracy,
lastAccuracy,
mistakesCount,
resolvedMistakesCount

Это даст более полезный экран прогресса.

Профиль
Да, local profile ок. Но лучше не называть это “вход”, чтобы не было ожидания аккаунта. Название:
“Локальный профиль” или “Профиль на этом устройстве”.

Итог: план можно брать в работу. Я бы реализовывал в таком порядке:

progressStorage + schema/version/migrations
ProgressProvider + useProgress
локальный профиль
интеграция в MedicinaTestPage
repeat mistakes + review screen
/medicina/progress
виджеты в Hub/Header
reset actions

Самое важное изменение: не тащить localStorage напрямую в страницы, а сделать provider/hook. Это сильно упростит поддержку.
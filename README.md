# RS School React Course 2025 - Tasks 1-4

Это приложение является выполнением заданий по курсу React от [RS School](https://rs.school/).

1.  **Task 1:** Настройка проекта, создание UI с использованием классовых компонентов.
2.  **Task 2:** Покрытие созданных компонентов Unit и Интеграционными тестами.
3.  **Task 3:** Рефакторинг на функциональные компоненты и хуки, внедрение роутинга.
4.  **Task 4:** Внедрение глобального управления состоянием (Zustand) и Context API.
5.  **Task 5:** Управление серверным состоянием с помощью TanStack Query.

**Деплой приложения:** **[https://zilusion-rs-react-2025-art-gallery.netlify.app/](https://zilusion-rs-react-2025-art-gallery.netlify.app/)**

## Обзор функционала

Приложение представляет собой галерею произведений искусства, использующую API [Art Institute of Chicago](https://api.artic.edu/api/v1/artworks).

- **Поиск:** поиск произведений искусства по ключевому слову.
- **Пагинация:** результаты поиска разделены на страницы, между которыми можно перемещаться.
- **Master-Detail View:** возможность открыть детальную информацию о произведении искусства в боковой панели, не покидая страницу со списком.
- **URL-управляемое состояние:** текущий поисковый запрос, страница и открытый детальный вид отражаются в URL, что позволяет делиться ссылками.
- **Сохранение поиска:** последний запрос сохраняется в Local Storage.
- **Обработка состояний:** реализованы индикаторы загрузки, ошибок, пустого результата и страница 404.
- **Обработка ошибок рендеринга:** приложение обернуто в `ErrorBoundary` для перехвата критических ошибок.
- **Выбор элементов:** Пользователь может выбирать отдельные произведения искусства для дальнейших действий. Состояние выбора сохраняется при навигации.
- **Смена темы:** Реализована возможность переключения между светлой и темной темами оформления.
- **Продвинутое кэширование:** Данные, полученные с сервера, кэшируются на клиенте. Это обеспечивает мгновенную загрузку при повторном посещении страниц и фоновое обновление устаревших данных.

## Технический стек и особенности

- **Фреймворк:** React
- **Язык:** TypeScript
- **Сборщик:** Vite
- **Стилизация:** Tailwind CSS
- **Роутинг и данные:**
  - Навигация реализована с помощью **React Router**.
  - Управление серверным состоянием (запросы, кэширование, синхронизация) реализовано с помощью **TanStack Query (React Query)**.
- **Ключевые особенности:**
  - Код переписан с классов на **Функциональные Компоненты** с использованием **React Hooks** (`useState`, `useEffect`, `useCallback` и т.д.).
  - Логика работы с `localStorage` инкапсулирована в **кастомный хук** `useLocalStorageState`.
  - Настроен полный **локальный CI/CD-пайплайн**: ESLint, Stylelint, Prettier, Husky (`pre-commit`, `pre-push`), `lint-staged`, `commitlint`.
  - Все новые функции покрыты **тестами** с использованием Vitest и React Testing Library (общее покрытие **100%**).
- **Управление состоянием:**
  - **Серверное состояние** (данные с API, статусы загрузки/ошибок) управляется **TanStack Query**.
  - **Клиентское состояние** (выбранные элементы) управляется **Zustand**.
  - **Состояние темы** управляется через **React Context API**.

## Локальный запуск

Этот проект использует `pnpm` в качестве основного пакетного менеджера, но полностью совместим с `npm`.

1.  **Клонируйте репозиторий:**

    ```bash
    git clone https://github.com/Zilusion/rs-react-2025.git
    cd rs-react-2025
    ```

2.  **Переключитесь на актуальную рабочую ветку:**

    ```bash
    git checkout api-queries
    ```

3.  **Установите зависимости:**
    - **С помощью `pnpm` (рекомендуется):**
      ```bash
      pnpm install
      ```
    - **С помощью `npm`:**
      ```bash
      npm install
      ```

4.  **Запустите сервер для разработки:**
    - **С помощью `pnpm`:**
      ```bash
      pnpm dev
      ```
    - **С помощью `npm`:**
      ```bash
      npm run dev
      ```

## Доступные скрипты

- **`pnpm dev` / `npm run dev`**: Запуск приложения в режиме разработки.
- **`pnpm build` / `npm run build`**: Сборка продакшн-версии приложения.
- **`pnpm check` / `npm run check`**: Запуск всех проверок качества кода.
- **`pnpm fix` / `npm run fix`**: Попытка автоматического исправления всех ошибок.
- **`pnpm test` / `npm run test`**: Запуск тестов в watch-режиме.
- **`pnpm test:coverage` / `npm run test:coverage`**: Запуск тестов с генерацией отчета о покрытии.

```
rs-react-2025
├─ .husky
│  ├─ commit-msg
│  ├─ pre-commit
│  ├─ pre-push
│  └─ _
│     ├─ applypatch-msg
│     ├─ commit-msg
│     ├─ h
│     ├─ husky.sh
│     ├─ post-applypatch
│     ├─ post-checkout
│     ├─ post-commit
│     ├─ post-merge
│     ├─ post-rewrite
│     ├─ pre-applypatch
│     ├─ pre-auto-gc
│     ├─ pre-commit
│     ├─ pre-merge-commit
│     ├─ pre-push
│     ├─ pre-rebase
│     └─ prepare-commit-msg
├─ .lintstagedrc.js
├─ .prettierrc
├─ .stylelintrc.json
├─ commitlint.config.js
├─ eslint.config.js
├─ next.config.js
├─ package-lock.json
├─ package.json
├─ pnpm-lock.yaml
├─ postcss.config.js
├─ README.md
├─ src
│  ├─ api
│  │  ├─ artworks-api.test.ts
│  │  ├─ artworks-api.ts
│  │  └─ artworks-api.types.ts
│  ├─ app
│  │  ├─ (main)
│  │  │  ├─ collection
│  │  │  │  └─ [page]
│  │  │  │     ├─ @details
│  │  │  │     │  ├─ page.tsx
│  │  │  │     │  └─ [artworkId]
│  │  │  │     │     └─ page.tsx
│  │  │  │     ├─ @list
│  │  │  │     │  └─ page.tsx
│  │  │  │     └─ layout.tsx
│  │  │  └─ layout.tsx
│  │  ├─ favicon.ico
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  └─ providers.tsx
│  ├─ app.test.tsx
│  ├─ app.tsx
│  ├─ contexts
│  │  └─ theme
│  │     ├─ context.ts
│  │     ├─ hook.test.ts
│  │     ├─ hook.ts
│  │     ├─ index.ts
│  │     ├─ provider.test.tsx
│  │     └─ provider.tsx
│  ├─ features
│  │  ├─ artwork-details
│  │  │  ├─ index.test.tsx
│  │  │  ├─ index.tsx
│  │  │  ├─ useArtworkDetails.test.ts
│  │  │  └─ useArtworkDetails.ts
│  │  ├─ artworks-list
│  │  │  ├─ index.test.tsx
│  │  │  ├─ index.tsx
│  │  │  ├─ useArtworks.test.ts
│  │  │  └─ useArtworks.ts
│  │  ├─ artworks-search
│  │  │  ├─ index.test.tsx
│  │  │  └─ index.tsx
│  │  ├─ error-boundary
│  │  │  ├─ index.test.tsx
│  │  │  └─ index.tsx
│  │  ├─ flyout
│  │  │  ├─ index.test.tsx
│  │  │  └─ index.tsx
│  │  └─ ui
│  │     ├─ card
│  │     │  ├─ index.test.tsx
│  │     │  └─ index.tsx
│  │     ├─ image-with-fallback
│  │     │  └─ index.tsx
│  │     ├─ layout
│  │     │  ├─ index.test.tsx
│  │     │  └─ index.tsx
│  │     ├─ loader
│  │     │  ├─ index.test.tsx
│  │     │  └─ index.tsx
│  │     ├─ pagination
│  │     │  ├─ index.test.tsx
│  │     │  └─ index.tsx
│  │     └─ theme-switcher
│  │        ├─ index.test.tsx
│  │        └─ index.tsx
│  ├─ hooks
│  │  ├─ use-local-storage-state.test.ts
│  │  └─ use-local-storage-state.ts
│  ├─ legacy.tsx
│  ├─ lib
│  │  ├─ csv-utils.test.ts
│  │  ├─ csv-utils.ts
│  │  ├─ paths.test.ts
│  │  └─ paths.ts
│  ├─ pages
│  │  ├─ about-page
│  │  │  ├─ index.test.tsx
│  │  │  └─ index.tsx
│  │  ├─ collection-page
│  │  │  ├─ index.integration.test.tsx
│  │  │  ├─ index.test.tsx
│  │  │  └─ index.tsx
│  │  ├─ error-page
│  │  │  ├─ index.test.tsx
│  │  │  └─ index.tsx
│  │  └─ not-found-page
│  │     ├─ index.test.tsx
│  │     └─ index.tsx
│  ├─ store
│  │  ├─ selected-artworks.test.ts
│  │  └─ selected-artworks.ts
│  └─ __mocks__
│     └─ artworks.ts
├─ tsconfig.json
├─ vitest.config.js
└─ vitest.setup.ts

```

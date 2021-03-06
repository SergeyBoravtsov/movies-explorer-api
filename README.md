# Дипломный проект Movies-explorer (backend)
## Описание

Дипломный проект, выполненный при обучении на [Яндекс.Практикуме](https://praktikum.yandex.ru/)
по специальности Веб-разработчик. Фронтенд проекта находится в репозитории
[movies-explorer-frontend](https://github.com/SergeyBoravtsov/movies-explorer-frontend.git)/

Приложение представляет собой сервис, в котором можно найти фильмы в базе данных на стороннем сервере и сохранить их в базе данных на другом сервере (добавить в избранное). В сервисе реализован личный кабинет, регистрация, авторизация, возможности добавлять фильмы в избранное и удалять их из него. 

***

Приложение реализовано с помощью фреймворка express и модулей node - mongoose, bcryptjs, jsonwebtoken, celebrate, cors, dotenv, express-rate-limit, winston, helmet, validator.
Настроена проверка кода с помощью модуля eslint.

### Запросы:
- `POST /signup` — регистрация пользователя. Передать в body JSON с полями `name`, `email`, `password`
- `POST /signin` — авторизация. Передать в body `email` и `password`. Возвращает JWT
- `GET /users/me` — возвращает данные о залогиненном пользователе. В заголовках должен быть указан Authorization с токеном
из прошлого пункта (перед токеном не забыть прописать `Bearer`)
- `PATCH /users/me` — изменение данных пользователя. Принимает новые `name` и `email`
- `GET /movies` — возвращает список сохраненных фильмов. Только авторизованным пользователям
- `POST /movies` — создает новый фильм. Принимает объект с полями `country`, `director`, `duration`, `year`, `description`,
`image`, `trailer`, `thumbnail`, `movieId`, `nameRU`, `nameEN`
- `DELETE /movies/:movieId` — удаление фильма из БД. Удалять можно только созданные пользователем карточки

## Запуск проекта
`npm i` - устанавливает зависимости

`npm run dev` — запускает проект локально

***
- Публичный IP-адрес сервера: 178.154.240.244
- Домен: https://movies-sergeyboravtsov-api.herokuapp.com/

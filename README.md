# Скрипт с анимацией для новогоднего баннера
Адаптивный интерактивный новогодний баннер с анимациями: падающий снег, раскачивающиеся игрушки и декоративные элементы.

## Превью
![Превью](./assets/preview.gif)

## Демо:
[Перейти](https://segas-segason.github.io/banner-new-year-2026/)

## Возможности

- Генерация падающего снега (JS + CSS animations)
- Реалистичное покачивание игрушек от движения мыши
- Многослойная композиция (фон, ветки, декор)
- Полная адаптивность (через clamp() и CSS variables)
- Оптимизация через requestAnimationFrame
- Чистая архитектура (HTML + CSS + Vanilla JS)

## Структура проекта

ny-banner/
- index.html
-- css/
--- main.css
-- scripts/
--- ny-banner.js
-- img/
--- bg.png
--- chain.png
--- happy-new-year-2026.png
--- tree-branch/
---- tree-branch-1.png
---- tree-branch-bg.png
--- christmas-toys/
---- christmas-toys-1.png
---- christmas-toys-2.png
---- christmas-toys-3.png
---- christmas-toys-4.png
---- christmas-toys-5.png
---- snowflake/
- README.md

## Как это работает

1. Снег (Snow System)
- Динамически создаются снежинки (<img>)
- Используются 2 анимации:
-- ny-fall — падение
-- ny-drift — горизонтальное смещение
- Контролируется количество элементов (TARGET, MAX_FLAKES)

2. Физика игрушек
- Реакция на движение мыши (mousemove)
- Расчет скорости курсора → преобразование в "ветер"
- Плавное вращение через interpolation:
    angle += (target - angle) * smooth

3. Адаптивность
- Используются:
-- clamp()
-- CSS переменные (--s, --toy-w, и т.д.)
- Масштабирование без медиа-зависимости

## Технологии

- HTML5
- CSS3 (custom properties, animations)
- JavaScript (ES6+)
- ResizeObserver
- requestAnimationFrame

## Особенности реализации

- Нет зависимостей (без библиотек)
- Минимальная нагрузка на CPU
- Контроль DOM-элементов (удаление снежинок после анимации)
- Оптимизированные перерисовки
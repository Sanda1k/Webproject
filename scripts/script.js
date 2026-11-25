'use strict';

const CATEGORIES_URL = 'data/categories.json';

const fetchCategories = async () => {
  const response = await fetch(CATEGORIES_URL);

  if (!response.ok) {
    throw new Error(`Сервер ответил ${response.status} ${response.statusText}`);
  }

  return response.json();
};

const categoriesList = document.querySelector('[data-categories-list]');
const categoriesStatus = document.querySelector('[data-categories-status]');
const categoriesRetry = document.querySelector('[data-categories-retry]');
const categoryTemplate = document.querySelector('#category-card-template');

if (categoriesList && categoriesStatus && categoriesRetry && categoryTemplate) {
  const createCategoryCard = (category) => {
    const card = categoryTemplate.content.firstElementChild.cloneNode(true);

    card.querySelector('.category-card__icon').src = category.icon;
    card.querySelector('.category-card__title').textContent = category.title;
    card.querySelector('.category-card__text').textContent = category.text;

    return card;
  };

  const loadCategories = async () => {
    categoriesList.setAttribute('aria-busy', 'true');
    categoriesStatus.textContent = 'Загружаем направления питания…';
    categoriesRetry.hidden = true;

    try {
      const categories = await fetchCategories();

      categoriesList.replaceChildren(...categories.map(createCategoryCard));
      categoriesStatus.textContent = categories.length === 0 ? 'Направления пока не добавлены' : '';
    } catch (error) {
      console.error('Не удалось загрузить направления питания:', error);
      categoriesStatus.textContent = 'Не удалось загрузить направления питания. Проверьте соединение и попробуйте ещё раз.';
      categoriesRetry.hidden = false;
    } finally {
      categoriesList.removeAttribute('aria-busy');
    }
  };

  categoriesRetry.addEventListener('click', async () => {
    await loadCategories();

    if (categoriesRetry.hidden) {
      const categoriesTitle = document.querySelector('#categories-title');

      if (categoriesTitle) {
        categoriesTitle.setAttribute('tabindex', '-1');
        categoriesTitle.focus();
      }
    }
  });

  loadCategories();
}
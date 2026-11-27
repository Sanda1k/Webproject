'use strict';

/* 1. Загрузка направлений питания из data/categories.json через fetch */

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

/* 2. Сценарий 1: переключение тарифов калорийности (800–2400 ккал) */

const TARIFFS = {
  express: {
    title: 'Тариф EXPRESS FIT — 800 ккал',
    description: 'Интенсивная программа для быстрого и безопасного снижения веса с акцентом на лёгкие белковые блюда и овощи.',
    prices: ['347 грн', '460 грн', '440 грн/день', '420 грн/день', '395 грн/день', '391 грн'],
  },
  slim: {
    title: 'Тариф SLIM — 1000 ккал',
    description: 'Комфортный рацион для плавного похудения без чувства голода с 4 сбалансированными приёмами пищи в день.',
    prices: ['367 грн', '485 грн', '465 грн/день', '445 грн/день', '420 грн/день', '412 грн'],
  },
  fitness: {
    title: 'Тариф FITNESS — 1300 ккал',
    description: 'Программа здорового питания Fitness. Идеально для снижения веса, повышения энергии и сил при сидячем образе жизни.',
    prices: ['387 грн', '510 грн', '490 грн/день', '470 грн/день', '445 грн/день', '433 грн'],
  },
  balance: {
    title: 'Тариф BALANCE — 1600 ккал',
    description: 'Сбалансированный рацион на каждый день для поддержания оптимального веса и высокой работоспособности.',
    prices: ['417 грн', '545 грн', '525 грн/день', '505 грн/день', '480 грн/день', '463 грн'],
  },
  'balance-plus': {
    title: 'Тариф BALANCE + — 1800 ккал',
    description: 'Полноценное питание для активного образа жизни и регулярных тренировок с оптимальным балансом БЖУ.',
    prices: ['437 грн', '570 грн', '550 грн/день', '530 грн/день', '505 грн/день', '484 грн'],
  },
  strong: {
    title: 'Тариф STRONG — 2000 ккал',
    description: 'Питательный рацион для мужчин и спортсменов, помогающий поддерживать мышечный тонус и восстанавливаться после нагрузок.',
    prices: ['467 грн', '605 грн', '585 грн/день', '565 грн/день', '540 грн/день', '514 грн'],
  },
  maxi: {
    title: 'Тариф MAXI FIT — 2400 ккал',
    description: 'Максимальная калорийность для набора качественной мышечной массы и интенсивных силовых тренировок.',
    prices: ['497 грн', '645 грн', '625 грн/день', '605 грн/день', '580 грн/день', '548 грн'],
  },
};

const tariffButtons = document.querySelectorAll('[data-tariff]');
const tariffTitle = document.querySelector('[data-tariff-title]');
const tariffDescription = document.querySelector('[data-tariff-description]');
const tariffPrices = document.querySelectorAll('[data-tariff-price]');

if (tariffButtons.length > 0 && tariffTitle && tariffDescription && tariffPrices.length > 0) {
  const initialButton = document.querySelector('.programs__calories-btn--active[data-tariff]');
  let selectedTariff = initialButton ? initialButton.dataset.tariff : tariffButtons[0].dataset.tariff;

  const renderTariff = () => {
    const currentTariff = TARIFFS[selectedTariff];

    if (!currentTariff) {
      return;
    }

    tariffButtons.forEach((button) => {
      const isSelected = button.dataset.tariff === selectedTariff;
      button.classList.toggle('programs__calories-btn--active', isSelected);
      button.setAttribute('aria-pressed', String(isSelected));
    });

    tariffTitle.textContent = currentTariff.title;
    tariffDescription.textContent = currentTariff.description;

    tariffPrices.forEach((priceNode, index) => {
      if (currentTariff.prices[index]) {
        priceNode.textContent = currentTariff.prices[index];
      }
    });
  };

  tariffButtons.forEach((button) => {
    button.addEventListener('click', () => {
      selectedTariff = button.dataset.tariff;
      renderTariff();
    });
  });

  renderTariff();
}
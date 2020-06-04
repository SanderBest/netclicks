// КОНСТАНТЫ
const IMG_URL = "https://image.tmdb.org/t/p/w185_and_h278_bestv2";

// ПЕРЕМЕННЫЕ
const leftMenu = document.querySelector(".left-menu"),
  hamburger = document.querySelector(".hamburger"),
  modal = document.querySelector(".modal"),
  tvShowList = document.querySelector(".tv-shows__list"),
  tvShows = document.querySelector(".tv-shows"),
  tvCardImg = document.querySelector(".tv-card__img"),
  modalTitle = document.querySelector(".modal__title"),
  genresList = document.querySelector(".genres-list"),
  rating = document.querySelector(".rating"),
  description = document.querySelector(".description"),
  modalLink = document.querySelector(".modal__link"),
  searchFormInput = document.querySelector(".search__form-input"),
  searchForm = document.querySelector(".search__form"),
  preloader = document.querySelector(".preloader"),
  dropdown = document.querySelectorAll(".dropdown"),
  tvShowsHead = document.querySelector(".tv-shows__head"),
  posterWrapper = document.querySelector(".poster__wrapper"),
  pagination = document.querySelector(".pagination"),
  trailer = document.getElementById("trailer"),
  headTrailer = document.getElementById("headTrailer");

// ПРЕЛОУДЕР
const loading = document.createElement("div");
loading.className = "loading";

// КЛАСС
const DBService = class {
  constructor() {
    this.API_KEY = "5189f5be8b28c15f8b6340d26142c3ec";
    this.SERVER = "https://api.themoviedb.org/3";
  }

  async getData(url) {
    const res = await fetch(url);

    if (res.ok) {
      return res.json();
    } else {
      throw new Error(`Не удалось получить данные по адресу ${url}`);
    }
  }

  getTestData = () => {
    return this.getData("test.json");
  };

  getTestCard = () => {
    return this.getData("card.json");
  };

  getSearchResult = (query) => {
    this.temp = `${this.SERVER}/search/tv?api_key=${this.API_KEY}&language=ru-RU&query=${query}`;
    return this.getData(this.temp);
  };

  getNextPage = (page) => {
    return this.getData(this.temp + "&page=" + page);
  };

  getSearchResult = (query) => {
    this.temp =
      this.SERVER +
      "/search/tv?api_key=" +
      this.API_KEY +
      "&language=ru-RU&query=" +
      query;
    return this.getData(this.temp);
  };

  getNextPage = (page) => {
    return this.getData(this.temp + "&page=" + page);
  };

  getTvShow = (id) => {
    return this.getData(
      `${this.SERVER}/tv/${id}?api_key=${this.API_KEY}&language=ru-RU`
    );
  };

  getTopRated = () =>
    this.getData(
      `${this.SERVER}/tv/top_rated?api_key=${this.API_KEY}&language=ru-RU`
    );

  getPopular = () =>
    this.getData(
      `${this.SERVER}/tv/popular?api_key=${this.API_KEY}&language=ru-RU`
    );

  getToday = () =>
    this.getData(
      `${this.SERVER}/tv/airing_today?api_key=${this.API_KEY}&language=ru-RU`
    );

  getWeek = () =>
    this.getData(
      `${this.SERVER}/tv/on_the_air?api_key=${this.API_KEY}&language=ru-RU`
    );

  getVideo = (id) => {
    return this.getData(
      `${this.SERVER}/tv/${id}/videos?api_key=${this.API_KEY}&language=ru-RU`
    );
  };
};

const dbService = new DBService();

// РЕНДЕР КАРТОЧЕК
const renderCard = (response, target) => {
  tvShowList.textContent = "";

  if (!response.total_results) {
    tvShowsHead.textContent = "По вашему запросу сериалов не найдено";
    tvShowsHead.style.cssText = "color: red;";
    loading.remove();
    return;
  }

  tvShowsHead.textContent = target ? target.textContent : "Результат поиска:";
  tvShowsHead.style.cssText = "color: black;";

  response.results.forEach((item) => {
    const {
      backdrop_path: backdrop,
      name: title,
      poster_path: poster,
      vote_average: vote,
      id,
    } = item;

    const posterIMG = poster ? IMG_URL + poster : "img/no-poster.jpg";
    const backdropIMG = backdrop ? IMG_URL + backdrop : "";
    const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : "";

    const card = document.createElement("li");
    // card.idTV = id;
    card.className = "tv-shows__item";
    card.innerHTML = `
            <a href="#" id=${id} class="tv-card">
                ${voteElem}
                <img class="tv-card__img"
                  src="${posterIMG}"
                  data-backdrop="${backdropIMG}"
                  alt="${title}">
                <h4 class="tv-card__head">${title}</h4>
            </a>`;
    loading.remove();
    tvShowList.append(card);
  });

  pagination.textContent = "";

  if (!target && response.total_pages > 1) {
    for (let i = 1; i <= response.total_pages; i++) {
      pagination.innerHTML += `<li><a href="#" class="pages">${i}</a></li>`;
    }
  }
};

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = searchFormInput.value.trim();

  if (value) {
    tvShows.append(loading);
    dbService.getSearchResult(value).then(renderCard);
  }
  searchFormInput.value = "";
  pagination.textContent = "";
});

// закрытие дропдауна
const closeDropDown = () => {
  dropdown.forEach((item) => {
    item.classList.remove("active");
  });
};

// Открытие/закрыти меню по кнопке
hamburger.addEventListener("click", (event) => {
  leftMenu.classList.toggle("openMenu");
  hamburger.classList.toggle("open");
  closeDropDown();
});
// Закрытие меню при клике вне меню
document.addEventListener("click", (event) => {
  if (!event.target.closest(".left-menu")) {
    leftMenu.classList.remove("openMenu");
    hamburger.classList.remove("open");
    closeDropDown();
  }
});

// открытие dropdown
leftMenu.addEventListener("click", (event) => {
  event.preventDefault();
  const target = event.target;
  const dropdown = target.closest(".dropdown");
  if (dropdown) {
    dropdown.classList.toggle("active");
    leftMenu.classList.add("openMenu");
    hamburger.classList.add("open");
  }

  if (target.closest("#top-rated")) {
    dbService.getTopRated().then((response) => renderCard(response, target));
  }

  if (target.closest("#popular")) {
    dbService.getPopular().then((response) => renderCard(response, target));
  }

  if (target.closest("#today")) {
    dbService.getToday().then((response) => renderCard(response, target));
  }

  if (target.closest("#week")) {
    dbService.getWeek().then((response) => renderCard(response, target));
  }

  if (target.closest("#search")) {
    tvShowList.textContent = "";
    tvShowsHead.textContent = "";
  }
});

// открытие модального окна
tvShowList.addEventListener("click", (event) => {
  event.preventDefault();

  const target = event.target;
  const card = target.closest(".tv-card");

  if (card) {
    preloader.style.display = "block";
    dbService
      .getTvShow(card.id)
      .then((response) => {
        if (response.poster_path) {
          tvCardImg.src = IMG_URL + response.poster_path;
          tvCardImg.alt = response.name;
        } else {
          tvCardImg.src = "img/no-poster.jpg";
        }

        modalTitle.textContent = response.name;

        genresList.textContent = "";
        response.genres.forEach((item) => {
          genresList.innerHTML += `<li>${item.name}</li>`;
        });

        if (response.homepage) {
          modalLink.href = response.homepage;
          modalLink.style.display = "";
        } else {
          modalLink.style.display = "none";
        }

        rating.textContent = response.vote_average;
        description.textContent = response.overview;
        return response.id;
      })

      .then(dbService.getVideo)
      .then((response) => {
        headTrailer.classList.add("hide");
        trailer.textContent = "";
        if (response.results.length) {
          headTrailer.classList.remove("hide");
          response.results.forEach((item) => {
            const trailerItem = document.createElement("li");
            trailerItem.innerHTML = `
            <iframe 
              width="500" 
              height="300" 
              src="https://www.youtube.com/embed/${item.key}" 
              frameborder="0" 
              allowfullscreen>
            </iframe>
            <h4>${item.name}</h4>`;
            trailer.append(trailerItem);
          });
        }
      })
      .then(() => {
        document.body.style.overflow = "hidden";
        modal.classList.remove("hide");
      })
      .finally(() => {
        preloader.style.display = "";
      });
  }
});

// закрытие модального окна

modal.addEventListener("click", (event) => {
  if (
    event.target.classList.contains("modal") ||
    event.target.closest(".cross")
  ) {
    document.body.style.overflow = "";
    modal.classList.add("hide");
  }
});

// ЗАМЕНА Изображений карточек фильмов

const changeImage = (event) => {
  const card = event.target.closest(".tv-shows__item");

  if (card) {
    const img = card.querySelector(".tv-card__img");

    if (img.dataset.backdrop) {
      [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src];
    }
  }
};

// Замена картинок в карточке
tvShowList.addEventListener("mouseover", changeImage);
tvShowList.addEventListener("mouseout", changeImage);

pagination.addEventListener("click", (event) => {
  event.preventDefault;
  const target = event.target;

  if (target.classList.contains("pages")) {
    tvShows.append(loading);
    dbService.getNextPage(target.textContent).then(renderCard);
  }
});

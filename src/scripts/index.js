import { darkMode, verifyMode } from "../scripts/theme.js";
import { handleCustomInputRange } from "../scripts/input.js";
import { fetchAlbums } from "../scripts/api.js";
import { genresList } from "../scripts/productsData.js";

(function () {
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function (key, value) {
    console.log(`LocalStorage set: ${key} = ${value}`);
    originalSetItem.apply(this, arguments);
  };
})();


const renderGenreItems = (genres) => {
  const ulGenreList = document.querySelector(".genres__list");
  if (!ulGenreList) {
    console.error("Elemento .genres__list não encontrado.");
    return;
  }
  ulGenreList.innerHTML = "";

  genres.forEach((genre) => {
    const liGenre = document.createElement("li");
    liGenre.textContent = genre;
    liGenre.classList.add("genre__item", "text3");

    if (genre === "Todos") liGenre.classList.add("active");

    liGenre.addEventListener("click", () => handleGenreSelection(genre));
    ulGenreList.appendChild(liGenre);
  });
};

const createAlbumCard = ({ img, band, year, genre, title, price }) => {
  const formattedPrice = isNaN(Number(price)) ? 0 : Number(price);

  const card = document.createElement("li");
  card.classList.add("album__item", "slide");

  card.innerHTML = `
    <figure class="album__cover-container">
      <img class="album__cover" src="${img}" alt="Capa do álbum ${title}">
    </figure>
    <h3 class="album__name">${title}</h3>
    <div class="album__details">
      <span class="album__band">${band}</span>
      <span class="album__year">${year}</span>
      <span class="album__genre">${genre}</span>
    </div>
    <div class="album__price--container">
      <h3 class="album__price">R$ ${formattedPrice.toFixed(2)}</h3>
      <button class="album__buy--button">Comprar</button>
    </div>
  `;

  return card;
};

const renderAlbumCards = (albums) => {
  const ulAlbumList = document.querySelector(".albums__list");
  if (!ulAlbumList) {
    console.error("Elemento .albums__list não encontrado.");
    return;
  }
  ulAlbumList.innerHTML = "";

  if (!albums.length) {
    ulAlbumList.innerHTML = "<p>Nenhum álbum encontrado.</p>";
    return;
  }

  albums.forEach((album) => ulAlbumList.appendChild(createAlbumCard(album)));
};

const handleGenreSelection = (genre) => {
  const genres = document.querySelectorAll(".genre__item");
  if (!genres.length) {
    console.error("Itens de gênero não encontrados.");
    return;
  }
  genres.forEach((item) => item.classList.remove("active"));

  const selectedGenre = Array.from(genres).find(
    (item) => item.textContent === genre
  );
  if (selectedGenre) {
    selectedGenre.classList.add("active");
  }

  const inputPriceRange = document.querySelector(".price__input-range");
  if (!inputPriceRange) {
    console.error("Elemento .price__input-range não encontrado.");
    return;
  }
  const priceValue = parseFloat(inputPriceRange.value);

  const filteredAlbums = handleFilter(currentAlbumList, genre, priceValue);
  renderAlbumCards(filteredAlbums);
};

const handleFilter = (albums, genre = "Todos", maxPrice) => {
  return albums.filter(
    ({ genre: albumGenre, price }) =>
      (albumGenre === genre || genre === "Todos") && price <= maxPrice
  );
};

const setupFilterEvents = () => {
  const inputPriceRange = document.querySelector(".price__input-range");
  const spanPriceValue = document.querySelector(".price-range__value--dynamic");

  if (!inputPriceRange || !spanPriceValue) {
    console.error("Elemento de faixa de preço não encontrado.");
    return;
  }

  inputPriceRange.addEventListener("input", (event) => {
    const priceValue = parseFloat(event.target.value);
    spanPriceValue.textContent = `R$ ${priceValue.toFixed(2)}`;

    const activeGenreElement = document.querySelector(".genre__item.active");
    const activeGenre = activeGenreElement ? activeGenreElement.textContent : "Todos";
    const filteredAlbums = handleFilter(currentAlbumList, activeGenre, priceValue);

    renderAlbumCards(filteredAlbums);
  });
};

let currentAlbumList = [];

const updateClasses = () => {
  const html = document.querySelector("html");
  const headerBtn = document.querySelector(".header__btn");

  if (!html || !headerBtn) {
    console.error("Elemento html ou botão de cabeçalho não encontrado.");
    return;
  }

  const isDarkMode = localStorage.getItem("@dark-mode") === "true";

  if (isDarkMode) {
    html.classList.add("dark-mode");
    headerBtn.classList.add("header__btn--dark-mode");
  } else {
    html.classList.remove("dark-mode");
    headerBtn.classList.remove("header__btn--dark-mode");
  }
};

const initializeApp = async () => {
  const observeHtmlClass = () => {
    const html = document.documentElement;
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          console.log(`HTML classList changed: ${html.classList}`);
        }
      });
    });
  
    observer.observe(html, { attributes: true });
  };
  
  observeHtmlClass();
  
  try {
    document.addEventListener("DOMContentLoaded", () => {
      handleCustomInputRange();
      renderGenreItems(genresList);
      setupFilterEvents();
    });

    darkMode();
    verifyMode();
    updateClasses();

    currentAlbumList = await fetchAlbums();
    if (!currentAlbumList.length) {
      console.warn("Nenhum dado recebido da API, carregando fallback...");
    }
    renderAlbumCards(currentAlbumList);
  } catch (error) {
    console.error("Erro ao inicializar o aplicativo:", error);
    renderAlbumCards([]);
  }
};

initializeApp();

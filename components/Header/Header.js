import "./Header.css";
import MainSection from "../Main-section/Main-section";

const template = () => {
  return `
<section class="navbar">
<nav>
<img src="./icon.png" alt="logo">
<ul>
    <li><img src="../logo.jpg" alt="logo"></li>
    <li class="search-container">
      <i class="fas fa-search"></i>
      <input type="text" placeholder="¿Qué quieres reproducir?" id="search-input">
      <button class="clear-btn" aria-label="Limpiar búsqueda"><i class="fas fa-trash"></i></button>
      <ul class="suggestions" id="suggestions"></ul>
    </li>
</ul>
</nav>
  
<nav>
<ul>
<li>Premium</li>
<li>Asistencia</li>
<li>Descargar</li>
</ul>
<hr>
<ul>
<li>Instalar App</li>
<li>Registrarse</li>
<li>
<button class="modal btn">Iniciar Sesión</button>
</li>
</ul>
</nav>
</section>
  `;
};

const audio = new Audio();
let currentAudioIndex = null;
let currentPlayButton = null;

const Header = () => {
  const header = document.querySelector("header");
  if (!header) {
    console.warn("No se encontró <header> en el DOM.");
    return;
  }
  header.innerHTML = template();
  initSearch();
};

const initSearch = () => {
  const input = document.getElementById("search-input");
  const clearBtn = document.querySelector(".clear-btn");
  const suggestions = document.getElementById("suggestions");

  if (!input || !clearBtn || !suggestions) {
    console.warn("Elementos de búsqueda no encontrados.");
    return;
  }

  // CLICK en papelera: limpia y restaura MainSection
  clearBtn.addEventListener("click", (e) => {
    e.preventDefault();
    input.value = "";
    suggestions.innerHTML = "";
    suggestions.classList.remove("show");

    try {
      if (audio && !audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    } catch (err) {
      console.warn("Error al pausar el audio:", err);
    }

    let mainSection = document.querySelector(".main-section");
    if (!mainSection) {
      mainSection = document.createElement("main");
      mainSection.className = "main-section";
      const headerEl = document.querySelector("header");
      if (headerEl && headerEl.parentNode) {
        headerEl.parentNode.insertBefore(mainSection, headerEl.nextSibling);
      } else {
        document.body.appendChild(mainSection);
      }
    }

    try {
      MainSection();
    } catch (err) {
      console.error("Error al invocar MainSection():", err);
    }
  });

  // Sugerencias mientras se escribe
  input.addEventListener("input", async (e) => {
    const query = e.target.value.trim();
    if (!query) {
      suggestions.innerHTML = "";
      suggestions.classList.remove("show");
      return;
    }

    try {
      const res = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(
          query
        )}&entity=song&limit=5`
      );
      const data = await res.json();

      suggestions.innerHTML = "";
      if (data.results.length > 0) {
        suggestions.classList.add("show");
        data.results.forEach((song, index) => {
          const li = document.createElement("li");
          li.textContent = `${song.trackName} - ${song.artistName}`;
          li.addEventListener("click", () => {
            renderSearchResults([song]);
            suggestions.innerHTML = "";
            suggestions.classList.remove("show");
            input.value = "";
          });
          suggestions.appendChild(li);
        });
      } else {
        suggestions.classList.add("show");
        suggestions.innerHTML = "<li>No se encontraron resultados</li>";
      }
    } catch (err) {
      console.error("Error buscando sugerencias:", err);
      suggestions.classList.add("show");
      suggestions.innerHTML = "<li>Error al buscar</li>";
    }
  });

  // Enter para buscar y mostrar resultados
  input.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
      const query = input.value.trim();
      if (!query) {
        alert("Escribe algo para buscar 🎵");
        return;
      }

      try {
        const res = await fetch(
          `https://itunes.apple.com/search?term=${encodeURIComponent(
            query
          )}&entity=song&limit=10`
        );
        const data = await res.json();

        if (data.results.length > 0) {
          renderSearchResults(data.results);
        } else {
          alert("No se encontraron canciones 😢");
        }

        suggestions.innerHTML = "";
        suggestions.classList.remove("show"); // 🔹 ocultar tras Enter
      } catch (err) {
        console.error("Error en búsqueda:", err);
        alert("Error al buscar canciones.");
      }
    }
  });
};

const renderSearchResults = (songs) => {
  const mainSection = document.querySelector(".main-section");
  if (!mainSection) {
    console.warn("No se encontró .main-section para mostrar resultados.");
    return;
  }

  mainSection.innerHTML = `
    <section class="search-results">
      <h2>Resultados de búsqueda</h2>
      <div class="songs-grid" id="search-results"></div>
    </section>
  `;

  const container = document.getElementById("search-results");

  songs.forEach((song, index) => {
    const div = document.createElement("div");
    div.className = "song-card";
    const highResUrl = song.artworkUrl100
      ? song.artworkUrl100.replace("100x100bb", "600x600bb")
      : "";

    div.innerHTML = `
      <div class="song-cover">
        <img src="${highResUrl}" alt="${song.trackName}">
        <div class="play-icon" data-index="${index}">
          <i class="fa-solid fa-play"></i>
        </div>
      </div>
      <div class="song-info">
        <div class="song-title">${song.trackName}</div>
        <div class="song-artist">${song.artistName}</div>
      </div>
    `;
    container.appendChild(div);
  });

  addPlayFunctionality("search-results", songs);
};

const addPlayFunctionality = (containerId, dataArray) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.querySelectorAll(".play-icon").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = parseInt(btn.dataset.index);
      const item = dataArray[index];

      if (currentAudioIndex === index && !audio.paused) {
        audio.pause();
      } else {
        if (currentPlayButton && currentPlayButton !== btn) {
          currentPlayButton.innerHTML = `<i class="fa-solid fa-play"></i>`;
        }

        audio.src = item.previewUrl;
        audio.play();
        currentAudioIndex = index;
        currentPlayButton = btn;
      }

      btn.innerHTML = audio.paused
        ? `<i class="fa-solid fa-play"></i>`
        : `<i class="fa-solid fa-pause"></i>`;
    });
  });

  audio.addEventListener("ended", () => {
    if (currentPlayButton)
      currentPlayButton.innerHTML = `<i class="fa-solid fa-play"></i>`;
    currentAudioIndex = null;
  });
};

export default Header;



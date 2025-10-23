import "./Main-section.css";

const template = () => `
  <section class="section-one">
    <div class="section-header">
      <h1>Canciones en tendencia</h1>
    </div>
    <div class="carousel-container">
      <button class="carousel-btn left" id="scroll-trending-left">‹</button>
      <div class="songs-carousel" id="trending-songs"></div>
      <button class="carousel-btn right" id="scroll-trending-right">›</button>
    </div>
  </section>

  <section class="section-artists">
    <div class="section-header">
      <h1>Artistas populares</h1>
    </div>
    <div class="carousel-container">
      <button class="carousel-btn left" id="scroll-artists-left">‹</button>
      <div class="artists-carousel" id="artists-carousel"></div>
      <button class="carousel-btn right" id="scroll-artists-right">›</button>
    </div>
  </section>

  <section class="section-three">
    <div class="section-header">
      <h1>Álbumes y sencillos populares</h1>
    </div>
    <div class="carousel-container">
      <button class="carousel-btn left" id="scroll-albums-left">‹</button>
      <div class="albums-carousel" id="albums-carousel"></div>
      <button class="carousel-btn right" id="scroll-albums-right">›</button>
    </div>
  </section>

  <section class="section-four">
    <div class="section-header">
      <h1>Listas seleccionadas</h1>
    </div>
    <div class="carousel-container">
      <button class="carousel-btn left" id="scroll-playlists-left">‹</button>
      <div class="playlists-carousel" id="playlists-carousel"></div>
      <button class="carousel-btn right" id="scroll-playlists-right">›</button>
    </div>
  </section>

  <footer>
    <section class="footer-one">
      <nav>
        <h4>Empresa</h4>
        <ul>
          <li>Acerca de</li>
          <li>Empleo</li>
          <li>For the record</li>
        </ul>
      </nav>
      <nav>
        <h4>Comunidades</h4>
        <ul>
          <li>Para Artistas</li>
          <li>Desarrolladores</li>
          <li>Publicidad</li>
          <li>Inversores</li>
          <li>Proveedores</li>
        </ul>
      </nav>
      <nav>
        <h4>Enlaces útiles</h4>
        <ul>
          <li>Asistencia</li>
          <li>App gratis para móvil</li>
        </ul>
      </nav>
      <nav>
        <h4>Planes y tarifas</h4>
        <ul>
          <li>Premium individual</li>
          <li>Premium duo</li>
          <li>Premium familiar</li>
          <li>Free plan</li>
          <li>Para estudiantes</li>
        </ul>
      </nav>
      <nav>
        <ul class="socials">
          <li><i class="fab fa-facebook-f"></i></li>
          <li><i class="fab fa-twitter"></i></li>
          <li><i class="fab fa-instagram"></i></li>
        </ul>
      </nav>
    </section>

    <section class="footer-two">
      <p>&copy; Garayoa</p>
    </section>
  </footer>
`;

let songsData = [];
let albumsData = [];
let artistsData = [];
let playlistsData = [];
const audio = new Audio();
let currentAudioIndex = null;
let currentPlayButton = null;

const addPlayFunctionality = (containerId, dataArray) => {
  const container = document.getElementById(containerId);
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

const fetchTrendingSongs = async () => {
  const res = await fetch(
    "https://itunes.apple.com/search?term=top&entity=song&limit=20"
  );
  const data = await res.json();
  songsData = data.results;
  renderSongs(songsData);
};

const renderSongs = (songs) => {
  const container = document.getElementById("trending-songs");
  container.innerHTML = "";
  songs.forEach((song, index) => {
    const div = document.createElement("div");
    div.className = "song-card";
    const highResUrl = song.artworkUrl100.replace("100x100bb", "600x600bb");

    div.innerHTML = `
      <div class="song-cover">
        <img src="${highResUrl}" alt="${song.trackName}">
        <div class="play-icon" data-index="${index}"><i class="fa-solid fa-play"></i></div>
      </div>
      <div class="song-info">
        <div class="song-title">${song.trackName}</div>
        <div class="song-artist">${song.artistName}</div>
      </div>
    `;
    container.appendChild(div);
  });
  addPlayFunctionality("trending-songs", songsData);
};

const fetchAlbums = async () => {
  const res = await fetch(
    "https://itunes.apple.com/search?term=pop&entity=album&limit=20"
  );
  const data = await res.json();
  albumsData = data.results;
  renderAlbums(albumsData);
};

const renderAlbums = (albums) => {
  const container = document.getElementById("albums-carousel");
  container.innerHTML = "";
  albums.forEach((album) => {
    const div = document.createElement("div");
    div.className = "song-card";
    const highResUrl = album.artworkUrl100.replace("100x100bb", "600x600bb");

    div.innerHTML = `
      <div class="song-cover">
        <img src="${highResUrl}" alt="${album.collectionName}">
      </div>
      <div class="song-info">
        <div class="song-title">${album.collectionName}</div>
        <div class="song-artist">${album.artistName}</div>
      </div>
    `;
    container.appendChild(div);
  });
};

const fetchArtists = async () => {
  const res = await fetch(
    "https://itunes.apple.com/search?term=pop&entity=album&limit=50"
  );
  const data = await res.json();
  const map = new Map();
  data.results.forEach((album) => {
    if (!map.has(album.artistId))
      map.set(album.artistId, {
        artistName: album.artistName,
        artworkUrl: album.artworkUrl100.replace("100x100bb", "600x600bb"),
      });
  });
  artistsData = Array.from(map.values());
  renderArtists(artistsData);
};

const renderArtists = (artists) => {
  const container = document.getElementById("artists-carousel");
  container.innerHTML = "";
  artists.forEach((artist) => {
    const div = document.createElement("div");
    div.className = "artist-card";
    div.innerHTML = `
      <div class="artist-photo">
        <img src="${artist.artworkUrl}" alt="${artist.artistName}">
      </div>
      <div class="artist-name">${artist.artistName}</div>
    `;
    container.appendChild(div);
  });
};

const fetchPlaylists = async () => {
  const res = await fetch(
    "https://itunes.apple.com/search?term=pop&entity=album&limit=10"
  );
  const data = await res.json();
  playlistsData = data.results;
  renderPlaylists(playlistsData);
};

const renderPlaylists = (albums) => {
  const container = document.getElementById("playlists-carousel");
  container.innerHTML = "";
  albums.forEach((album) => {
    const div = document.createElement("div");
    div.className = "playlist-card";
    const highResUrl = album.artworkUrl100.replace("100x100bb", "600x600bb");

    div.innerHTML = `
      <div class="playlist-cover">
        <img src="${highResUrl}" alt="${album.collectionName}">
      </div>
      <div class="playlist-info">
        <div class="playlist-title">${album.collectionName}</div>
        <div class="playlist-artist">${album.artistName}</div>
      </div>
    `;
    container.appendChild(div);
  });
};

const addCarouselScroll = (leftBtnId, rightBtnId, carouselId) => {
  const leftBtn = document.getElementById(leftBtnId);
  const rightBtn = document.getElementById(rightBtnId);
  const carousel = document.getElementById(carouselId);
  const scrollAmount = 300;

  leftBtn.addEventListener("click", () => {
    carousel.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  });
  rightBtn.addEventListener("click", () => {
    carousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
  });
};

const MainSection = () => {
  const mainSection = document.querySelector(".main-section");
  mainSection.innerHTML = template();

  fetchTrendingSongs();
  fetchAlbums();
  fetchArtists();
  fetchPlaylists();

  addCarouselScroll(
    "scroll-trending-left",
    "scroll-trending-right",
    "trending-songs"
  );
  addCarouselScroll(
    "scroll-artists-left",
    "scroll-artists-right",
    "artists-carousel"
  );
  addCarouselScroll(
    "scroll-albums-left",
    "scroll-albums-right",
    "albums-carousel"
  );
  addCarouselScroll(
    "scroll-playlists-left",
    "scroll-playlists-right",
    "playlists-carousel"
  );
};

export default MainSection;

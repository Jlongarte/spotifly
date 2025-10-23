import "./Aside.css";

const template = () => {
  return `
  <section class="aside-section">
    <div class="biblioteca">
      <h3>Tu Biblioteca</h3>
      <i></i>
    </div>
    <div class="boxes">
      <div class="box">
        <h4>Crea tu primera lista</h4>
        <p class="small">Es muy fácil, y te echaremos una mano.</p>
        <button class="modal">Crear lista</button>
      </div>
      <div class="box">
        <h4>Encuentra pódcast que quieres seguir</h4>
        <p class="small">Te avisaremos cuando salgan nuevos episodios.</p>
        <button class="modal">Explorar pódcast</button>
      </div>
    </div>

    <nav>
      <ul>
        <li class="modal">Legal</li>
        <li class="modal">Seguridad y privacidad</li>
        <li class="modal">Política de privacidad</li>
        <li class="modal">Configuración de Cookies</li>
        <li class="modal">Información sobre los anuncios</li>
        <li class="modal">Accesibilidad</li>
        <li class="modal">Cookies</li>
      </ul>
    </nav>

    <button class="languages modal">
      <i class="fas fa-globe" style="color:white"></i>Español de España
    </button>

  </section>
  `;
};

const Aside = () => {
  const aside = document.querySelector("aside");
  aside.innerHTML = template();
};

export default Aside;

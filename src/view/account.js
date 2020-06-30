import { emojis } from '../utils/utils.js';

export default (user, page) => {
  const mySelf = `
  <div class="my-self">
    <div class="photos-user">
      <input type="file" accept="image/*" class="upload-img-profile" id="cover" hidden="hidden">
      <i class='bx bxs-camera camera-icon ${page === 'home' ? 'hidden' : ''}' id="update-cover"></i>
      <img loading="lazy" src="" class="user-photo-cover">
      <div id="photo-user-container">
        <img loading="lazy" src=${user.photoURL} class="photo-user">
        <i class='bx bxs-camera camera-icon ${page === 'home' ? 'hidden' : ''}' id="update-profile"></i>
      </div>
    </div>
    <div class="info-user">
      <span class="name-user" id="name-user">${user.displayName}</span>
      <span id="email-user" class="${page === 'home' ? 'hidden' : ''}"><i class="fas fa-envelope"></i>${user.email}</span>
      <p class="info-user-p"></p>
      <button class="btn-n ordinary-btn hidden"id="cancel">Cancelar</button>
      <button class="btn-n ordinary-btn edit-profile ${page === 'home' ? 'hidden' : ''}"id="edit"><i class="far fa-edit"></i>Editar Perfil</button>
    </div>
  </div>`;

  const sectionCreatePost = `
  <section class="create-post-container">
        <span> Crear publicación</span>
        <div class="post-content">
          <div class="flex">
            <img loading="lazy" src="${user.photoURL}" class="post-user-photo" >
            <div class="text-area" id="text-area-post" contenteditable data-placeholder="¿Qué estas pensando?"></div>
            ${emojis('right')}
          </div>
          <div class="photo-container">                      
          </div>
        </div>
        <div class="btn-container">
          <div class="family-btn">
            <div class="btn opts" id="upload-img-btn">
              <input type="file" accept="image/*" id="upload-img" hidden="hidden">
              <i class='bx bxs-image'></i>
              Foto
            </div>
            <div class="dropdown">
            <div class="privacy btn opts" id="public">
              <i class='bx bx-world' ></i>Público 
              <i class='bx bxs-down-arrow' ></i>
            </div>        
            <ul class="dropdown-menu right hidden">
              <li id="public"><i class='bx bx-world' ></i> Público</li>
              <li id="private"><i class='bx bxs-lock-alt' ></i>Privado</li>
            </ul>
          </div> 
          </div>
            <input type="button" value="Publicar" class="btn post-btn">
          </div>
      </section>`;

  const nav = `
  <nav>
    <div class="nav-bar">
      <i class='bx bx-menu menu-icon' ></i>
      <img class="logo" src="./img/eco-trans-white.png" >      
    </div>
    <ul id="menu">          
      <li class="option">
        <a href="#/profile">
          <img src="${user.photoURL}" class="user-photo">
          <span>${user.displayName}</span> 
        </a>
      </li>
      <li class="option"><a href="#/home"><i class='bx bxs-home' ></i>Inicio</a></li>
      <li class="option"><a href="#/login" id="btn-salir"><i class='bx bx-log-out'></i>Salir</a></li>
    </ul>
  </nav>`;

  const divElemt = document.createElement('div');
  divElemt.classList.add('screen');
  divElemt.innerHTML = `
  <header>
   ${nav}
  </header>
    <section class="content">
      <section class="profile-section">
      ${mySelf}
      </section>
      <section class="posts-section">
        ${sectionCreatePost}
        <div class="posts-container">
        </div>
      </section>
    </section>`;

  return divElemt;
};

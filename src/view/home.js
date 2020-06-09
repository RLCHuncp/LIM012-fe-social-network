/* eslint-disable no-console */
// import { auth } from '../firebaseInit.js';
// import { createPost } from '../controller/postController.js';
import { currentUser, signOut } from '../model/user.model.js';

export default () => {
  const user = currentUser();
  const mySelf = `
  <div class="my-self">
    <img src=${user.photo} class="user-photo">
    <span class="name-user">${user.name}</span>
  </div>`;

  const sectionCreatePost = `
  <section class="create-post-container">
    <div class="post-content">
      <textarea id="content-text" class="text-post" name="textarea"  placeholder="¿Qué estas pensando?"></textarea>
      <div class="photo-container">
      </div>
    </div>
    <div class="btn-container">
      <div class="btn" id="upload-img-btn">
        <input type="file" accept="image/*" id="upload-img" hidden="hidden" multiple>
        <i class="fa fa-picture-o" aria-hidden="true"></i>Foto
      </div>
      <div class="select-box">
      <div class="select-button cursor btn">
        <div class="selected-value">
          <i class="fa fa-globe" aria-hidden="true"></i>
        </div>
        <div class="chevrons">
          <i class="fas fa-chevron-down"></i>
        </div>
      </div>
      <div class="options">
        <div class="option"><i class="fa fa-globe" aria-hidden="true"></i> Público</div>
        <div class="option"><i class="fa fa-lock" aria-hidden="true"></i> Privado</div>
      </div>
    </div>
      <div id="btn-create-post" class="btn post-btn">Publicar</div>
    </div>
  </section>`;

  const nav = `
  <nav>
    <div class="nav-bar">
      <i class="fa fa-bars menu-icon" aria-hidden="true"></i>
      <img class="logo" src="./img/eco-trans-white.png" >      
    </div>
    <ul id="menu">          
      <li class="option"><a href="#/home"><i class="fas fa-home"></i>Inicio</a></li>
      <li class="option">
        <a href="#/Profile">
          <img src=${user.photo} class="user-photo">
          <span>${user.name}</span> 
        </a>
      </li>
      <li class="option"><a><i class="fas fa-sign-out-alt" id="btn-salir"></i>Salir</a></li>
    </ul>
  </nav>`;

  const divElemt = document.createElement('div');
  divElemt.classList.add('screen');
  divElemt.innerHTML = `
  <header>
   ${nav}
  </header>

    <section class="content">
      ${mySelf}
      ${sectionCreatePost}
      <section class="posts-container">
      </section>
    </section>
  `;

  // ---show and hide menu option---
  const hideOrShowMenu = () => {
    const menu = divElemt.getElementById('menu');
    const state = menu.style.display;
    menu.style.display = (state === 'block') ? 'none' : 'block';
  };
  const menuBtn = divElemt.querySelector('.menu-icon');
  menuBtn.addEventListener('click', hideOrShowMenu);

  // ---load image---

  const upImgBtn = divElemt.querySelector('#upload-img-btn');
  const upImg = divElemt.querySelector('#upload-img');
  const container = divElemt.querySelector('.photo-container');
  upImgBtn.addEventListener('click', () => {
    upImg.click();
  });
  upImg.addEventListener('change', (event) => {
    const img = document.createElement('img');
    img.classList.add('img-post');
    container.append(img);
    const path = URL.createObjectURL(event.target.files[0]);
    img.setAttribute('src', path);
  });

  // ---create post---
  // const postsContainer = divElemt.querySelector('.posts-container');
  // const createPostBtn = divElemt.querySelector('.post-btn');
  // const textPost = divElemt.querySelector('.text-post');
  // const images = divElemt.querySelectorAll('img.img-post');
  // console.log(images);
  // createPostBtn.addEventListener('click', () => {
  //   const post = createPost(textPost.value, images);
  //   textPost.value = '';
  //   postsContainer.append(post);
  // });

  const btnSalir = divElemt.querySelector('#btn-salir');
  btnSalir.addEventListener('click', signOut);
  return divElemt;
};

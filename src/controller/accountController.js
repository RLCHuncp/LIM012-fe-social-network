/* eslint-disable no-param-reassign */
// import { auth } from 'firebase-admin';
import { views } from '../view/index.js';
import {
  signOut, updateUserBD, getUserBD,
} from '../model/user.model.js';
import { renderPost, setStatePrivacity } from '../view/post.js';

// import { getAllPostsBD } from '../model/post.model.js';
// import { showPostsOnHome, showPostsOnProfile } from '../model/post.model.js';
import { createPost } from './postController.js';
import { emojiEvent, emptyPosts } from '../utils/utils.js';
import { uploadImage } from '../model/storage-post.js';
import { auth, db } from '../firebaseInit.js';

export default (page) => {
  // llama a la BD para mostrar todos los post registrados
  const user = auth.currentUser;

  if (!user) {
    window.location.hash = '#/login';
    return views.signInView();
  }
  const currentView = views.accountView(user, page);

  getUserBD(user.uid)
    .then((doc) => {
      const coverPhoto = currentView.querySelector('.user-photo-cover');
      // console.log(doc.id, doc.data().coverPhoto);
      coverPhoto.src = doc.data().coverPhoto;
    });

  const menuBtn = currentView.querySelector('.menu-icon');

  const uploadImgBtn = currentView.querySelector('#upload-img-btn');
  const uploadImg = currentView.querySelector('#upload-img');
  const imageContainer = currentView.querySelector('.photo-container');
  const divPostsContainer = currentView.querySelector('.posts-container');

  const createPostBtn = currentView.querySelector('.post-btn');

  // btn para desplegar menu
  menuBtn.addEventListener('click', () => {
    const menu = currentView.querySelector('#menu');
    const state = menu.style.display;
    menu.style.display = (state === 'block') ? 'none' : 'block';
  });

  // boton para cargar imagenes para publicar
  uploadImgBtn.addEventListener('click', () => {
    uploadImg.click();
  });
  uploadImg.addEventListener('change', (event) => {
    const img = document.createElement('div');
    img.classList.add('div-img');
    const path = URL.createObjectURL(event.target.files[0]);
    img.innerHTML = `<i class='bx bx-x'></i><img class="img-post" src="${path}">`;
    imageContainer.append(img);
    if (event.target.files[0]) {
      createPostBtn.disabled = false;
      createPostBtn.classList.add('enabled');
    } else {
      createPostBtn.disabled = true;
      createPostBtn.classList.remove('enabled');
    }

    const cross = imageContainer.querySelectorAll('.bx-x');
    cross.forEach((x) => {
      x.addEventListener('click', (e) => {
        const image = e.target.parentNode;
        imageContainer.removeChild(image);
      });
    });
  });


  const btnSalir = currentView.querySelector('#btn-salir');
  btnSalir.addEventListener('click', () => {
    signOut()
      .then(() => {
        window.location.hash = '#/login';
      });
  });

  // evento que escucha al input para ver si hay algo que
  // publicar de ser asi, activa el boton de publicar
  const textArea = currentView.querySelector('#text-area-post');
  textArea.addEventListener('input', (e) => {
    if (e.target.textContent) {
      createPostBtn.classList.add('enabled');
    } else {
      createPostBtn.classList.remove('enabled');
    }
  });

  // evento para el dropdown de privacidad al crear un nuevo post
  const createContainer = currentView.querySelector('.create-post-container');
  const privacyBtn = createContainer.querySelector('.privacy');
  const menu = createContainer.querySelector('ul');
  const options = menu.querySelectorAll('li');

  emojiEvent(createContainer, '#text-area-post', createPostBtn, 'enabled');


  privacyBtn.addEventListener('click', () => {
    menu.classList.toggle('show');
    options.forEach((option) => {
      option.addEventListener('click', () => {
        privacyBtn.innerHTML = setStatePrivacity(option.id);
        privacyBtn.id = option.id;
        menu.classList.toggle('show');
      });
    });
  });

  // boton para hacer una publicacion enviando los datos insertados(imagen o texto)
  createPostBtn.addEventListener('click', () => {
    const photoContainer = currentView.querySelector('.photo-container');
    const images = uploadImg.files;
    const privacity = currentView.querySelector('div.privacy');
    if (textArea.textContent || images.length > 0) {
      createPost(user, textArea.textContent, images, privacity.id);
      textArea.textContent = '';
      privacity.innerHTML = setStatePrivacity('public');
      privacity.id = 'public';
      photoContainer.innerHTML = '';
      uploadImg.value = '';
      createPostBtn.classList.remove('enabled');
    }
  });


  const updateName = (newName) => {
    console.log('se actualizara todos los nombres');
    const allNames = currentView.querySelectorAll('.my-name');
    allNames.forEach((name) => {
      name.textContent = newName;
    });
  };
  const updatePhoto = (newPhoto) => {
    console.log('se actualizara todas las fotos');
    const allPhotos = currentView.querySelectorAll('.my-photo');
    allPhotos.forEach((photo) => {
      photo.textContent = newPhoto;
    });
  };

  if (page === 'profile') {
    const btnEditProfile = currentView.querySelector('.edit-profile');
    const btnCancel = currentView.querySelector('#cancel');
    btnEditProfile.addEventListener('click', (event) => {
      const nameUser = currentView.querySelector('#name-user');
      const name = nameUser.textContent;

      if (event.target.id === 'edit') {
        nameUser.setAttribute('contenteditable', true);
        nameUser.focus();
        event.target.innerHTML = '<i class="far fa-save"></i> Guardar';
        event.target.id = 'save';
        btnCancel.classList.remove('hidden');
        event.target.classList.remove('ordinary-btn');
        event.target.classList.add('main-btn');
        btnCancel.addEventListener('click', () => {
          btnCancel.classList.add('hidden');
          event.target.classList.add('ordinary-btn');
          event.target.classList.remove('main-btn');
          nameUser.setAttribute('contenteditable', false);
          event.target.innerHTML = '<i class="far fa-edit"></i>Editar Perfil';
          event.target.id = 'edit';
          nameUser.textContent = name;
        });
      } else if (event.target.id === 'save') {
        btnCancel.classList.add('hidden');
        event.target.classList.add('ordinary-btn');
        event.target.classList.remove('main-btn');
        nameUser.setAttribute('contenteditable', false);
        event.target.innerHTML = '<i class="far fa-edit"></i>Editar Perfil';
        updateUserBD(auth.currentUser.uid, { userName: nameUser.textContent });
        auth.currentUser.updateProfile({
          displayName: nameUser.textContent,
        });
        event.target.id = 'edit';
        updateName(nameUser.textContent);
      }
    });
  }

  const uploadImgProfile = currentView.querySelector('.upload-img-profile');

  const updatePhotoCover = currentView.querySelector('#update-cover');
  const updatePhotoProfile = currentView.querySelector('#update-profile');

  uploadImgProfile.addEventListener('click', (event) => {
    event.target.addEventListener('change', (e) => {
      uploadImage(e.target.files[0])
        .then((url) => {
          if (event.target.id === 'cover') {
            updateUserBD(user.uid, { coverPhoto: url })
              .then(() => console.log('se actulizo foto de portada'));
            const coverImg = currentView.querySelector('.user-photo-cover');
            coverImg.setAttribute('src', url);
          } else if (event.target.id === 'profile') {
            updateUserBD(user.uid, { userPhoto: url })
              .then(() => console.log('se actulizo foto de perfil'));
            auth.currentUser.updateProfile({ photoURL: url });
            const photoUser = currentView.querySelector('.photo-user');
            photoUser.setAttribute('src', url);
            updatePhoto(url);
          }
        });
    });
  });

  updatePhotoProfile.addEventListener('click', () => {
    uploadImgProfile.id = 'profile';
    uploadImgProfile.click();
  });

  updatePhotoCover.addEventListener('click', () => {
    uploadImgProfile.id = 'cover';
    uploadImgProfile.click();
  });

  const getAllPosts = (which) => {
    if (which === 'home') {
      return db.collection('posts').where('privacity', '==', 'public');
    }
    return db.collection('posts').where('idUser', '==', auth.currentUser.uid);
  };


  window.unsubscribe = getAllPosts(page).orderBy('date', 'asc')
    .onSnapshot((querySnapshot) => {
      divPostsContainer.innerHTML = querySnapshot.size === 0 ? emptyPosts : '';
      querySnapshot.forEach((doc) => {
        // console.log(`${doc.id} => ${doc.data()}`);
        getUserBD(doc.data().idUser)
          .then((userObj) => {
            // console.log('USUARIO: ', userObj.data());
            divPostsContainer.appendChild(renderPost(userObj.data(), doc.data(), doc.id));
          });
      });
    });
  return currentView;
};

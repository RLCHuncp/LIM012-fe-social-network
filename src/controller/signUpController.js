import {
  createUser, sendConfirmationEmail, registerUserBD, coverDefault, profileDefault,
} from '../model/user.model.js';

import { signUpFormValidation, hidePwd, showPwd } from '../utils/utils.js';

import { views } from '../view/index.js';
import { auth } from '../firebaseInit.js';

const eventSignUp = (event) => {
  event.preventDefault();
  const user = {
    name: event.target.name.value,
    email: event.target.email.value,
    password: event.target.password.value,
  };
  createUser(user)
    .then(() => {
      const userObj = {
        coverPhoto: coverDefault,
        userPhoto: profileDefault,
        userName: auth.currentUser.displayName,
        aboutMe: '',
      };
      registerUserBD(auth.currentUser.uid, userObj);
      sendConfirmationEmail();
      window.location.hash = '#/email';
      event.target.reset();
    })
    .catch((err) => {
      signUpFormValidation(err.code);
    });
};


export default () => {
  const currentView = views.signUpView();

  const signUpForm = currentView.querySelector('#sign-up-form');
  signUpForm.addEventListener('submit', (event) => {
    eventSignUp(event);
  });

  const hidePassword = currentView.querySelector('#hide-password');
  hidePassword.addEventListener('click', hidePwd);

  const showPassword = currentView.querySelector('#show-password');
  showPassword.addEventListener('click', showPwd);

  return currentView;
};

import './firebase';
import {
  signInUser,
  createUser,
  signInWithGoogle,
  signInWithFacebook,
  sendConfirmationEmail,
  signOut,
} from '../src/model/user.model.js';


describe('Function signInUser()', () => {
  it('Deberia iniciar sesión', () => signInUser('lala06@gmail.com', '123456')
    .then((user) => {
      expect(user.isAnonymous).toBe(false);
    }));
});

describe('Function createUser()', () => {
  it('Debería enviar una mensaje de verificación al usuario que se ha registrado', () => {
    createUser('lucy@gmail.com', '123456')
      .then(() => {
        expect(sendConfirmationEmail).toBe('REGISTRADO EXITOSAMENTE');
      });
  });
});

describe('Function signInWithGoogle', () => {
  it('Debería iniciar sesión con google', () => signInWithGoogle()
    .then((user) => {
      expect(user.isAnonymous).toBe(false);
    }));
});
describe('Function signInWithFacebook', () => {
  it('Debería iniciar sesión con facebook', () => signInWithFacebook()
    .then((user) => {
      expect(user.isAnonymous).toBe(false);
    }));
});
describe('Function signOut', () => {
<<<<<<< HEAD
  it('Debería iniciar sesión con facebook', () => signOut()
    .then((result) => {
      console.log(result);
      expect(result).toBe(true);
    }).catch((err) => {
      throw err;
=======
  it('LogOut ', () => signOut()
    .then((result) => {
      expect(result).toBe(true);
>>>>>>> 5d11606fc59886003d5252a89107d64b4e87286b
    }));
});

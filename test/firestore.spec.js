/* eslint-disable import/first */
/* eslint-disable no-console */
import './firebase';
import MockFirebase from 'mock-cloud-firestore';

import { registerUserBD, updateUserBD } from '../src/model/user.model.js';

import {
  addCommentBD, deleteCommentBD,
  createPostBD, updatePostBD, deletePostBD, getDocs, getPostBD,
} from '../src/model/post.model.js';

const fixtureData = {
  __collection__: {
    comments: {
      __doc__: {
        comment1: {
          textContent: 'holiholiholi',
          postId: 'post_1',
          userId: 'user_1',
        },
        comment2: {
          textContent: 'holiholiholi',
          postId: 'post_1',
          userId: 'user_1',
        },
        comment3: {
          textContent: 'holiholiholi',
          postId: 'post_1',
          userId: 'user_1',
        },
      },
    },
    // users: {
    //   __doc__: {
    //     user_1: {
    //       coverPhoto: '',
    //       aboutMe: '',
    //     },
    //     user_2: {
    //       coverPhoto: '',
    //       aboutMe: '',
    //     },
    //     user_3: {
    //       coverPhoto: '',
    //       aboutMe: '',
    //     },
    //   },
    // },
    // posts: {
    //   __doc__: {
    //     post_1: {
    //       idUser: 'user_1',
    //       textContent: 'primer post user_a',
    //       imageContent: '',
    //       privacity: 'public',
    //       likes: ['user_1', 'user_2'],
    //       date: '20/05/20',
    //     },
    //     post_2: {
    //       idUser: 'user_2',
    //       textContent: 'segundo post user_a',
    //       imageContent: '',
    //       privacity: 'private',
    //       likes: ['user_1', 'user_2', 'user_3'],
    //       date: '25/05/20',
    //     },
    //     post_3: {
    //       idUser: 'user_1',
    //       textContent: 'Hello Workd',
    //       imageContent: '',
    //       privacity: 'public',
    //       likes: ['user_1', 'user_2', 'user_3'],
    //       date: '25/05/20',
    //     },
    //   },
    // },
  },
};


global.firebase = new MockFirebase(fixtureData, { isNaiveSnapshotListenerEnabled: true });

describe('Function CRUD Comments', () => {
  it('Should add a comment in Firestore DB collection', done => addCommentBD({ textContent: 'hola mundo', postId: 'post1' })
    .then(() => {
      const callback = (docs) => {
        console.log('los docs son => ', docs);
        const result = docs.find(comment => comment.textContent === 'hola mundo');
        console.log('resultado es:', result);
        expect(result.textContent).toBe('hola mundo');
        done();
      };
      getDocs(callback, 'comments');
    }));
  it('Should delete a comment from Firestore DB collection', done => deleteCommentBD('comment1')
    .then(() => {
      const callback = (docs) => {
        console.log('docs es  => ', docs);
        const result = docs.find(comment => comment.id === 'comment1');
        expect(result).toBeUndefined();
        done();
      };
      getDocs(callback, 'comments');
    }));

  // it('Should edit a comment in Firestore DB collection',
  //   done => editCommentBD('comment_1', { textContent: 'manzana' })
  //     .then(() => getDocs((data) => {
  //       const result = data.find(comment => comment.id === 'comment_1');
  //       // console.log('edit comment=> ', result);
  //       expect(result.textContent).toBe('manzana');
  //       done();
  //     }, 'comments')));
});


// POSTS
describe('addPostBD', () => {
  it('Should create a post in Firestore DB collection, and check it has been correctly linked to a given user',
    () => {
      const obj = {
        idUser: 'user_1',
        textContent: 'primer post user_a',
        imageContent: '',
        privacity: 'public',
        likes: ['user_1', 'user_2'],
      };
      createPostBD(obj)
        .then(() => getDocs((data) => {
          const result = data.find(post => (post.textContent === 'primer post user_a' && post.idUser === 'user_1'));
          // console.log('result add post => ', result);
          expect(result).toMatchObject({ textContent: 'primer post user_a', userId: 'user_1' });
        }, 'posts'));
    });
});

describe('updatePostBD', () => {
  it('Should update a post in Firestore DB collection',
    () => {
      const obj = {
        textContent: 'primer post user_a',
        imageContent: '',
        privacity: 'public',
      };
      updatePostBD('post_2', obj)
        .then(() => getDocs((data) => {
          const result = data.find(post => (post.id === 'post_2'));
          // console.log('result edit post => ', result);
          expect(result).toMatchObject(obj);
        }, 'posts'));
    });
});
describe('deletePostBD', () => {
  it('Should delete a post in Firestore DB collection',
    () => {
      deletePostBD('post_2')
        .then(() => getDocs((data) => {
          // console.log('data =>', data);
          const result = data.find(post => (post.id === 'post_1'));
          // console.log('result delete post => ', result);
          expect(result).toBeUndefined();
        }, 'posts'));
    });
});
describe('Update likes in a post', () => {
  it('Should return a specific post ',
    () => {
      getPostBD('post_3')
        .then(() => getDocs((data) => {
          // console.log('data =>', data);
          const result = data.find(post => (post.id === 'post_3'));
          // console.log('result delete post => ', result);
          expect(result).toMatchObject({ id: 'post_3' });
        }, 'posts'));
    });
});

// USERS

describe('Function to create and update on user collection', () => {
  it('Should register data of a new user in Firestore DB', () => registerUserBD('user_1', { coverPhoto: '/img/photo.jpg', aboutMe: '' })
    .then(() => getDocs((data) => {
      const result = data.find(user => user.id === 'user_1');
      expect(result).toMatchObject({ id: 'user_1' });
    }, 'users')));
  it('Should update cover photo of a user in Firestore DB', () => updateUserBD('user_1', { coverPhoto: '/img/photo2.jpg' })
    .then(() => getDocs((data) => {
      const result = data.find(user => user.id === 'user_1');
      expect(result).toMatchObject({ id: 'user_1', coverPhoto: '/img/photo2.jpg' });
    }, 'users')));
});

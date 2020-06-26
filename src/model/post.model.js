/* eslint-disable no-console */
import { db } from '../firebaseInit.js';

// POSTS
export const getDocs = (callback, collection) => db.collection(collection)
  .onSnapshot((querySnapshot) => {
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    callback(data);
  });

export const createPostBD = postObj => db.collection('posts').add(postObj);

export const deletePostBD = id => db.collection('posts').doc(id).delete();

export const getPostBD = id => db.collection('posts').doc(id).get();

export const updatePostBD = (id, data) => db.collection('posts').doc(id).update(data);

export const createlikeBD = (postId, likes) => db.collection('posts').doc(postId).update({ likes });

// COMMENTS

export const addCommentBD = commentObj => db.collection('comments').add(commentObj);

export const editCommentBD = (id, data) => db.collection('comments').doc(id).update(data);

export const deleteCommentBD = id => db.collection('comments').doc(id).delete();

export const getAllCommentsBD = postId => db.collection('comments').where('postId', '==', postId).orderBy('date', 'desc');

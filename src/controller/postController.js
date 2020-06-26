import {
  addCommentBD,
  createPostBD,
} from '../model/post.model.js';
import { uploadImage } from '../model/storage-post.js';

export const createCommentObj = (text, user, postId) => {
  const commentObj = {
    textContent: text,
    userId: user.uid,
    date: firebase.firestore.FieldValue.serverTimestamp(),
    postId,
  };
  addCommentBD(commentObj);
};

export const createPost = (user, text, images, statePrivacity) => {
  const postObj = {
    textContent: text,
    imageContent: '',
    likes: [],
    privacity: statePrivacity,
    date: firebase.firestore.FieldValue.serverTimestamp(),
    idUser: user.uid,
  };
  if (images[0]) {
    uploadImage(images[0])
      .then((url) => {
        postObj.imageContent = url;
        createPostBD(postObj);
      });
  } else {
    createPostBD(postObj);
  }
};

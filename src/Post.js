import React, { useEffect, useState } from 'react';
import './Post.css';
import Avatar from '@material-ui/core/Avatar';
import { Button, Input } from '@material-ui/core';
import { db } from './firebase';
import firebase from 'firebase';

function Post(props) {
  const { postId, username, caption, imageUrl, user } = props;
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection('posts')
        .doc(postId)
        .collection('comments')
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postCommentHandler = async (e) => {
    e.preventDefault();
    try {
      await db.collection('posts').doc(postId).collection('comments').add({
        text: comment,
        username: user.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
      setComment('');
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  console.log(
    `comments >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`,
    comments
  );

  let commentBtnClass = comment
    ? 'post__buttonLabel--active'
    : 'post__buttonLabel';

  return (
    <div className="post">
      <div className="post__header">
        <Avatar
          src="https://upload.wikimedia.org/wikipedia/commons/2/2e/Prime_Minister%2C_Shri_Narendra_Modi%2C_in_New_Delhi_on_August_08%2C_2019_%28cropped%29.jpg"
          alt="Shashank"
          className="post__avatar"
        />
        <h3>{username}</h3>
      </div>
      <img src={imageUrl} alt="" className="post__image" />
      <h4 className="app__text">
        <strong>{username} </strong>
        {caption}
      </h4>
      <div className="post__comments">
        {comments.map((comment) => (
          <p>
            <strong>{comment.username}</strong> {comment.text}
          </p>
        ))}
      </div>
      {user && (
        <form className="post__commentBox">
          <Input
            type="text"
            placeholder="Enter a comment ..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="post__input"
            disableUnderline={true}
          />
          <Button
            type="submit"
            onClick={postCommentHandler}
            className="post__button"
            classes={{ root: 'post__button', label: commentBtnClass }}
            size="small"
            variant="text"
            children="Post"
          />
        </form>
      )}
    </div>
  );
}

export default Post;

import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import { storage, db } from './firebase';
import firebase from 'firebase';
import './ImageUpload.css';
import { Input } from '@material-ui/core';

function ImageUpload({ username }) {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState('');
  const [progress, setProgress] = useState(0);

  const fileSelectHandler = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const uploadhandler = (e) => {
    e.preventDefault();

    const uploadTask = storage.ref(`images/${image.name}`).put(image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error);
        alert(error.message);
      },
      async () => {
        const imageUrl = await storage
          .ref('images')
          .child(image.name)
          .getDownloadURL();

        await db.collection('posts').add({
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          caption,
          imageUrl,
          username,
        });

        window.scrollTo(0, 0);

        setProgress(0);
        setCaption('');
        setImage(null);
      }
    );
  };

  return (
    <div className="imageUpload">
      <progress value={progress} max="100" className="imageUpload__progress" />
      <Input
        type="text"
        placeholder="Enter caption"
        onChange={(e) => setCaption(e.target.value)}
        value={caption}
        multiline={true}
        rows={2}
      />
      <Input type="file" onChange={fileSelectHandler} />
      <Button
        type="submit"
        onClick={uploadhandler}
        color="primary"
        variant="contained"
        disabled={!(image && caption)}
      >
        Upload
      </Button>
    </div>
  );
}

export default ImageUpload;

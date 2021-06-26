import { Fragment, useEffect, useState } from 'react';
import './App.css';
import Post from './Post';
import { auth, db } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input, Avatar, TextField } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';
import HeaderIcons from './HeaderIcons';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const [posts, setPosts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState('');

  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);
        if (authUser.displayName) {
        } else {
          return authUser.updateProfile({
            displayName: username,
          });
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    const unsubscribe = db
      .collection('posts')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        // console.log(snapshot.docs);
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });

    return () => {
      unsubscribe();
    };
  }, []);

  console.log(`posts >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`, posts);

  const signUphandler = async (event) => {
    event.preventDefault();
    try {
      const response = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      await response.user.updateProfile({ displayName: username });
      setModalOpen(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const signInHandler = async (event) => {
    event.preventDefault();
    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      alert(error.message);
    }
    setSignInModalOpen(false);
  };

  return (
    <div className="App">
      <div className="app__headerContainer">
        <div className="app__header">
          <img
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
            className="app__headerImage"
            alt="instagram Logo"
          />
          <input
            type="text"
            placeholder="Search"
            className="app__headerInput"
          />
          <div className="app__loginContainer">
            {user ? (
              <HeaderIcons />
            ) : (
              <Fragment>
                <Button onClick={() => setSignInModalOpen(true)}>
                  Sign In
                </Button>
                <Button onClick={() => setModalOpen(true)}>Sign Up</Button>
              </Fragment>
            )}
          </div>
        </div>
      </div>
      <div className="app__content">
        <div className="app__avatars">
          <div className="app__avatarHolder">
            <Avatar
              src="https://upload.wikimedia.org/wikipedia/commons/8/84/Sylvester_Stallone_Cannes_2019.jpg"
              alt="Shashank"
              className="app__avatar"
            />
          </div>
          <div className="app__avatarHolder">
            <Avatar
              src="https://upload.wikimedia.org/wikipedia/commons/2/2e/Prime_Minister%2C_Shri_Narendra_Modi%2C_in_New_Delhi_on_August_08%2C_2019_%28cropped%29.jpg"
              alt="Shashank"
              className="app__avatar"
            />
          </div>
          <div className="app__avatarHolder">
            <Avatar
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbx0m6SIQbvAOAQ8xLehBqURDTv7vHP16taA&usqp=CAU"
              alt="Shashank"
              className="app__avatar"
            />
          </div>
          <div className="app__avatarHolder">
            <Avatar
              src="https://pyxis.nymag.com/v1/imgs/ad7/13f/562d7ca861ae1b9e0197af941133ed5360-22-jean-claude-van-damme.jpg"
              alt="Shashank"
              className="app__avatar"
            />
          </div>
        </div>
        <div className="app__posts">
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
              user={user}
            />
          ))}
          {/* <InstagramEmbed
            url="https://www.instagram.com/shashankgva/"
            clientAccessToken="266325231548072|bfbe764670f94663a017cd2fff3e2a81"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          /> */}
        </div>
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
              className="app__headerImage"
              alt="instagram Logo"
            />
          </center>
          <form className="app__signup">
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={signUphandler}>Sign Up</Button>
          </form>
        </div>
      </Modal>
      <Modal open={signInModalOpen} onClose={() => setSignInModalOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
              className="app__headerImage"
              alt="instagram Logo"
            />
          </center>
          <form className="app__signup">
            <Input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={signInHandler}>Sign In</Button>
          </form>
        </div>
      </Modal>
      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3 style={{ textAlign: 'center' }}>Login to upload</h3>
      )}
    </div>
  );
}

export default App;

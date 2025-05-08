import React, { useContext, useEffect, useState } from 'react';
import './ProfileUpdate.css';
import assets from '../../assets/assets';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';

const ProfileUpdate = () => {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [uid, setUid] = useState("");
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState("");
  const { setUserData } = useContext(AppContext);

  const profileUpdate = async (event) => {
    event.preventDefault();
    try {
      const docRef = doc(db, "users", uid);
      await updateDoc(docRef, {
        bio,
        name
      });

      const snap = await getDoc(docRef);
      setUserData(snap.data());
      navigate('/chat');
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        if (data.name) setName(data.name);
        if (data.bio) setBio(data.bio);
        if (data.avatar) setAvatar(data.avatar);
      } else {
        navigate("/");
      }
    });
  }, []);

  return (
    <div className='profile'>
      <div className="profile-container">
        <form onSubmit={profileUpdate}>
          <h3>Profile details</h3>
          <img
            className='profile-pic'
            src={avatar || assets.logo_icon}
            alt="profile"
          />
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder='Your name'
            type="text"
            required
          />
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            placeholder='Write profile bio'
            required
          />
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
};

export default ProfileUpdate;

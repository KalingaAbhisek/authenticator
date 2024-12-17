/*global chrome*/
import React, { useState, useEffect, useRef } from 'react';
import SignInLogo from '../../assets/SignInWithGoogle.svg';
import { useNavigate } from 'react-router-dom';
import { setDoc, doc, db } from '../../firebaseConfig';
import Spinner from '../Spinner/Spinner';
import './SignUp.css';

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const userRef = useRef(null); 
  const accessTokenRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    chrome.storage.local.get(["accessToken", "userInfo"], (result) => {
      if (result.accessToken && result.userInfo) {
        accessTokenRef.current = result.accessToken;
        userRef.current = result.userInfo;
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    });
  }, [navigate]);

  const handleSignIn = async () => {
    setIsLoading(true);
    chrome.runtime.sendMessage({ type: "SIGN_IN" }, async (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error:", chrome.runtime.lastError.message);
      } else if (response && response.success) {
        userRef.current = response.userInfo;
        accessTokenRef.current = response.accessToken;

        chrome.storage.local.set({
          accessToken: accessTokenRef.current,
          userInfo: userRef.current
        });

        try {
          await setDoc(doc(db, "users", userRef.current.id), {
            displayName: userRef.current.name,
            email: userRef.current.email,
            createdAt: new Date(),
          });
          navigate('/dashboard', { replace: true });
        } catch (error) {
          console.error("Error writing to Firestore:", error);
        }
      }
      setIsLoading(false);
    });
  };

  return (
    <div className='body-signup'>
      {!isLoading ? (
        <button
          onClick={handleSignIn}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
          }}
        >
          <img 
            src={SignInLogo} 
            alt="Sign in with Google" 
            style={{ width: '150px', height: '150px', marginRight: '10px' }} 
          />
        </button>
      ) : (
        <Spinner /> 
      )}
    </div>
  );
};

export default SignUp;

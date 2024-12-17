/*global chrome*/
import React, { useState, useEffect,useRef } from 'react';
import DraggableScreenshot from './DraggableScreenshot';
import './Dashboard.css';
import { auth, provider, signInWithPopup, signOut,onAuthStateChanged } from '../../firebaseConfig';
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';
import Scanner from '../../assets/scanner.png'
import Signout from '../../assets/out.png'
import Pin from '../../assets/pin.png'
import QRScanner from './QRScanner';
import ScreenshotCapture from './ScreenshotCapture';

const Dashboard = () => {
  const [callQRScanner, setCallQRScanner] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const navigate = useNavigate();
    const [otps, setOtps] = useState([]);
    const [newOtp, setNewOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const userRef = useRef(null); 
    const accessTokenRef = useRef(null);
    const [userName, setUserName] = useState('');

     // Screenshot state
  const [screenshotUrl, setScreenshotUrl] = useState(null);
  const [selection, setSelection] = useState(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
    useEffect(() => {
      chrome.storage.local.get(["accessToken", "userInfo"], (result) => {
        if (result.accessToken && result.userInfo) {
          setUserName(result.userInfo.name);
          accessTokenRef.current = result.accessToken;
          userRef.current = result.userInfo;
        } else {
          navigate('/', { replace: true });
        }
      });
      }, [navigate]);
    const handleLogout = () => {
      chrome.storage.local.remove(["accessToken","userInfo"], () => {
        navigate('/', { replace: true });
      });
    };
      const fetchOTPs = async (userId) => {
        const db = getFirestore();
        const otpCollection = collection(db, "users", userId, "otps");
        const otpSnapshot = await getDocs(otpCollection);
        const otpList = otpSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOtps(otpList);
      };


  const addOTP = async () => {
    // const db = getFirestore();
    // const userId = user.uid;
    // const otpRef = await addDoc(collection(db, "users", userId, "otps"), {
    //   otp: newOtp,
    //   createdAt: new Date(),
    //   name: "Unnamed OTP"
    // });
    // setOtps([...otps, { id: otpRef.id, otp: newOtp, name: "Unnamed OTP" }]);
  };

  const editOTP = async (otpId, newName) => {
    // const db = getFirestore();
    // const userId = user.uid;
    // const otpRef = doc(db, "users", userId, "otps", otpId);
    // await updateDoc(otpRef, { name: newName });
    // // Update state locally after Firestore change
    // setOtps(otps.map(o => o.id === otpId ? { ...o, name: newName } : o));
  };
      const handleClick = ()=>{
        setCallQRScanner(true);
      }
      const handleScreenshot = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.runtime.sendMessage({
            action: "executeContentScript",
            tabId: tabs[0].id
          });
        });
      };

  // const addAccount = () => {
  //   const newAccount = `Account ${accounts.length + 1}`;
  //   setAccounts([...accounts, newAccount]);
  // };
  

  return (
    <div className="authenticator-container">
      <div className="authenticator-header">
        <span className="settings-icon">⚙️</span>
        <span className="settings-icon"></span>
        <h3>Authenticator</h3>
        <img className="scanner-icon" src={Scanner} onClick={handleScreenshot} alt="Scanner" />
        {/* {showOverlay && imageUrl && (
        <ScreenshotCapture
          screenshotUrl={imageUrl}
          onSelect={(rect) => {
            handleSelect(rect);
            setShowOverlay(false);
          }}
        />
      )} */}
        {/* {screenshotUrl && (
        <div>
          <p>Select an area to capture:</p>
          <img
            src={screenshotUrl}
            alt="screenshot"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{ width: '100%', cursor: 'crosshair' }}
          />
          <canvas ref={canvasRef} width={300} height={200} style={{ border: "1px solid black" }} />
        </div>
      )} */}
        {/* <QRScanner props={callQRScanner} /> */}
        <span className="edit-icon">✏️</span>
        <img className="scanner-icon" src={Signout} onClick={handleLogout} alt="Signout" />
      </div>
      {(<div className="authenticator-body">
        {accounts.length === 0 ? (
          <div className="no-accounts">
            <h3>Welcome, {userName}</h3>
            <div className="key-icon">🔑</div>
            <br />
            <p>No accounts to display. Add your first account now. <a href="#" className="learn-more-link">Learn more</a></p>
            <div>
            <p>Scan this QR code</p>
            <img src={Pin} style={{ width: '150px', height: '150px', marginRight: '10px' }} />
            </div>
          </div>
        ) : (
          <ul className="account-list">
            {accounts.map((account, index) => (
              <li key={index}>{account}</li>
            ))}
          </ul>
        )}
      </div>)}
    </div>
  );
};

export default Dashboard;

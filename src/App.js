import './App.css';
import {Routes,Route,useLocation,Navigate} from 'react-router-dom'
import { useEffect, useState } from 'react';
import { auth, provider, signInWithPopup, signOut,onAuthStateChanged } from './firebaseConfig';
import SignUp from './components/SignUp/SignUp';
import Dashboard from './components/Dashboard/Dashboard';
import Spinner from './components/Spinner/Spinner';
import QRScanner from './components/Dashboard/QRScanner';
import Signout from './components/SignUp/Signout';

function App() {
  const [user, setUser] = useState(null)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); 
      } else {
        setUser(null); 
      }
    });

    return () => unsubscribe(); 
  }, []);

  return (
    <Routes>
      <Route exact path="/" element={<SignUp/>} />
      <Route exact path="/dashboard" element={<Dashboard />} />
      <Route exact path="/screenqr" element={<QRScanner />} />
      <Route exact path="/logout" element={<Signout />} />
      <Route path="*" element={<Navigate to='/'/>} />
    </Routes>
  );
}

export default App;


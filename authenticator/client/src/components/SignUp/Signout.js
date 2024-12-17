import React, { useState, useEffect }  from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged, auth } from '../../firebaseConfig';
const Signout = () => {
    const [initialLoad, setInitialLoad] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          setInitialLoad(false);
          if (!currentUser) {
            navigate('/', { replace: true });
          }
          else{
            signOut(auth).then(() => {
                setUser(null);
                console.log("User signed out");
                sessionStorage.clear();
            }).catch((error) => {
                console.error("Error signing out: ", error);
            });
          }
        });
    
        return () => unsubscribe();
      }, [user,navigate]);

    //   const signOut = ()=>{
    //     signOut(auth).then(() => {
    //         setUser(null);
    //         console.log("User signed out");
    //       }).catch((error) => {
    //         console.error("Error signing out: ", error);
    //       });
    //   }
  return (
    <></>
  )
}

export default Signout
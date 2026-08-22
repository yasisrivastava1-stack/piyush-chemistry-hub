import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export type UserRole = 'admin' | 'student';

interface UserData {
  role: UserRole;
  displayName: string | null;
  email: string | null;
  createdAt: any;
  status: 'active' | 'blocked';
  lastLogin: any;
  phone?: string;
  studentClass?: string;
  board?: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        // Check if user exists in DB
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        let data: UserData;
        const adminUids = ['xsFI63Hy5jUkwFtQnjqThM9ZwGx1', 'cxsFI63Hy5jU', 'GOv6NaBAVJOFNUIgFRSc7FXmf7v1'];
        const isHardcodedAdmin = firebaseUser.email === 'yasisrivastava1@gmail.com' || adminUids.includes(firebaseUser.uid);

        if (userSnap.exists()) {
          data = userSnap.data() as UserData;
          
          // Force upgrade if they were registered as a student before we added their UID
          if (isHardcodedAdmin && data.role !== 'admin') {
            data.role = 'admin';
            await setDoc(userRef, { role: 'admin' }, { merge: true });
          }
          
          // Update last login
          await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
        } else {
          // Determine initial role
          const role: UserRole = isHardcodedAdmin ? 'admin' : 'student';

          
          data = {
            role,
            displayName: firebaseUser.displayName || 'New User',
            email: firebaseUser.email,
            createdAt: serverTimestamp(),
            status: 'active',
            lastLogin: serverTimestamp(),
          };
          
          await setDoc(userRef, data);
        }
        setUserData(data);
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

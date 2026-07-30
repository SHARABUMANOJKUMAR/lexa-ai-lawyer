import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { 
  User,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, phone?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  setupRecaptcha: (containerId: string) => void;
  requestOTP: (phoneNumber: string) => Promise<{ error: Error | null, confirmationResult?: ConfirmationResult }>;
  verifyOTP: (confirmationResult: ConfirmationResult, otp: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyBkINBQjKqveOja1EF_aone3m0gPHfbAMH90g_GAaPb0qTGXlIBQt7rA0qpV93ibIL/exec';

const syncUserToAppsScript = async (userData: any) => {
  try {
    fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    }).catch(console.error);
  } catch (err) {
    console.error('Failed to sync user to Apps Script:', err);
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const saveUserToFirestore = async (firebaseUser: User, extraData: any = {}) => {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userSnap = await getDoc(userRef);

    const userData = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      phone: firebaseUser.phoneNumber || extraData.phone || '',
      provider: firebaseUser.providerData[0]?.providerId || 'email',
      photoURL: firebaseUser.photoURL || '',
      emailVerified: firebaseUser.emailVerified,
      lastLogin: serverTimestamp(),
      status: 'active',
    };

    if (!userSnap.exists()) {
      // New user
      const newUserData = {
        ...userData,
        fullName: firebaseUser.displayName || extraData.fullName || '',
        createdAt: serverTimestamp(),
        role: 'user',
        isActive: true,
      };
      await setDoc(userRef, newUserData);
      syncUserToAppsScript(newUserData);
    } else {
      // Existing user
      await setDoc(userRef, userData, { merge: true });
    }
  };

  const signUp = async (email: string, password: string, fullName: string, phone?: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await saveUserToFirestore(userCredential.user, { fullName, phone });
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await saveUserToFirestore(userCredential.user);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      await saveUserToFirestore(userCredential.user);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const setupRecaptcha = (containerId: string) => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible'
      });
    }
  };

  const requestOTP = async (phoneNumber: string) => {
    try {
      const appVerifier = (window as any).recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      return { error: null, confirmationResult };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const verifyOTP = async (confirmationResult: ConfirmationResult, otp: string) => {
    try {
      const userCredential = await confirmationResult.confirm(otp);
      await saveUserToFirestore(userCredential.user);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signUp, 
      signIn, 
      signOut,
      signInWithGoogle,
      setupRecaptcha,
      requestOTP,
      verifyOTP
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

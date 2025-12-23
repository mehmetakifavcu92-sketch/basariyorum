'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export type UserRole = 'admin' | 'teacher' | 'student';

export interface AuthUser {
  uid: string;
  email: string | null;
  role: UserRole;
  institutionId?: string;
  name?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  firebaseUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole, institutionId?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        // Firestore'dan kullanıcı bilgilerini al
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              role: userData.role || 'student',
              institutionId: userData.institutionId,
              name: userData.name,
            });
          } else {
            // Eğer Firestore'da kayıt yoksa, varsayılan olarak student rolü ver
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              role: 'student',
            });
          }
        } catch (error) {
          console.error('Kullanıcı bilgileri alınamadı:', error);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            role: 'student',
          });
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string, name: string, role: UserRole, institutionId?: string) => {
    try {
      // Önce Firebase Authentication'a kaydet
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Kullanıcı authenticated olduktan sonra Firestore'a kaydet
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: email,
        name: name,
        role: role,
        institutionId: institutionId || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error: any) {
      console.error('Kayıt hatası:', error);
      
      // Eğer Firestore hatası varsa, kullanıcıyı sil (rollback)
      if (error.code === 'permission-denied' || error.message?.includes('permission')) {
        // Kullanıcı oluşturulduysa sil
        if (auth.currentUser) {
          try {
            await auth.currentUser.delete();
          } catch (deleteError) {
            console.error('Kullanıcı silinemedi:', deleteError);
          }
        }
        throw new Error('Firestore yazma izni yok. Lütfen Firebase Console\'da güvenlik kurallarını kontrol edin.');
      }
      
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}


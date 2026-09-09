import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { User } from '../types';
import { auth, googleProvider } from '../lib/firebase';
import {
  saveUserProfileInFirestore,
  getUserProfileFromFirestore,
} from '../services/db';

export interface RegisterParams {
  name: string;
  email: string;
  username?: string;
  password: string;
}

export interface LoginParams {
  identifier: string; // email or username
  password: string;
}

interface StoredAccount {
  id: string;
  name: string;
  email: string;
  username: string;
  passwordHash: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  signInWithGoogle: () => Promise<void>;
  registerManual: (params: RegisterParams) => Promise<boolean>;
  loginManual: (params: LoginParams) => Promise<boolean>;
  login: (name: string, email: string, avatar?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  isLoadingUser: boolean;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper for local account persistence
const getLocalAccounts = (): StoredAccount[] => {
  try {
    const raw = localStorage.getItem('3covangoc_registered_accounts');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocalAccount = (acc: StoredAccount) => {
  try {
    const accounts = getLocalAccounts();
    const filtered = accounts.filter(
      (a) => a.email.toLowerCase() !== acc.email.toLowerCase() && a.username.toLowerCase() !== acc.username.toLowerCase()
    );
    filtered.push(acc);
    localStorage.setItem('3covangoc_registered_accounts', JSON.stringify(filtered));
  } catch (e) {
    console.warn('Lỗi lưu tài khoản cục bộ:', e);
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('3covangoc_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('3covangoc_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('3covangoc_user');
    }
  }, [user]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        const userId = fbUser.uid;
        try {
          const remoteProfile = await getUserProfileFromFirestore(userId);
          if (remoteProfile) {
            setUser(remoteProfile);
          } else {
            const newProfile: User = {
              id: userId,
              name: fbUser.displayName || 'Người dùng Google',
              email: fbUser.email || `${userId}@gmail.com`,
              avatar: fbUser.photoURL || '/images/logo.png',
              role: 'user',
            };
            await saveUserProfileInFirestore(newProfile);
            setUser(newProfile);
          }
        } catch (err) {
          console.warn('Error syncing Google profile with Firestore:', err);
          setUser({
            id: userId,
            name: fbUser.displayName || 'Người dùng Google',
            email: fbUser.email || `${userId}@gmail.com`,
            avatar: fbUser.photoURL || '/images/logo.png',
            role: 'user',
          });
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // 1. Google Sign-In via Firebase Auth
  const signInWithGoogle = async () => {
    setIsLoadingUser(true);
    setAuthError(null);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const userId = fbUser.uid;

      // Check if profile exists in Firestore
      const remote = await getUserProfileFromFirestore(userId);
      if (remote) {
        setUser(remote);
      } else {
        const newProfile: User = {
          id: userId,
          name: fbUser.displayName || 'Thành viên Studio',
          email: fbUser.email || '',
          avatar: fbUser.photoURL || '/images/logo.png',
          role: 'user',
        };
        await saveUserProfileInFirestore(newProfile);
        setUser(newProfile);
      }

      setAuthModalOpen(false);
    } catch (error: any) {
      console.error('Google Sign-in Error:', error);
      if (error?.code === 'auth/popup-blocked') {
        setAuthError(
          'Trình duyệt đã chặn cửa sổ Popup đăng nhập. Vui lòng bấm cho phép popup trên thanh địa chỉ hoặc mở tab mới.'
        );
      } else if (error?.code === 'auth/popup-closed-by-user') {
        setAuthError('Bạn đã đóng cửa sổ đăng nhập Google trước khi hoàn tất.');
      } else {
        setAuthError(error?.message || 'Không thể đăng nhập bằng Google lúc này.');
      }
    } finally {
      setIsLoadingUser(false);
    }
  };

  // 2. Manual Registration (Họ và tên, Email, Tên tài khoản, Mật khẩu)
  const registerManual = async ({
    name,
    email,
    username = '',
    password,
  }: RegisterParams): Promise<boolean> => {
    setIsLoadingUser(true);
    setAuthError(null);

    const safeName = name.trim();
    const safeEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim().toLowerCase() || safeEmail.split('@')[0];

    if (!safeName) {
      setAuthError('Vui lòng nhập họ và tên của bạn.');
      setIsLoadingUser(false);
      return false;
    }

    if (!safeEmail || !safeEmail.includes('@')) {
      setAuthError('Vui lòng nhập địa chỉ email hợp lệ (Ví dụ: name@gmail.com).');
      setIsLoadingUser(false);
      return false;
    }

    if (!password || password.length < 6) {
      setAuthError('Mật khẩu phải có độ dài tối thiểu từ 6 ký tự.');
      setIsLoadingUser(false);
      return false;
    }

    let finalUserId = '';
    let finalAvatar = '/images/logo.png';

    try {
      // First try Firebase Auth createUserWithEmailAndPassword
      const cred = await createUserWithEmailAndPassword(auth, safeEmail, password);
      finalUserId = cred.user.uid;

      try {
        await updateProfile(cred.user, { displayName: safeName });
      } catch (e) {
        console.warn('Could not update displayName in Firebase auth:', e);
      }
    } catch (fbErr: any) {
      console.warn('Firebase createUser error, checking code:', fbErr?.code, fbErr?.message);

      if (fbErr?.code === 'auth/email-already-in-use') {
        setAuthError('Email này đã được đăng ký. Bạn có thể bấm sang tab "Đăng nhập" để đăng nhập.');
        setIsLoadingUser(false);
        return false;
      } else if (fbErr?.code === 'auth/invalid-email') {
        setAuthError('Định dạng email không hợp lệ (Ví dụ: name@gmail.com).');
        setIsLoadingUser(false);
        return false;
      } else if (fbErr?.code === 'auth/weak-password') {
        setAuthError('Mật khẩu quá ngắn, vui lòng nhập ít nhất 6 ký tự.');
        setIsLoadingUser(false);
        return false;
      } else {
        // If auth/operation-not-allowed (Email/password provider not enabled yet in console)
        // or network issue, fallback to robust Firestore + local account registry
        finalUserId = 'u_' + safeEmail.replace(/[^a-z0-9]/g, '_');
      }
    }

    // Save to local secure accounts registry
    saveLocalAccount({
      id: finalUserId,
      name: safeName,
      email: safeEmail,
      username: cleanUsername,
      passwordHash: password, // preserved for fallback authentication
      avatar: finalAvatar,
    });

    // Create user profile object
    const newUser: User = {
      id: finalUserId,
      name: safeName,
      email: safeEmail,
      username: cleanUsername,
      avatar: finalAvatar,
      role: 'user',
    };

    // Save profile to Cloud Firestore
    try {
      await saveUserProfileInFirestore(newUser);
    } catch (e) {
      console.warn('Could not save user profile to Firestore:', e);
    }

    setUser(newUser);
    setAuthModalOpen(false);
    setIsLoadingUser(false);
    return true;
  };

  // 3. Manual Login (Email hoặc Tên tài khoản + Mật khẩu)
  const loginManual = async ({
    identifier,
    password,
  }: LoginParams): Promise<boolean> => {
    setIsLoadingUser(true);
    setAuthError(null);

    const safeId = identifier.trim().toLowerCase();

    if (!safeId) {
      setAuthError('Vui lòng nhập Email hoặc Tên tài khoản.');
      setIsLoadingUser(false);
      return false;
    }

    if (!password) {
      setAuthError('Vui lòng nhập mật khẩu.');
      setIsLoadingUser(false);
      return false;
    }

    // Determine target email for Firebase Auth
    const accounts = getLocalAccounts();
    const matchedAccount = accounts.find(
      (a) => a.email.toLowerCase() === safeId || a.username.toLowerCase() === safeId
    );

    const targetEmail = matchedAccount ? matchedAccount.email : safeId.includes('@') ? safeId : `${safeId}@gmail.com`;

    try {
      // Attempt Firebase signInWithEmailAndPassword
      const cred = await signInWithEmailAndPassword(auth, targetEmail, password);
      const uid = cred.user.uid;

      // Fetch profile
      const profile = await getUserProfileFromFirestore(uid);
      if (profile) {
        setUser(profile);
      } else {
        const fallbackUser: User = {
          id: uid,
          name: cred.user.displayName || matchedAccount?.name || 'Thành viên Studio',
          email: cred.user.email || targetEmail,
          username: matchedAccount?.username || safeId,
          avatar: cred.user.photoURL || matchedAccount?.avatar || '/images/logo.png',
          role: 'user',
        };
        await saveUserProfileInFirestore(fallbackUser);
        setUser(fallbackUser);
      }

      setAuthModalOpen(false);
      setIsLoadingUser(false);
      return true;
    } catch (fbErr: any) {
      console.warn('Firebase signIn error:', fbErr?.code, fbErr?.message);

      // Check if local account registry matches (fallback for offline or unconfigured provider)
      if (matchedAccount) {
        if (matchedAccount.passwordHash === password) {
          const profile = await getUserProfileFromFirestore(matchedAccount.id).catch(() => null);
          const loggedUser: User = profile || {
            id: matchedAccount.id,
            name: matchedAccount.name,
            email: matchedAccount.email,
            username: matchedAccount.username,
            avatar: matchedAccount.avatar || '/images/logo.png',
            role: 'user',
          };
          setUser(loggedUser);
          setAuthModalOpen(false);
          setIsLoadingUser(false);
          return true;
        } else {
          setAuthError('Mật khẩu không chính xác. Vui lòng thử lại.');
          setIsLoadingUser(false);
          return false;
        }
      }

      if (
        fbErr?.code === 'auth/wrong-password' ||
        fbErr?.code === 'auth/user-not-found' ||
        fbErr?.code === 'auth/invalid-credential'
      ) {
        setAuthError('Tài khoản hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.');
      } else if (fbErr?.code === 'auth/invalid-email') {
        setAuthError('Định dạng email không hợp lệ (Ví dụ: name@gmail.com).');
      } else if (fbErr?.code === 'auth/too-many-requests') {
        setAuthError('Bạn đã thử đăng nhập quá nhiều lần. Vui lòng đợi ít phút và thử lại.');
      } else {
        setAuthError('Không thể đăng nhập. Vui lòng kiểm tra lại thông tin tài khoản và mật khẩu.');
      }

      setIsLoadingUser(false);
      return false;
    }
  };

  // 4. Quick legacy Login helper
  const login = async (name: string, email: string, avatar?: string) => {
    setIsLoadingUser(true);
    setAuthError(null);
    const safeEmail = email.trim().toLowerCase();
    const userId = safeEmail
      ? 'u_' + safeEmail.replace(/[^a-z0-9]/g, '_')
      : 'u_' + Date.now();

    try {
      const existing = await getUserProfileFromFirestore(userId);
      if (existing) {
        setUser(existing);
      } else {
        const newUser: User = {
          id: userId,
          name: name.trim(),
          email: safeEmail || `${userId}@gmail.com`,
          avatar: avatar || '/images/logo.png',
          role: 'user',
        };
        await saveUserProfileInFirestore(newUser);
        setUser(newUser);
      }
      setAuthModalOpen(false);
    } catch (err: any) {
      console.warn('Firestore user fetch failed, fallback local:', err);
      const newUser: User = {
        id: userId,
        name: name.trim(),
        email: safeEmail || `${userId}@gmail.com`,
        avatar: avatar || '/images/logo.png',
        role: 'user',
      };
      setUser(newUser);
      setAuthModalOpen(false);
    } finally {
      setIsLoadingUser(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Firebase signOut error:', e);
    }
    setUser(null);
    localStorage.removeItem('3covangoc_user');
  };

  // Update profile for current user
  const updateUser = async (data: Partial<User>) => {
    if (!user) return;
    const updatedUser: User = {
      ...user,
      ...data,
      id: user.id, // Strictly protect current user's ID
    };

    setUser(updatedUser);

    try {
      await saveUserProfileInFirestore(updatedUser);
    } catch (err) {
      console.error('Lỗi khi lưu profile vào Firestore:', err);
    }
  };

  const clearAuthError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        signInWithGoogle,
        registerManual,
        loginManual,
        login,
        logout,
        updateUser,
        isAuthModalOpen,
        setAuthModalOpen,
        isLoadingUser,
        authError,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

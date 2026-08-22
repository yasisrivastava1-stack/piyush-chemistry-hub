import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import { Beaker } from 'lucide-react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [studentClass, setStudentClass] = useState('12');
  const [board, setBoard] = useState('CBSE');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, userData } = useAuth();

  // If already logged in, redirect
  React.useEffect(() => {
    if (user && userData) {
      if (userData.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, userData, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Create user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const newUser = userCredential.user;
        
        // Update auth profile
        await updateProfile(newUser, {
          displayName: fullName
        });

        // Save detailed profile to Firestore
        const adminUids = ['xsFI63Hy5jUkwFtQnjqThM9ZwGx1', 'cxsFI63Hy5jU', 'GOv6NaBAVJOFNUIgFRSc7FXmf7v1'];
        const isHardcodedAdmin = newUser.email === 'yasisrivastava1@gmail.com' || adminUids.includes(newUser.uid);
        
        const role: UserRole = isHardcodedAdmin ? 'admin' : 'student';
        
        await setDoc(doc(db, 'users', newUser.uid), {
          role,
          displayName: fullName,
          email: newUser.email,
          phone,
          studentClass,
          board,
          createdAt: serverTimestamp(),
          status: 'active',
          lastLogin: serverTimestamp(),
        });
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if user doc exists, if not, create it
      const userRef = doc(db, 'users', result.user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        const adminUids = ['xsFI63Hy5jUkwFtQnjqThM9ZwGx1', 'cxsFI63Hy5jU', 'GOv6NaBAVJOFNUIgFRSc7FXmf7v1'];
        const isHardcodedAdmin = result.user.email === 'yasisrivastava1@gmail.com' || adminUids.includes(result.user.uid);
        const role: UserRole = isHardcodedAdmin ? 'admin' : 'student';
        
        await setDoc(userRef, {
          role,
          displayName: result.user.displayName || 'Student',
          email: result.user.email,
          createdAt: serverTimestamp(),
          status: 'active',
          lastLogin: serverTimestamp(),
          // Default values for Google Sign-in since we don't have the form data
          studentClass: '12',
          board: 'CBSE',
        });
      }
      
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-xl mb-4 shadow-sm">
          <Beaker className="w-8 h-8 text-white" />
        </div>
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-center text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tighter uppercase leading-none drop-shadow-sm">
            Piyush Chemistry
          </h2>
          <div className="text-center text-lg sm:text-xl font-bold tracking-[0.4em] uppercase text-indigo-400 mt-2">
            Hub
          </div>
        </div>
        <p className="mt-4 text-center text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-100 py-1.5 px-4 rounded-full inline-block mx-auto">
          {isLogin ? 'Sign in to your dashboard' : 'Create a student account'}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-6 px-4 shadow-sm sm:rounded-xl border border-slate-200 sm:px-8">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 p-3 rounded text-center">
              <p className="text-xs font-semibold text-red-600">{error}</p>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Full Name</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="appearance-none block w-full px-3 py-1.5 border border-slate-200 rounded shadow-sm text-xs focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Mobile Number</label>
                  <div className="mt-1">
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="appearance-none block w-full px-3 py-1.5 border border-slate-200 rounded shadow-sm text-xs focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Class</label>
                    <select
                      value={studentClass}
                      onChange={(e) => setStudentClass(e.target.value)}
                      className="appearance-none block w-full px-3 py-1.5 border border-slate-200 rounded shadow-sm text-xs focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="11">Class 11</option>
                      <option value="12">Class 12</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Board</label>
                    <select
                      value={board}
                      onChange={(e) => setBoard(e.target.value)}
                      className="appearance-none block w-full px-3 py-1.5 border border-slate-200 rounded shadow-sm text-xs focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="CBSE">CBSE</option>
                      <option value="ICSE">ICSE</option>
                      <option value="ISC">ISC</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Email address</label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-1.5 border border-slate-200 rounded shadow-sm text-xs focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Password</label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-1.5 border border-slate-200 rounded shadow-sm text-xs focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded shadow-sm text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold">
                <span className="px-2 bg-white text-slate-400">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2 px-4 border border-slate-200 rounded shadow-sm bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.761H12.545z"
                  />
                </svg>
                Google
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-700"
            >
              {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

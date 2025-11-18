import { useState, useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const Login = () => {
  const { signup, login, token } = useContext(AppContext)

  const [state, setState] = useState('Sign Up')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('user')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [formError, setFormError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  // Only redirect if user is already logged in when the component mounts
  // This prevents redirects during the signup/login process
  useEffect(() => {
    const initialRender = sessionStorage.getItem('login_page_visited');
    const justAuthenticated = sessionStorage.getItem('just_authenticated');
    
    // Only redirect on initial render if user is already logged in and not in signup/login process
    if (!initialRender && token && token !== 'false' && !justAuthenticated) {
      const timer = setTimeout(() => {
        window.location.href = '/';
      }, 3000); // Increased timeout to give more time before redirect
      return () => clearTimeout(timer);
    }
    
    // Mark that the login page has been visited in this session
    sessionStorage.setItem('login_page_visited', 'true');
    
    // Clean up the flag when component unmounts
    return () => {
      // Only remove if navigating away normally, not during form submission
      if (!isLoggingIn) {
        sessionStorage.removeItem('login_page_visited');
      }
    };
  }, [token, isLoggingIn])  // Added dependencies to properly react to changes

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    if (isLoggingIn) return
    setFormError('')

    // Basic validation
    if (state === 'Sign Up' && !name.trim()) {
      toast.error('Please enter your name')
      return
    }
    if (!email.trim()) {
      toast.error('Please enter your email')
      return
    }
    if (!password.trim()) {
      toast.error('Please enter your password')
      return
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsLoggingIn(true)

    try {
      if (state === 'Sign Up') {
        const userData = { 
          name: name.trim(), 
          email: email.trim(), 
          phone: '', 
          address: { line1: '', line2: '' }, 
          gender: '', 
          dob: '',
          role: role
        }
        const result = await signup(userData, password.trim())

        if (result.success) {
          toast.success(result.message)
          setIsLoggingIn(false)
          // Set flag to prevent auto-redirect from useEffect
          sessionStorage.setItem('just_authenticated', 'true')
          // Don't redirect automatically after signup
          // Instead, show success message and provide a button to navigate
          setFormError('')
          setState('Account Created')
          // Clear form fields
          setPassword('')
          setEmail('')
          setName('')
        } else {
          const raw = result.message || 'Account creation failed'
          const msg = typeof raw === 'string' ? raw : JSON.stringify(raw)
          const normalized = /exist|already/i.test(msg) ? 'User already exists' : msg
          setFormError(normalized)
          setIsLoggingIn(false)
        }
      } else {
        const result = await login(email.trim(), password.trim())
        if (result.success) {
          toast.success(result.message)
          setIsLoggingIn(false)
          // Set flag to prevent auto-redirect from useEffect
          sessionStorage.setItem('just_authenticated', 'true')
          // Redirect after login with a shorter delay
          setTimeout(() => { 
            sessionStorage.removeItem('just_authenticated')
            sessionStorage.removeItem('login_page_visited')
            window.location.href = '/' 
          }, 2000)
        } else {
          setFormError(result.message || 'Login failed')
          setIsLoggingIn(false)
        }
      }
    } catch (error) {
      const errMsg = error?.response?.data?.message || error?.message || 'Authentication failed. Please try again.'
      const finalErr = typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg)
      const normalized = /exist|already/i.test(finalErr) ? 'User already exists' : finalErr
      setFormError(normalized)
      setIsLoggingIn(false)
    }
  }

  // persist remembered email
  useEffect(() => {
    const saved = localStorage.getItem('remember_email')
    if (saved) setEmail(saved)
  }, [])

  useEffect(() => {
    if (rememberMe) localStorage.setItem('remember_email', email)
    else localStorage.removeItem('remember_email')
  }, [rememberMe, email])

  return (
    <div className='min-h-screen flex items-center justify-center animated-bg relative overflow-hidden'>
      <div className='blob blob-1'></div>
      <div className='blob blob-2'></div>
      <form onSubmit={onSubmitHandler} className='bg-white/95 rounded-lg p-8 min-w-[320px] sm:min-w-96 shadow-lg border border-gray-100 login-card'>
        <div className='flex flex-col gap-3'>
        <p className='text-2xl font-semibold'>
          {state === 'Account Created' ? 'Account Created!' : (state === 'Sign Up' ? 'Signup' : 'Login')}
        </p>
        <p>
          {isLoggingIn ? (
            <span className="flex items-center justify-center text-blue-700">
              <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing your request...
            </span>
          ) : state === 'Account Created' ? (
            <span className="text-green-600">Your account has been created successfully!</span>
          ) : (
            `Please ${state === 'Sign Up' ? 'sign up' : 'log in'} to book appointment`
          )}
        </p>

        {state === 'Account Created' ? (
          <div className='w-full flex flex-col items-center gap-4 my-4'>
            <p className='text-center text-green-600'>Your account has been created successfully. You can now log in to access your account.</p>
            <div className='flex gap-4'>
              <button 
                type='button' 
                onClick={() => {
                  setState('Login');
                  sessionStorage.removeItem('just_authenticated');
                }}
                className='px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors'
              >
                Go to Login
              </button>
              <button 
                type='button' 
                onClick={() => {
                  // Show confirmation before navigating
                  if (confirm('Are you sure you want to go to the home page?')) {
                    sessionStorage.removeItem('just_authenticated');
                    sessionStorage.removeItem('login_page_visited');
                    window.location.href = '/';
                  }
                }}
                className='px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors'
              >
                Go to Home
              </button>
            </div>
          </div>
        ) : state === 'Sign Up' && (
          <>
            <div className='w-full'>
              <p>Full Name</p>
              <input className='border border-zinc-300 rounded w-full p-2 mt-1' type='text' value={name} onChange={(e) => { setName(e.target.value); setFormError('') }} required />
            </div>
            <div className='w-full'>
              <p>Account Type</p>
              <select 
                className='border border-zinc-300 rounded w-full p-2 mt-1' 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </>
        )}

        {state !== 'Account Created' && (
          <>
            <div className='w-full'>
              <p>Email</p>
              <input className='border border-zinc-300 rounded w-full p-2 mt-1 input-focus-ring' type='email' value={email} onChange={(e) => { setEmail(e.target.value); setFormError('') }} required />
            </div>

            {formError && <div className='w-full text-left text-red-600 mt-2'>{formError}</div>}

            <div className='w-full'>
              <p>Password</p>
              <div className='relative w-full'>
                <input
                  className='border border-zinc-300 rounded w-full p-2 mt-1 pr-10 input-focus-ring'
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setFormError('') }}
                  required
                  minLength={6}
                />
                <button type='button' onClick={() => setShowPassword(s => !s)} className='absolute right-2 top-2 p-1 cursor-pointer' aria-pressed={showPassword} aria-label={showPassword ? 'Hide password' : 'Show password'} title={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? (
                    // Open eye icon when password is visible
                    <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='text-gray-600'>
                      <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'></path>
                      <circle cx='12' cy='12' r='3'></circle>
                    </svg>
                  ) : (
                    // Slashed/closed eye icon when password is hidden
                    <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='text-gray-600'>
                      <path d='M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3-11-8 1.02-2.69 2.9-4.89 5.06-6.39'></path>
                      <path d='M1 1l22 22'></path>
                    </svg>
                  )}
                </button>
              </div>
              {state === 'Sign Up' && <p className='text-xs text-gray-500 mt-1'>Password must be at least 6 characters long</p>}
            </div>
          </>
        )}

        {state !== 'Account Created' && (
          <>
            <div className='flex items-center justify-between w-full mt-2'>
              <label className='flex items-center text-sm'>
                <input type='checkbox' checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className='mr-2' />
                Remember me
              </label>
              <button type='button' onClick={() => { 
                setState(state === 'Sign Up' ? 'Login' : 'Sign Up'); 
                setFormError('');
                // Reset form fields when switching modes
                if (state !== 'Sign Up') {
                  setName('');
                  setRole('user');
                }
              }} className='text-sm text-blue-500 underline'>
                {state === 'Sign Up' ? 'Login here' : 'Signup'}
              </button>
            </div>
            <button type='submit' disabled={isLoggingIn} className={`w-full py-2 rounded-md text-base transition-colors flex items-center justify-center ${isLoggingIn ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-primary text-white hover:bg-blue-600'}`}>
              {isLoggingIn && <svg className='btn-spinner animate-spin' width='18' height='18' viewBox='0 0 24 24' fill='none'><circle cx='12' cy='12' r='10' stroke='rgba(255,255,255,0.6)' strokeWidth='4'/></svg>}
              <span>{isLoggingIn ? 'Please wait...' : (state === 'Sign Up' ? 'Signup' : 'Login')}</span>
            </button>
          </>
        )}
        </div>
      </form>
    </div>
  )
}

export default Login

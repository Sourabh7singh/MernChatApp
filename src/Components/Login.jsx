import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import s from '../styles/Login.module.css';

const Login = (props) => {
  const ServerUrl = import.meta.env.VITE_SERVER_URL;
  const [isLoading, setloading] = useState(false);
  const [Responce, setResponce] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const { isLogin } = props;
  const [user, setUser] = useState({
    ...(!isLogin && { name: "", email: "" }),
    username: "",
    password: "",
  })

  useEffect(() => {
    setMounted(true);
  }, []);

  const HandleSubmit = async (e) => {
    setloading(true)
    e.preventDefault();
    let url = "";
    if (isLogin) {
      url = `${ServerUrl}/api/user/login`;
    }
    else {
      url = `${ServerUrl}/api/user/signup`;
    }
    const result = await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify(user)
    })
    const responce = await result.json();
    setResponce(responce)
    setloading(false);
    toast(responce.msg);
    if (responce.Success) {
      localStorage.setItem("user", JSON.stringify(responce.user))
      navigate("/")
    }
  }

  // Helper to join class names conditionally
  const cx = (...classes) => classes.filter(Boolean).join(' ');

  return (
    <div className={s.loginPage}>
      {/* Background Effects */}
      <div className={s.meshBg} />

      <div className={s.particles}>
        <div className={s.particle} />
        <div className={s.particle} />
        <div className={s.particle} />
        <div className={s.particle} />
        <div className={s.particle} />
        <div className={s.particle} />
      </div>

      <div className={s.chatBubbles}>
        <div className={s.chatBubbleDecor} />
        <div className={s.chatBubbleDecor} />
        <div className={s.chatBubbleDecor} />
        <div className={s.chatBubbleDecor} />
      </div>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        theme="dark"
      />

      {/* Main Layout */}
      <div className={s.loginContainer}>

        {/* Left Branding Panel */}
        <div className={cx(s.brandPanel, mounted && s.mounted)}>
          <div className={s.brandLogo}>
            <div className={s.logoIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span className={s.brandName}>ChatSphere</span>
          </div>

          <p className={s.brandTagline}>
            Connect with anyone, anywhere. Real-time messaging reimagined for the modern world.
          </p>

          <div className={s.brandFeatures}>
            {[
              { color: '#7c3aed', text: 'End-to-end encrypted messages' },
              { color: '#06b6d4', text: 'Lightning-fast real-time delivery' },
              { color: '#8b5cf6', text: 'Group chats & channels' },
            ].map((feature, i) => (
              <div
                key={i}
                className={cx(s.featureItem, mounted && s.mounted)}
                style={{ transitionDelay: `${0.5 + i * 0.15}s` }}
              >
                <div className={s.featureDot} style={{ background: feature.color }} />
                {feature.text}
              </div>
            ))}
          </div>
        </div>

        {/* Right Form Panel */}
        <div className={s.formPanel}>
          <div className={cx(s.formCard, mounted && s.mounted)}>
            <div className={s.formHeader}>
              <h1 className={s.formTitle}>
                {isLogin ? 'Welcome back' : 'Create account'}
              </h1>
              <p className={s.formSubtitle}>
                {isLogin
                  ? 'Enter your credentials to access your account'
                  : 'Fill in the details below to get started'}
              </p>
            </div>

            <form onSubmit={HandleSubmit}>
              {/* Name Field (Signup only) */}
              {!isLogin && (
                <div
                  className={cx(s.inputGroup, mounted && s.mounted)}
                  style={{ transitionDelay: '0.3s' }}
                >
                  <label className={s.inputLabel} htmlFor="name">Full Name</label>
                  <div className={cx(s.inputWrapper, focusedField === 'name' && s.focused)}>
                    <svg className={s.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <input
                      className={s.inputField}
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={user.name}
                      onChange={(e) => setUser({ ...user, name: e.target.value })}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                </div>
              )}

              {/* Email Field (Signup only) */}
              {!isLogin && (
                <div
                  className={cx(s.inputGroup, mounted && s.mounted)}
                  style={{ transitionDelay: '0.4s' }}
                >
                  <label className={s.inputLabel} htmlFor="email">Email Address</label>
                  <div className={cx(s.inputWrapper, focusedField === 'email' && s.focused)}>
                    <svg className={s.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <input
                      className={s.inputField}
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={user.email}
                      onChange={(e) => setUser({ ...user, email: e.target.value })}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                </div>
              )}

              {/* Username Field */}
              <div
                className={cx(s.inputGroup, mounted && s.mounted)}
                style={{ transitionDelay: isLogin ? '0.3s' : '0.5s' }}
              >
                <label className={s.inputLabel} htmlFor="username">Username</label>
                <div className={cx(s.inputWrapper, focusedField === 'username' && s.focused)}>
                  <svg className={s.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
                  </svg>
                  <input
                    className={s.inputField}
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={user.username}
                    onChange={(e) => setUser({ ...user, username: e.target.value })}
                    onFocus={() => setFocusedField('username')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div
                className={cx(s.inputGroup, mounted && s.mounted)}
                style={{ transitionDelay: isLogin ? '0.4s' : '0.6s' }}
              >
                <label className={s.inputLabel} htmlFor="password">Password</label>
                <div className={cx(s.inputWrapper, focusedField === 'password' && s.focused)}>
                  <svg className={s.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    className={s.inputField}
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={user.password}
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    style={{ paddingRight: '48px' }}
                  />
                  <button
                    type="button"
                    className={s.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={cx(s.submitBtn, mounted && s.mounted)}
                style={{ transitionDelay: isLogin ? '0.5s' : '0.7s' }}
                disabled={isLoading}
              >
                <span className={s.btnContent}>
                  {isLoading && <div className={s.spinner} />}
                  {isLoading
                    ? 'Please wait...'
                    : isLogin
                      ? 'Sign In'
                      : 'Create Account'
                  }
                  {!isLoading && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  )}
                </span>
              </button>
            </form>

            {/* Divider & Toggle */}
            <div className={cx(s.divider, mounted && s.mounted)}>
              <div className={s.dividerLine} />
              <span className={s.dividerText}>or</span>
              <div className={s.dividerLine} />
            </div>

            <Link
              className={s.toggleLink}
              to={isLogin ? '/signup' : '/login'}
            >
              {isLogin
                ? <>Don't have an account? <strong>Sign up free</strong></>
                : <>Already have an account? <strong>Sign in</strong></>
              }
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

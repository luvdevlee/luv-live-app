"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    agreeTerms: false
  });

  // Update mode when defaultMode changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        agreeTerms: false
      });
    }
  }, [defaultMode, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', { mode, formData });
    onClose();
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
    // Implement Google OAuth
  };

  const handleFacebookLogin = () => {
    console.log('Facebook login clicked');
    // Implement Facebook OAuth
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal-header">
          <h2 className="auth-modal-title">
            {mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
          </h2>
          <button 
            onClick={onClose}
            className="auth-modal-close"
            aria-label="Đóng"
          >
            <X size={24} />
          </button>
        </div>

        <div className="auth-modal-body">
          {/* Social Login Buttons */}
          <div className="social-login-section">
            <button 
              onClick={handleGoogleLogin}
              className="social-login-btn google-btn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Tiếp tục với Google
            </button>

            <button 
              onClick={handleFacebookLogin}
              className="social-login-btn facebook-btn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
              </svg>
              Tiếp tục với Facebook
            </button>
          </div>

          <div className="auth-divider">
            <span>hoặc</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {mode === 'register' && (
              <div className="form-group">
                <label htmlFor="fullName" className="form-label">Họ và tên</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Nhập họ và tên của bạn"
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Nhập email của bạn"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Mật khẩu</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Nhập mật khẩu"
                required
              />
            </div>

            {mode === 'register' && (
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Xác nhận mật khẩu</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Nhập lại mật khẩu"
                  required
                />
              </div>
            )}

            {mode === 'register' && (
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  className="form-checkbox"
                  required
                />
                <label htmlFor="agreeTerms" className="checkbox-label">
                  Tôi đồng ý với <a href="#" className="terms-link">điều khoản sử dụng</a> và <a href="#" className="terms-link">chính sách bảo mật</a>
                </label>
              </div>
            )}

            <button type="submit" className="auth-submit-btn">
              {mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
            </button>
          </form>

          <div className="auth-switch">
            {mode === 'login' ? (
              <p>
                Chưa có tài khoản? 
                <button 
                  onClick={() => setMode('register')}
                  className="switch-mode-btn"
                >
                  Đăng ký ngay
                </button>
              </p>
            ) : (
              <p>
                Đã có tài khoản? 
                <button 
                  onClick={() => setMode('login')}
                  className="switch-mode-btn"
                >
                  Đăng nhập
                </button>
              </p>
            )}
          </div>

          {mode === 'login' && (
            <div className="forgot-password">
              <a href="#" className="forgot-link">Quên mật khẩu?</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import loginStyles from '@/styles/css/page/member.module.scss';
import MockupComponent from '@/component/MockupComponent';
import comment from '@/styles/css/page/comment.module.scss';
import Footer from '@/component/Footer';
import { useRouter } from 'next/router';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [remember, setRemember] = useState(false);
  const router = useRouter();
  const isFormValid = email.trim() !== '' && password.trim() !== '';


  // 아이디 세션
  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRemember(true);
    }
  }, []);

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  function handleRememberChange(e) {
    setRemember(e.target.checked);
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (!result) {
        alert('이메일 또는 비밀번호를 다시 확인해주세요.');
        return;
      }
      if (result.error) {
        alert(`이메일 또는 비밀번호를 다시 확인해주세요.`);
      } else if (result.ok) {
        if (remember) {
          localStorage.setItem('savedEmail', email);
        } else {
          localStorage.removeItem('savedEmail');
        }
        window.location.href = '/'; 
      }
    } catch (err) {
      alert('이메일 또는 비밀번호를 다시 확인해주세요.');
    } finally {
      setLoading(false);
    }
  }

  const handleNaverLogin = async () => {
    try {
      await signIn('naver', { redirect: true, callbackUrl: '/' });
    } catch (error) {
      alert('네이버 로그인 중 문제가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  // 뒤로가기 
  const backBtn = () => {
    router.back();
  };

  return (
    <MockupComponent>
      <main style={{ marginTop: '48px', height: '850px' }}>
        <div className={comment.commentList_title}>
          <span className={comment.commentList_back} onClick={backBtn}></span>
          <h2 className={comment.commentList_title_center}>로그인</h2>
        </div>
        <div className={loginStyles.loginBox}>
          <div
            onClick={() => (location.href = '/')}
            className={loginStyles.loginLogo}
            style={{ backgroundImage: `url(../../IEUMLOGO.svg)` }}
          />
          <form onSubmit={handleLogin}>
            <input
              className={loginStyles.loginInput}
              type="text"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={handleEmailChange}
              disabled={loading}
            />
            <input
              className={loginStyles.loginInput}
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={handlePasswordChange}
              disabled={loading}
            />
            <div className={loginStyles.loginIdbox}>
              <div className={loginStyles.rememberBox}>
                <input
                  type="checkbox"
                  id="remember"
                  checked={remember}
                  onChange={handleRememberChange}
                />
                <label htmlFor="remember"><span>아이디 저장</span></label>
              </div>
              <Link href='/page/member/Findid' className={loginStyles.findId}>
                아이디 찾기
              </Link>
            </div>
            <button
              type="submit"
              className={`${loginStyles.loginBtn} ${isFormValid ? loginStyles.activeBtn : ''}`}
              disabled={!isFormValid || loading}
            >
              {loading ? '로그인' : '로그인'}
            </button>
          </form>
          <div className={loginStyles.linkTextBox}>
            <Link href='/page/member/CreateAcount' className={loginStyles.linkText}>
              회원가입
            </Link>
          </div>
          <div className={loginStyles.externalLoginBox}>
            <div
              onClick={() => signIn('google', { callbackUrl: '/' })}
              style={{ backgroundImage: `url(/icon/icon_login_google.svg)` }}
              className={loginStyles.loginIcon}
            />
            <div
              onClick={() => signIn('github', { callbackUrl: '/' })}
              style={{ backgroundImage: `url(/icon/icon_login_git.svg)` }}
              className={loginStyles.loginIcon}
            />
            <div
              onClick={handleNaverLogin}
              style={{ backgroundImage: `url(/icon/icon_login_naver.svg)` }}
              className={loginStyles.loginIcon}
            />
          </div>
        </div>
      </main>
      <Footer />
    </MockupComponent>
  );
};

export default Login;

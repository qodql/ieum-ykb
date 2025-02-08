import { useState } from 'react';
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
  const [loading, setLoading] = useState(false); // 로딩 상태 추가
  const [error, setError] = useState(null); // 에러 메시지 상태 추가
  const router = useRouter();

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true); // 로그인 시작 시 로딩 상태로 설정
    setError(null); // 이전에 있던 오류를 초기화

    try {
      const result = await signIn('credentials', {
        email,
        password,
        callbackUrl: '/',
      });

      if (result.error) {
        setError('로그인 중 오류가 발생했습니다.'); // 오류 메시지 설정
      } else {
        window.location.href = result.url; // 로그인 성공 시 리디렉션
      }
    } catch (err) {
      setError('로그인 처리 중 문제가 발생했습니다.'); // 예외 처리
    } finally {
      setLoading(false); // 로그인 처리 완료 후 로딩 상태 해제
    }
  }

  // 네이버 로그인 처리 함수
  const handleNaverLogin = async () => {
    try {
      // 네이버 로그인 요청
      await signIn('naver', { redirect: true, callbackUrl: '/' });
    } catch (error) {
      console.error('네이버 로그인 실패:', error);
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
            <button
              type="submit"
              className={loginStyles.loginBtn}
              disabled={loading}
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          {error && <div className={loginStyles.errorMessage}>{error}</div>}

          <div className={loginStyles.linkTextBox}>
            <Link href='/page/member/CreateAcount' className={loginStyles.linkText}>회원가입</Link>
            <Link href='/page/member/Findid' className={loginStyles.linkText}>아이디찾기</Link>
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
              onClick={handleNaverLogin} // 네이버 로그인 처리 함수 연결
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
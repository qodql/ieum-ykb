import { useState } from 'react';
import { signIn, useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import loginStyles from '@/styles/css/page/member.module.scss';
import MockupComponent from '@/component/MockupComponent';
import comment from '@/styles/css/page/comment.module.scss'
import Footer from '@/component/Footer';
import { useRouter } from 'next/router';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  async function handleLogin(e) {
    e.preventDefault();
    const result = await signIn('credentials', { 
      email, 
      password,
      callbackUrl: '/'
    });

    if (result.error) {
      alert("로그인 중 오류가 발생했습니다.");
    } else {
      window.location.href = result.url; 
    }
  }

  // 뒤로가기 
  const backBtn = () => {
    router.back(); 
  }

  return (
    <MockupComponent>
       <main style={{marginTop:'48px', height:'850px'}}>
        <div className={comment.commentList_title}>
          <span className={comment.commentList_back} onClick={backBtn}></span>
          <h2>로그인</h2>
        </div>
        <div className={loginStyles.loginBox}>
          <div onClick={()=> location.href='/'} className={loginStyles.loginLogo} style={{ backgroundImage: `url(../../IEUMLOGO.svg)` }}/>
          <form onSubmit={handleLogin}>
            <input
              className={loginStyles.loginInput}
              type="text"
              placeholder="이메일을 입력하세요"
              onChange={handleEmailChange}
            />
            <input
              className={loginStyles.loginInput}
              type="password"
              placeholder="비밀번호를 입력하세요"
              onChange={handlePasswordChange}
            />
            <button type="submit" className={loginStyles.loginBtn}>로그인</button>
          </form>
          <div className={loginStyles.linkTextBox}>
            <Link href='/page/member/CreateAcount' className={loginStyles.linkText}>회원가입</Link>
            <Link href='/page/member/Findid' className={loginStyles.linkText}>아이디찾기</Link>
          </div>
          <div className={loginStyles.externalLoginBox}>
            <div
              onClick={() => signIn('naver', { callbackUrl: '/' })}
              style={{ backgroundImage: `url(/icon_login_naver.svg)` }}
              className={loginStyles.loginIcon}
            />
            <div
              onClick={() => signIn('github', { callbackUrl: '/' })}
              style={{ backgroundImage: `url(/icon_login_github.svg)` }}
              className={loginStyles.loginIcon}
            />
            <div
              onClick={() => signIn('google', { callbackUrl: '/' })}
              style={{ backgroundImage: `url(/icon_login_google.svg)` }}
              className={loginStyles.loginIcon}
            />
          </div>
        </div>
      </main>
      <Footer/>
    </MockupComponent>
  );
};

export default Login;
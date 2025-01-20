import { useEffect } from "react";
import { signOut } from "next-auth/react";

const ErrorPage = () => {
  useEffect(() => {
    // 에러 발생 시 자동 로그아웃 처리
    signOut();
  }, []);

  return (
    <div>
      <h1>로그인 중 문제가 발생했습니다.</h1>
      <p>다시 시도해주세요.</p>
    </div>
  );
};

export default ErrorPage;

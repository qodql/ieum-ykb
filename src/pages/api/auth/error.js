// pages/auth/error.js
import { useRouter } from 'next/router';

const ErrorPage = () => {
  const router = useRouter();
  const { error } = router.query;

  return (
    <div>
      <h1>로그인 중 문제가 발생했습니다.:{error}</h1>
      <p>다시 시도해주세요.</p>
    </div>
  );
};

export default ErrorPage;

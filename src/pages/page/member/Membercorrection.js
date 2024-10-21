import React, { useState } from 'react';
import loginStyles from '@/styles/css/page/member.module.scss';
import { useSession } from 'next-auth/react';
import { db } from '@/lib/firebase';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { useRouter } from 'next/router';


const Membercorrection = () => {
  const { data: session } = useSession({});
  const [correction, setCorrection] = useState({ nickname: '', password: '' });
  const router = useRouter();
  const handleCorrection = (edit) => {
    setCorrection({ ...correction, ...edit });
  };

  const backBtn = () => {
    router.back(); 
  }

  const nicknameCheck = async (e) => {
    e.preventDefault();
    if (!session) {
      console.error('No session found');
      return;
    }
    const q = query(
      collection(db, 'userInfo'),
      where('info.nickname', '==', correction.nickname)
    )
    const querySnapshot = await getDocs(q);
    if(!querySnapshot.empty) {
     alert('이미 사용중인 닉네임입니다.');
      return;
    }
    else{ alert('사용가능한 닉네임입니다.');}
  }

  const correctionChange = async (e) => {
    e.preventDefault();
    if (!session) {
      console.error('No session found');
      return;
    }

    const q = query(
      collection(db, 'userInfo'),
      where('info.email', '==', session.user.email)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.error('No matching documents found');
      return;
    }

    const docId = querySnapshot.docs[0].id;
    const docRef = doc(db, 'userInfo', docId);

    await setDoc(docRef, {
      info: {
        nickname: correction.nickname,
        password: correction.password,
      },
    },{ merge: true });
  };

  return (
    <div className={loginStyles.memberCorrection}>
      <div
        className={loginStyles.ieumLogo}
        style={{ backgroundImage: `url(../../IEUMLOGO.png)` }}
      />
      <h2>회원수정</h2>
      <form onSubmit={correctionChange}>
        <span className={loginStyles.labelText}>이메일</span>
        <input
          type="text"
          placeholder={session ? session.user.email : '이메일을 입력하세요'}
          readOnly
          className={loginStyles.userInput}
        />

        <span className={loginStyles.labelText}>닉네임 수정</span>
        <div className={loginStyles.nicknameChangeBox}>
          <input
            type="text"
            placeholder="변경할 닉네임을 입력하세요"
            className={loginStyles.userInput}
            onChange={(e) => handleCorrection({ nickname: e.target.value })}
          />
          <button onClick={nicknameCheck} type="button">중복확인</button>
        </div>

        <span className={loginStyles.labelText}>변경할 비밀번호</span>
        <input
          type="password"
          placeholder="변경할 비밀번호를 입력하세요"
          className={loginStyles.userInput}
          onChange={(e) => handleCorrection({ password: e.target.value })}
        />

        <span className={loginStyles.labelText}>비밀번호 확인</span>
        <input
          type="password"
          placeholder="변경할 비밀번호를 다시 입력하세요"
          className={loginStyles.userInput}
        />

        <span className={loginStyles.labelText}>핸드폰번호</span>
        <input
          type="text"
          placeholder="010-6660-1578"
          readOnly
          className={loginStyles.userInput}
        />

        <div className={loginStyles.memberCorrectionBtnBox}>
          <button type="submit" className={loginStyles.memberCorrectionBtn}>
            저장
          </button>
          <button onClick={backBtn} type="button" className={loginStyles.memberCorrectionCancel}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default Membercorrection;
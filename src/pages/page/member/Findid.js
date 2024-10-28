import loginStyles from '@/styles/css/page/member.module.scss';
import React, { useEffect } from 'react'
import { collection, getDoc, getDocs, query, where } from "firebase/firestore";
import { useState } from "react";
import { storage,db } from "@/lib/firebase";
import Link from "next/link";
import MockupComponent from '@/component/MockupComponent';
import { useRouter } from 'next/router';
import Footer from '@/component/Footer';

const Findid = () => {

  const [findInfo, setFindInfo] = useState({phonenum:'', name:''});
  const [searchInfo, setSearchInfo] = useState({});
  const router = useRouter();
  const infoFind = (edit)=>{
    setFindInfo({...findInfo, ...edit});
  }

const contrastInfo = async ()=>{
 const q = query(
  collection(db,"userInfo"),
  where("info.phonenum", "==", findInfo.phonenum),
  where("info.name", "==" , findInfo.name),
 )
 const querySnapshot = await getDocs(q);
 const data = querySnapshot.docs.map((doc)=> doc.data());
 setSearchInfo(data);
 
}


const submitHandle = async (e) => {
  e.preventDefault();
  await contrastInfo(); // 비동기 작업이 완료될 때까지 기다림
}

useEffect(() => {
  if (searchInfo.length > 0) {
    alert(`찾으시는 아이디는 ${searchInfo[0].info.email}입니다.`);
  } else if (searchInfo.length === 0) {
    alert('일치하는 정보가 없습니다.');
  }
}, [searchInfo]);

    // 뒤로가기 
    const backBtn = () => {
      router.back(); 
    }



  return (
    <MockupComponent>
      <main style={{marginTop:'80px', height:'850px'}}>
        <div className={loginStyles.findIdBox}>
          <div className={loginStyles.commentList_title}>
            <span className={loginStyles.commentList_back} onClick={backBtn}></span>
            <h2>아이디찾기</h2>
          </div>
        {/* 아이디 찾기 */}
        <form onSubmit={submitHandle}>
          <span>이름</span>
          <input
          className={loginStyles.userInput}
          type='text'
          placeholder='이름을 입력하세요'
          onChange={(e)=>{infoFind({name:e.target.value})}}/>
          <span>핸드폰번호</span>
          <div className={loginStyles.certificationBox}>
          <input
            className={loginStyles.userInput}
            type='text'
            placeholder='휴대폰번호를 입력하세요'
            onChange={(e)=>{infoFind({phonenum:e.target.value})}}/>
          <button className={loginStyles.certificationBtn}>휴대폰인증</button>
          </div>
          <span>인증번호</span>
          <input
          className={loginStyles.userInput}
          type='text'
          placeholder='인증번호를 입력하세요'/>
          <button type='submit' className={loginStyles.findBtn}>아이디 찾기</button>
        </form>
        </div>
      </main>
      <Footer/>
    </MockupComponent>
  )
}
export default Findid
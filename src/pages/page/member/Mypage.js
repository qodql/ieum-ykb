import React, { useEffect, useState } from 'react'
import loginStyles from '@/styles/css/page/member.module.scss';
import Link from 'next/link';
import { MypageCard, MypageCard2, MypageComment } from '@/component/contents/ContentCard';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { signOut, useSession } from 'next-auth/react';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/router';
import Footer from '../../../component/Footer';

const Mypage = () => {
  const {data : session} = useSession({});
  const [readList, setReadList] = useState({});
  const [readWantList, setReadWantList] = useState({});
  const [commentList, setCommentList] = useState({});
  const router = useRouter();

  useEffect(() => {
    if(session){
      const fetchRead = async () => {
        const q = query(
          collection(db, "readlist"),
          where("email", "==", session.user.email)
        );
        const querySnapshot = await getDocs(q);
        const readLists = querySnapshot.docs.map(doc => doc.data());
        setReadList(readLists);
      };
        fetchRead();
    }
  }, [session]);



  useEffect(() => {
    if(session){
      const fetchRead = async () => {
        const q = query(
          collection(db, "readwantlist"),
          where("email", "==", session.user.email)
        );
        const querySnapshot = await getDocs(q);
        const readWantLists = querySnapshot.docs.map(doc => doc.data());
        setReadWantList(readWantLists);
      };
        fetchRead();
    }
  }, [session]);

  useEffect(() => {
    if(session){
    const fetchComments = async () => {
        const q = query(
          collection(db, "comment"),
          where("email", "==", session.user.email)
        );
        const querySnapshot = await getDocs(q);
        const comments = querySnapshot.docs.map(doc => doc.data());
        setCommentList(comments);
      };
        fetchComments();
      }
  }, [session]);

    // 뒤로가기 
    const backBtn = () => {
      router.back(); 
  }



  return (
    <>    
    {
      <div className={loginStyles.mypageBox}>
        <div className={loginStyles.profileBox}>
          <div 
          onClick={backBtn}
          className={loginStyles.backBtn}  
          style={{backgroundImage:`url(/icon_login_backbtn.svg)`}}
          />
          <div className={loginStyles.profile}>
            <Link href='/page/member/Membercorrection'
            className={loginStyles.profileImg}
            style={{backgroundImage:`url(/img_member_profile.svg)`}}/>
            <p>{session ? session.user.name : ""
            }</p>
          <span>{session == undefined || session == null ?'': session.user.email}</span>
          {
           <span onClick={async () => {
            await signOut({ redirect: false });
            window.location.href = '/'; // 원하는 URL로 변경
          }}>로그아웃</span>

          }
          </div>
        </div>
          <ul className={loginStyles.contentBox}>
            <li>
              <div className={loginStyles.contentList}>
                <span>읽는중</span>
                <Link href='/'>더보기</Link>
              </div>
              <span className={loginStyles.contentText}>이홍영님께서 설정한 읽고 있는 책들의 리스트에요</span>
              <div className={loginStyles.mypageCardBox}>
                {
                 readList.length > 0 ?  readList.map((item, idx)=>
                    <MypageCard key={idx} item={item}/>
                  )
                  : ""
                }

              </div>
            </li>
            <li>
              <div className={loginStyles.contentList}>
                <span>읽고싶어요</span>
                <Link href='/'>더보기</Link>
              </div>
              <span className={loginStyles.contentText}>이홍영님께서 설정한 읽고 싶은 책 리스트를 모아봤어요</span>
              <div className={loginStyles.mypageCardBox}>
                {
                  readList.length > 0 ? readWantList.map((item, idx)=>
                    <MypageCard2 item={item} key={idx}/>
                  )
                  : ""
                }

              </div>
            </li>
            <li>
              <div className={loginStyles.contentList}>
                <span>내가 쓴 코멘트</span>
                <Link href='/'>더보기</Link>
              </div>
              <span className={loginStyles.contentText}>이홍영님께서 작성한 코멘트를 볼 수 있어요</span>
              {
                  commentList.length > 0 ? commentList.map((item, idx)=>
                    <MypageComment item={item} key={idx}/>
                  )
                  : ""
                }
            </li>
          </ul>
      </div>

  }
  <Footer/>
  </>

  )
}

export default Mypage
import React, { useEffect, useState } from 'react'
import loginStyles from '@/styles/css/page/member.module.scss';
import Link from 'next/link';
import { MypageCard, MypageCard2, MypageComment, Mypageread, Mypagereading } from '@/component/contents/ContentCard';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { signOut, useSession } from 'next-auth/react';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/router';
import Footer from '../../../component/Footer';
import MockupComponent from '@/component/MockupComponent';

const Mypage = () => {
  const {data : session} = useSession({});
  const [readList, setReadList] = useState([]);
  const [readWantList, setReadWantList] = useState([]);
  const [commentList, setCommentList] = useState([]);
  const [commentPage, setCommentPage] = useState(false);
  const [readPage, setReadPage] = useState(false);
  const [readingPage, setReadingPage] = useState(false);
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

  const handlereadingClick = () => {
    setReadingPage(!readingPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

 const handlereadClick = () => {
    setReadPage(!readPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
 }

  const handleMoreClick = () => {
    setCommentPage(!commentPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
    // 뒤로가기 
    const backBtn = () => {
      router.back(); 
  }

  return (
    <MockupComponent>
      <main style={{marginTop:'24px', height:'850px'}}>  
      {
        <div className={loginStyles.mypageBox}>
          <div className={loginStyles.profileBox}>
            <div className={loginStyles.btnBox}>
              <div 
              onClick={backBtn}
              className={loginStyles.backBtn}  
              style={{backgroundImage:`url(/icon_login_backbtn.svg)`}}
              />
              {
            <span onClick={async () => {
              await signOut({ redirect: false });
              window.location.href = '/';
            }}>로그아웃</span>
            }
            </div>
            <div className={loginStyles.profile}>
              <Link href='/page/member/Membercorrection'
              className={loginStyles.profileImg}
              style={{backgroundImage:`url(/img_member_profile.svg)`}}/>
              <p>{session ? session.user.name : ""}</p>
            <span>{session == undefined || session == null ?'': session.user.email}</span>
            </div>
          </div>
            <ul className={loginStyles.contentBox}>
              <li>
                <div className={loginStyles.contentList}>
                  <span>읽는중</span>
                  <a onClick={handlereadClick}>더보기</a>
                </div>
                <span className={loginStyles.contentText}>{session ? session.user.name : ""}님께서 설정한 읽고 있는 책들의 리스트에요</span>
                <div className={loginStyles.mypageCardBox}>
                  {
                  readList.length > 0 ?  readList.slice(0,3).map((item, idx)=>
                      <MypageCard key={idx} item={item}/>
                    )
                    : ""
                  }

                </div>
              </li>
              <li>
                <div className={loginStyles.contentList}>
                  <span>읽고싶어요</span>
                  <a onClick={handlereadingClick}>더보기</a>
                </div>
                <span className={loginStyles.contentText}>{session ? session.user.name : ""}님께서 설정한 읽고 싶은 책 리스트를 모아봤어요</span>
                <div className={loginStyles.mypageCardBox}>
                  {
                    readWantList.length > 0 ? readWantList.slice(0,3).map((item, idx)=>
                      <>
                      <MypageCard2 item={item} key={idx}/>
                      <span className={loginStyles.linebar}/>
                      </>
                    )
                    : ""
                  }

                </div>
              </li>
              <li>
                <div className={loginStyles.contentList}>
                  <span>내가 쓴 코멘트</span>
                  <a onClick={handleMoreClick}>더보기</a>
                </div>
                <span className={loginStyles.contentText}>{session ? session.user.name : ""}님께서 작성한 코멘트를 볼 수 있어요</span>
                {
                    commentList.length > 0 ? commentList.slice(0,3).map((item, idx)=>
                      <MypageComment item={item} key={idx}/>
                    )
                    : ""
                }
              </li>
            </ul>
        {
          commentPage === true ? 
          <>
          <div className={loginStyles.morePage}>
            <div className={loginStyles.headerBox}>
              <div 
              onClick={handleMoreClick}
              className={loginStyles.moreBackBtn}  
              style={{backgroundImage:`url(/icon_login_backbtn.svg)`}}
              />
              <h2>코멘트</h2>
            </div>  
            <span className={loginStyles.myCommentstext}>내가 작성한 코멘트({commentList.length})</span>
          <ul>
            {
              commentList.length > 0 ? commentList.map((item, idx)=>
                <>
            <li className={loginStyles.myComentList}>
                  <MypageComment item={item} key={idx}/>
            </li>
                </>
              ) : ""
            }
          </ul>
          </div>
        </>
        : null
        }
        {
          readPage === true ? 
          <>
          <div className={loginStyles.morePage}>
            <div className={loginStyles.headerBox}>
              <div 
              onClick={handlereadClick}
              className={loginStyles.moreBackBtn}  
              style={{backgroundImage:`url(/icon_login_backbtn.svg)`}}
              />
              <h2>읽는중</h2>
            </div>  
            <span className={loginStyles.myCommentstext}>내가 추가한 읽는중({readList.length})</span>
          <ul>
            {
              readList.length > 0 ? readList.map((item, idx)=>
                <>
            <li className={loginStyles.myComentList}>
                  <Mypageread item={item} key={idx}/>
            </li>
                </>
              ) : ""
            }
          </ul>
          </div>
        </>
        : null
        }
             {
          readingPage === true ? 
          <>
          <div className={loginStyles.morePage}>
            <div className={loginStyles.headerBox}>
              <div 
              onClick={handlereadingClick}
              className={loginStyles.moreBackBtn}  
              style={{backgroundImage:`url(/icon_login_backbtn.svg)`}}
              />
              <h2>읽는중</h2>
            </div>  
            <span className={loginStyles.myCommentstext}>내가 추가한 읽는중({readWantList.length})</span>
          <ul>
            {
              readWantList.length > 0 ? readWantList.map((item, idx)=>
                <>
            <li className={loginStyles.myComentList}>
                  <Mypagereading item={item} key={idx}/>
            </li>
                </>
              ) : ""
            }
          </ul>
          </div>
        </>
        : null
        }

       </div>
      
      }
      </main> 
      <Footer/>
        
    </MockupComponent>

  )
}

export default Mypage
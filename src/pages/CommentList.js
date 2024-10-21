import React, { useEffect, useRef, useState } from 'react'
import Footer from '../component/Footer'
import s from '@/styles/css/page/comment.module.scss'
import { useRouter } from 'next/router';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useSession } from 'next-auth/react';
let today = new Date();
let year = today.getFullYear();
let month = today.getMonth() + 1;
let day = today.getDate();    

const CommentList = () => {
  const textareaRef = useRef(null);
  const {data:session} = useSession();
  const router = useRouter();
  const { itemId, itemCover, itemTitle } = router.query;
  const [commentList, setCommentList] = useState({});
  // 뒤로가기 
 
  const backBtn = () => {
    router.back(); 
  }
  //코멘트 불러오기
  useEffect(() => {
    const fetchComments = async () => {
      const q = query(
        collection(db, "comment"),
        where("title", "==", itemTitle)
      );
      const querySnapshot = await getDocs(q);
      const comments = querySnapshot.docs.map(doc => doc.data());
      setCommentList(comments);
    };
      fetchComments();
  }, [itemTitle]);

  //코멘트 등록
  const commentBtn = async () => {
    const comment = textareaRef.current.value;
    const q = query(
        collection(db, "comment"),
        where("email", "==", session.user.email),
        where("title", "==", itemTitle),
    );
    const q2 = query(collection(db, "userInfo"), where("info.email", "==", session.user.email));

    const querySnapshot = await getDocs(q);
    const querySnapshot2 = await getDocs(q2);
    console.log(querySnapshot2, 'querySnapshot2');
    let userImage = null;
      if (!querySnapshot2.empty) {
        const userInfo = querySnapshot2.docs.map(doc => doc.data());
        console.log(userInfo[0].info, '===================='); // userInfo 데이터 구조 확인
        if (userInfo.length > 0 && userInfo[0].info.image) {
          userImage = userInfo[0].info.image;
        } else {
          console.log('No image field found in userInfo'); // image 필드가 없는 경우 로그 출력
        }
      } else {
        console.log('No userInfo found'); // userInfo가 없는 경우 로그 출력
      }
    if (querySnapshot.empty) {
        const docRef = collection(db, "comment");
        await addDoc(docRef, { 
            email: session.user.email,
            title: itemTitle,
            bookid: itemId,
            cover: itemCover,
            comment: comment,
            Creationdate: `${year}.${month}.${day}`,
            userImage: userImage

        });
    }
    else {
        alert("이미 해당 작품에서 코멘트를 등록하셨습니다.");
    } 
  };    
  

  return (
    <>
      <div className={s.commentList_title}>
        <span className={s.commentList_back} onClick={backBtn}></span>
        <h2>코멘트</h2>
      </div>
      {/* 검색 */}
      <div className={s.commetListWrite}>
        <h5>코멘트 작성</h5>
        <div className={s.commetListWriteBox}>
          {
        <form onSubmit={(e)=> {
          e.preventDefault(); 
           commentBtn();
          }}>
            <div className={s.commetListWriteCont}>
              <textarea
                ref={textareaRef}
                placeholder='코멘트를 작성해 주세요'
              />
              <div className={s.commetListWriteLetters}>
                <span>0</span>
                <span>/100</span>
              </div>
            </div>
            <button type='submit'>리뷰 등록</button>
          </form>

          }
        </div>
      </div>
      {

      <div className={s.commentCard_list}>
        <h5>작성된 코멘트 (30)</h5>
        <div className={s.detailComment}>
          <div><img src='./profile.png'/></div>
          <div className={s.detailCommentInfo}>
            <div className={s.detailCommentNickName}>
              <p>나야들기름</p>
              <span>2024-10-11</span>
            </div>
            <div className={s.detailCommentStar}>
              <img src='./star.svg'></img>
              <img src='./star.svg'></img>
              <img src='./star.svg'></img>
              <img src='./star.svg'></img>
              <img src='./star.svg'></img>
            </div>
            <p className={s.detailCommentCont}>
              작가님의 책은 지금 곧바로 읽고 봐야하는 필독서!
            </p>
          </div>
        </div>
        <div className={s.detailComment}>
          <div><img src='./profile.png'/></div>
          <div className={s.detailCommentInfo}>
            <div className={s.detailCommentNickName}>
              <p>고죠백종원</p>
              <span>2024-10-07</span>
            </div>
            <div className={s.detailCommentStar}>
              <img src='./star.svg'></img>
              <img src='./star.svg'></img>
              <img src='./star.svg'></img>
              <img src='./star.svg'></img>
              <img src='./star.svg'></img>
            </div>
            <p className={s.detailCommentCont}>
              이야~ 책으로 어떻게 이런 맛을 내죠?
            </p>
          </div>
        </div>
        <div className={s.detailComment}>
          <div><img src='./profile.png'/></div>
          <div className={s.detailCommentInfo}>
            <div className={s.detailCommentNickName}>
              <p>나주맛피자</p>
              <span>2024-09-30</span>
            </div>
            <div className={s.detailCommentStar}>
              <img src='./star.svg'></img>
              <img src='./star.svg'></img>
              <img src='./star.svg'></img>
              <img src='./star.svg'></img>
              <img src='./star.svg'></img>
            </div>
            <p className={s.detailCommentCont}>
              아쉬워요. 무엇을 말하려고 하는지는 알겠으나 별로 와닿지는 않아요.
            </p>
          </div>
        </div>
        <div className={s.detailComment}>
          <div><img src='./profile.png'/></div>
          <div className={s.detailCommentInfo}>
            <div className={s.detailCommentNickName}>
              <p>나야들기름</p>
              <span>2024-10-11</span>
            </div>
            <div className={s.detailCommentStar}>
              <img src='./star.svg'></img>
              <img src='./star.svg'></img>
              <img src='./star.svg'></img>
              <img src='./star.svg'></img>
              <img src='./star.svg'></img>
            </div>
            <p className={s.detailCommentCont}>
              작가님의 책은 지금 곧바로 읽고 봐야하는 필독서!
            </p>
          </div>
        </div>
        <div className={s.detailComment}>
          <div><img src='./profile.png'/></div>
          <div className={s.detailCommentInfo}>
            <div className={s.detailCommentNickName}>
              <p>고죠백종원</p>
              <span>2024-10-07</span>
            </div>
            <div className={s.detailCommentStar}>
              <img src='./star.svg'></img>
              <img src='./star.svg'></img>
              <img src='./star.svg'></img>
              <img src='./star.svg'></img>
              <img src='./star.svg'></img>
            </div>
            <p className={s.detailCommentCont}>
              이야~ 책으로 어떻게 이런 맛을 내죠?
            </p>
          </div>
        </div>
        <div className={s.detailComment}>
          <div><img src='./profile.png'/></div>
          <div className={s.detailCommentInfo}>
            <div className={s.detailCommentNickName}>
              <p>나주맛피자</p>
              <span>2024-09-30</span>
            </div>
            <div className={s.detailCommentStar}>
              <img src='./star.svg'></img>
              <img src='./star.svg'></img>
              <img src='./star.svg'></img>
              <img src='./star.svg'></img>
              <img src='./star.svg'></img>
            </div>
            <p className={s.detailCommentCont}>
              아쉬워요. 무엇을 말하려고 하는지는 알겠으나 별로 와닿지는 않아요.
            </p>
          </div>
        </div>
      </div>
      }
      <Footer/>
    </>
  )
}

export default CommentList
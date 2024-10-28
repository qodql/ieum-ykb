import React, { useEffect, useRef, useState } from 'react';
import Footer from '../component/Footer';
import s from '@/styles/css/page/comment.module.scss';
import { useRouter } from 'next/router';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useSession } from 'next-auth/react';
import MockupComponent from '@/component/MockupComponent';
import { Rating } from '@mui/material';

let today = new Date();
let year = today.getFullYear();
let month = today.getMonth() + 1;
let day = today.getDate();

const CommentList = () => {
  const textareaRef = useRef(null);
  const { data: session } = useSession();
  const router = useRouter();
  const { itemId, itemCover, itemTitle } = router.query;
  const [commentList, setCommentList] = useState([]);
  const [ratingValue, setRatingValue] = useState(0);
  const [commentLength, setCommentLength] = useState(0);

  // 뒤로가기
  const backBtn = () => {
    router.back();
  };

  // 코멘트 불러오기
  const fetchComments = async () => {
    const q = query(collection(db, 'comment'), where('title', '==', itemTitle));
    const querySnapshot = await getDocs(q);
    const comments = querySnapshot.docs.map((doc) => doc.data());
    setCommentList(comments);
  };

  useEffect(() => {
    if (itemTitle) {
      fetchComments();
    }
  }, [itemTitle]);

  // 코멘트 등록
  const commentBtn = async () => {
    if (!session) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }
  
    const comment = textareaRef.current.value;

    if (comment.length > 100) {
      alert('코멘트는 100자 이하로 작성해 주세요.');
      return;
    }else if (!comment.trim()) {
      alert('내용을 입력해 주세요.');
      return;
    }

    const q = query(
      collection(db, 'comment'),
      where('email', '==', session.user.email),
      where('title', '==', itemTitle)
    );

    const q2 = query(collection(db, 'userInfo'), where('info.email', '==', session.user.email));

    const querySnapshot = await getDocs(q);
    const querySnapshot2 = await getDocs(q2);

    let userImage = null;
    let nickname = null;
    if (!querySnapshot2.empty) {
      const userInfo = querySnapshot2.docs.map((doc) => doc.data());
      if (userInfo.length > 0) {
        if (userInfo[0].info.nickname) {
          nickname = userInfo[0].info.nickname;
        }
        if (userInfo[0].info.image) {
          userImage = userInfo[0].info.image;
        }
      }
    }
    if (querySnapshot.empty) {
      const docRef = collection(db, 'comment');
      await addDoc(docRef, {
        email: session.user.email,
        title: itemTitle,
        bookid: itemId,
        cover: itemCover,
        comment: comment,
        rating: ratingValue,
        Creationdate: `${year}.${month}.${day}`,
        userImage: userImage,
        nickname: nickname
      });
      fetchComments();
    } else {
      alert('해당 작품에는 이미 코멘트를 작성하셨습니다.');
    }
  };

  //글자수 체크
  const textareaChange = () => {
    const comment = textareaRef.current.value;
    setCommentLength(comment.length);
  };

  return (
    <MockupComponent>
      <main style={{ marginTop: '48px', height: '850px' }}>
        <div className={s.commentList_title}>
          <span className={s.commentList_back} onClick={backBtn}></span>
          <h2>코멘트</h2>
        </div>
        <div className={s.commetListWrite}>
          <h5>코멘트 작성</h5>
          <div className={s.commetListWriteBox}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                commentBtn();
              }}
            >
              <div className={s.detailInfoStar}>
                <Rating
                  name="simple-controlled"
                  value={ratingValue}
                  onChange={(event, newValue) => {
                    setRatingValue(newValue);
                  }}
                  precision={0.5}
                  sx={{
                    '& .MuiRating-icon': {
                      fontSize: '48px',
                      borderRadius: '50%',
                      transition: 'color 0.3s ease'
                    },
                    '& .MuiRating-iconHover': {
                      color: '#FFC700'
                    },
                    '& .MuiRating-iconFilled': {
                      color: '#FFC700'
                    },
                    '& .MuiRating-iconEmpty': {
                      color: '#EAEAEA'
                    }
                  }}
                />
              </div>
              <div className={s.commetListWriteCont}>
                <textarea ref={textareaRef} placeholder="코멘트를 작성해 주세요" 
                onChange={textareaChange}/>
                <div className={s.commetListWriteLetters}>
                  <span>{commentLength}</span>
                  <span>/100</span>
                </div>
              </div>
              <button type="submit">코멘트 등록</button>
            </form>
          </div>
        </div>
        <div className={s.commentCard_list}>
          <h5>작성된 코멘트 ({commentList.length})</h5>
          {commentList.map((comment, index) => (
            <div key={index} className={s.detailComment}>
              <div>
                <img src={comment.userImage || './profile.png'} alt="Profile" />
              </div>
              <div className={s.detailCommentInfo}>
                <div className={s.detailCommentNickName}>
                  <p>{comment.nickname}</p>
                  <span>{comment.Creationdate}</span>
                </div>
                <div className={s.detailCommentStar}>
                  <Rating value={comment.rating} readOnly 
                  precision={0.5} 
                  sx={{
                    '& .MuiRating-icon': {
                      fontSize: '14px',
                      borderRadius: '50%',
                    },
                    '& .MuiRating-iconFilled': {
                      color: '#FFC700'
                    },
                    '& .MuiRating-iconEmpty': {
                      color: '#FFC700'
                    }
                  }}
                  />
                </div>
                <p className={s.detailCommentCont}>{comment.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </MockupComponent>
  );
};

export default CommentList;

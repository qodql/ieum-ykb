import React, { useEffect, useMemo, useRef, useState } from 'react'
import s from '@/styles/css/component/content/contentCard.module.scss'
import { collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { Rating } from '@mui/material';



const ContentCard1 = (props) => {
    return (
        <div className={s.contentCard1}>
            <span className={s.bookmark} style={{backgroundImage:`url(./bookmark.png)`}}>{props.item.bestRank}</span>
            <div className={s.contentCard1_image} style={{backgroundImage:`url(${props.item.cover})`}}></div>
        </div>
    )
}

const ContentCard2 = (props) => {
    return (
        <div className={s.contentCard2}>
            <div className={s.contentCard2_image} style={{backgroundImage:`url(${props.item.cover})`}}></div>
            <p className={s.contentCard2_category}>{props.item.categoryName}</p>
            <p className={s.contentCard2_title}>{props.item.title}</p>
            <p className={s.contentCard2_author}>{props.item.author}</p>
        </div>
    )
}

const ContentCard3 = (props) => {
    return (
        <div className={s.contentCard3}>
            <div className={s.contentCard3_image} style={{backgroundImage:`url(${props.item.cover})`}}></div>
            <p className={s.contentCard3_title}>{props.item.title}</p>
            <p className={s.contentCard3_author}>{props.item.author}</p>
        </div>
    )
}

const CommentCard = ({randomComment}) => {
    if(!randomComment){return <div>....로딩....</div>}else
    return (
        <div className={s.comment}>
            <div className={s.profile}>
            <span style={{backgroundImage:`url(./image16.png)`}}></span>
            <div className={s.profile_text}>
                <p className={s.name}>{randomComment.nickname}</p>
                <p className={s.date}>{randomComment.Creationdate}</p>
            </div>
            </div>
            <div className={s.commentCard}>
                <div className={s.commentCard_img} style={{backgroundImage:`url(${randomComment.cover})`}}></div>
                <div className={s.commentCard_text}>
                    <p className={s.commentCard_title}>{randomComment.title}</p>
                    <div className={s.commentCard_rate}>
                    <Rating value={randomComment.rating}
                    precision={0.5}
                    readOnly
                    sx={{
                            '& .MuiRating-icon': {
                                fontSize: '16px',
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
                    <p className={s.commentCard_review}>{randomComment.comment}</p>
                </div>
            </div>
        </div>
    )
}

const ContentList_card = ({item, showBookmark, comment}) => {
    // const [averageRating, setAverageRating] = useState(0);

    const averageRating = useMemo(()=> {
            const findComment = comment.filter(cmt=>cmt.title == item.title)

        
        if(findComment.length > 0){
            const totalRatings = findComment.reduce((sum, comment) => {
               return sum + (comment.rating || 0)
            },0);
            const avgRating = totalRatings / findComment.length;
            return avgRating.toFixed(1);
        }
        
    },[comment])

   
    return (
        <div className={s.ContentList_card}>
            <div className={s.ContentList_card_main}>
                <div className={s.ContentList_card_img}>
                {showBookmark && (
                        <span className={s.ContentList_card_bookmark} style={{ backgroundImage: `url(./bookmark.png)` }}>
                            {item.bestRank}
                        </span>
                    )}
                    <div className={s.ContentList_card_mainImg} style={{ backgroundImage: `url(${item.cover})` }}></div>
                </div>
                <div className={s.ContentList_card_text}>
                    <h2 className={s.ContentList_card_title}>
                        {item.title}
                    </h2>
                    <p className={s.ContentList_card_auther}>
                        {item.author}
                    </p>
                    <p className={s.ContentList_card_rateTitle}>
                    책이음 평점
                    </p>
                    <div className={s.ContentList_card_rate}>
                        <Rating value={averageRating}
                        precision={0.5}
                        readOnly
                        sx={{
                                '& .MuiRating-icon': {
                                    fontSize: '16px',
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
                        {
                            averageRating ?
                            <span className={s.ContentList_card_commentRate}>{averageRating}</span>
                            : <span className={s.ContentList_card_commentRate}>리뷰없음</span>

                        }
                    </div>
                </div>
            </div>
            <div className={s.ContentList_card_foot}>
                <p className={s.ContentList_card_Like}>
                </p>
                <p className={s.ContentList_card_category}>
                    {item.categoryName}
                </p>
            </div>
        </div>
    )
}

//Mypage contentsCard
const MypageCard = (props) => {
    const router = useRouter();
        const detailMove = (item) => {
            router.push({
                pathname: '/Detail',
                query: { itemId: props.item.bookid },
            });
        }; 
    return (
        <div className={s.MypageCard}>
            <div className={s.MypageCard_box}>
                <div
                onClick={detailMove} 
                className={s.MypageCard_image} style={{backgroundImage:`url(${props.item.cover})`}}></div>
            </div>
            <p className={s.MypageCard_title}>{props.item.title}</p>
        </div>
    )
}

//Mypage2 contentsCard
const MypageCard2 = (props) => {
    const router = useRouter();
    const detailMove = (item) => {
        router.push({
            pathname: '/Detail',
            query: { itemId: props.item.bookid },
        });
      };
    return (
        <>
        <div className={s.MypageCard}>
            <div className={s.MypageCard_box}>
                <div
                onClick={detailMove} 
                className={s.MypageCard_image} style={{backgroundImage:`url(${props.item.cover})`}}></div>
            </div>
            <p className={s.MypageCard_title}>{props.item.title}</p>
        </div>
        </>
    )
}


//Mypage commentCard
const MypageComment = (props) => {
    const [more, setMore] = useState(false);
    const moreRef = useRef();
    const router = useRouter();
    const {data: session} = useSession();
    const detailMove = (item) => {
        router.push({
            pathname: '/Detail',
            query: { itemId: props.item.bookid },
        });
      };
    const handleClickOutside = (event) => {
        if (moreRef.current && !moreRef.current.contains(event.target)) {
          setMore(false);
        }
      };
      useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);

      const deleteCommentBtn = async () => {
        const q = query(
          collection(db, "comment"),
          where("bookid", "==", props.item.bookid),
          where("email", "==", session.user.email)
        )
        const querySnapshot = await getDocs(q);
        const docRef = doc(db, "comment", querySnapshot.docs[0].id);
        await deleteDoc(docRef);
        props.onDelete(props.item.bookid);
      }
      
    return (
        <>
        <div  className={s.MypageComment}>
            <div 
            onClick={detailMove}
            className={s.MypageComment_img} style={{backgroundImage:`url(${props.item.cover})`}}></div>
            <div className={s.MypageComment_text}>
                <p className={s.MypageComment_date}>
                    {props.item.Creationdate}
                </p>
                <p className={s.MypageComment_rate}>
                    <Rating name="read-only" value={props.item.rating} readOnly />
                </p>
                <p className={s.MypageComment_review}>
                    {props.item.comment}
                </p>
            </div>
           
            {
             more === true ? 
             <div ref={moreRef} className={s.MypageComment_moreBox}>
                <span>수정</span>
                <span onClick={deleteCommentBtn}>삭제</span>
             </div>
             : <span 
             onClick={()=>setMore(!more)}
             className={s.MypageComment_more} 
             style={{backgroundImage:`url(/more.png)`}}/>
            }
        </div>
        </>
    )
}

const Mypageread = (props) => {
    const [more, setMore] = useState(false);
    const moreRef = useRef();
    const router = useRouter();
    const detailMove = () => {
        router.push({
            pathname: '/Detail',
            query: { itemId: props.item.bookid },
        });
      };

    const handleClickOutside = (event) => {
        if (moreRef.current && !moreRef.current.contains(event.target)) {
          setMore(false);
        }
      };
      useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);

      const deleteReadBtn = async () => {
        const q = query(
          collection(db, "readlist"),
          where("bookid", "==", props.item.bookid),
          where("email", "==", session.user.email)
        )
        const querySnapshot = await getDocs(q);
        const docRef = doc(db, "readlist", querySnapshot.docs[0].id);
        await deleteDoc(docRef);
        props.onDelete(props.item.bookid);
      }
      

    return (
        <>
        <div  className={s.MypageComment}>
            <div 
            onClick={detailMove}
            className={s.MypageComment_img} style={{backgroundImage:`url(${props.item.cover})`}}></div>
            <div className={s.MypageComment_text}>
     
                <p className={s.MypageComment_review}>
                    {props.item.title}
                </p>
            </div>
           
            {
             more === true ? 
             <div ref={moreRef} className={s.MypageComment_moreBox}>
                <span>수정</span>
                <span onClick={deleteCommentBtn}>삭제</span>
             </div>
             : <span 
             onClick={()=>setMore(!more)}
             className={s.MypageComment_more} 
             style={{backgroundImage:`url(/more.png)`}}/>
            }
        </div>
        </>
    )
}

const Mypagereading = (props) => {
    const [more, setMore] = useState(false);
    const moreRef = useRef();
    const router = useRouter();
    const detailMove = () => {
        router.push({
            pathname: '/Detail',
            query: { itemId: props.item.bookid },
        });
      };

    const handleClickOutside = (event) => {
        if (moreRef.current && !moreRef.current.contains(event.target)) {
          setMore(false);
        }
      };
      useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);
      const deleteCommentBtn = async () => {
        const q = query(
          collection(db, "readwantlist"),
          where("bookid", "==", props.item.bookid),
          where("email", "==", session.user.email)
        )
        const querySnapshot = await getDocs(q);
        const docRef = doc(db, "readwantlist", querySnapshot.docs[0].id);
        await deleteDoc(docRef);
        props.onDelete(props.item.bookid);
      }

    return (
        <>
        <div  className={s.MypageComment}>
            <div
            onClick={detailMove} 
            className={s.MypageComment_img} 
            style={{backgroundImage:`url(${props.item.cover})`}}></div>
            <div className={s.MypageComment_text}>
     
                <p className={s.MypageComment_review}>
                    {props.item.title}
                </p>
            </div>
           
            {
             more === true ? 
             <div ref={moreRef} className={s.MypageComment_moreBox}>
                <span>수정</span>
                <span onClick={deleteCommentBtn}>삭제</span>
             </div>
             : <span 
             onClick={()=>setMore(!more)}
             className={s.MypageComment_more} 
             style={{backgroundImage:`url(/more.png)`}}/>
            }
        </div>
        </>
    )
}

export {ContentCard1, ContentCard2, ContentCard3, CommentCard, ContentList_card, MypageCard, MypageComment, MypageCard2 , Mypageread,Mypagereading}
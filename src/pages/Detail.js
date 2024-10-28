import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import s from '@/styles/css/page/main.module.scss';
import commentS from '@/styles/css/page/comment.module.scss';
import detail from '@/styles/css/page/detail.module.scss';
import Footer from '../component/Footer';
import BookStore from '../stores/BookStore';
import { Rating } from '@mui/material';
import Modal from '../component/Modal';
import { useSession } from 'next-auth/react';
import { db } from '@/lib/firebase';
import { addDoc, collection, deleteDoc, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import MockupComponent from '@/component/MockupComponent';
import Link from 'next/link';

const Detail = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const { itemId, mainCateNum, itemTitle,
        searchItemTitle, searchItemCover, searchItemLogo,
        searchItemAuthor, searchItemCategory, searchItemDesc,
        searchItemPubDate, searchItemPrice,searchItemPublisher,
        searchItemLink, searchItemBestRank, searchItemCustomerReviewRank,
    } = router.query;
    const { category, itemApi } = BookStore();
    const [item, setItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [commentList, setCommentList] = useState([]);
    const [readState, setReadState] = useState(false);
    const [readWantState, setReadWantState] = useState(false);
    const [averageRating, setAverageRating] = useState(0);


    // 데이터 불러오기
    useEffect(() => {
        const cateNum = mainCateNum;
        const coverSize = 'Big';
        async function fetchData() {
            await itemApi('cate', cateNum, coverSize);
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (itemId && category) {
            const foundItem = Object.values(category).flatMap(category => category.item)
                .find(i => i.itemId === Number(itemId));
            setItem(foundItem);
        }else{
            // const foundItem2 = Object.values
        }
    }, [itemId, category]);


    // 유저가 이미 북마크를 추가했는지 확인하는 함수
    useEffect(() => {
        const fetchRead = async () => {
            if (!session || !item) return;

            const q = query(
                collection(db, "readlist"),
                where("email", "==", session.user.email),
                where("title", "==", item.title),
            );
            const q2 = query(
                collection(db, "readwantlist"),
                where("email", "==", session.user.email),
                where("title", "==", item.title),
            );

            const querySnapshot = await getDocs(q);
            const querySnapshot2 = await getDocs(q2);

            setReadState(querySnapshot.empty ? false : true);
            setReadWantState(querySnapshot2.empty ? false : true);
        };

        fetchRead();
    }, [session, readState, readWantState, item]);

    // 코멘트 불러오기
    const fetchComments = async () => {
        const q = query(collection(db, 'comment'), where('title', 'in', [String(itemTitle), String(searchItemTitle)]));
        const querySnapshot = await getDocs(q);
        const comments = querySnapshot.docs.map((doc) => doc.data());
        setCommentList(comments);

        //별점 평균 값
        const ratings = comments.map(comment => comment.rating).filter(rating => typeof rating === 'number' && !isNaN(rating));

        const totalRating = ratings.reduce((acc, rating) => acc + rating, 0);
        const avgRating = ratings.length > 0 ? (totalRating / ratings.length).toFixed(1) : 0;

        setAverageRating(avgRating);
    };

    useEffect(() => {
        if (itemTitle || searchItemTitle) {
            fetchComments();
        }
    }, [itemTitle]);
    
    // 뒤로가기
    const backBtn = () => {
        router.back();
    };

    // 공유 버튼
    const shareBtn = () => {
        setIsModalOpen(true);
    };

    // 공유 버튼 닫기
    const shareClose = () => {
        setIsModalOpen(false);
    };

    // 공유 링크 복사
    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        alert('링크가 복사되었습니다');
    };

    // 로딩
    if (!item && !searchItemTitle) {
        return (
            <MockupComponent>
                <div className={s.loading}>
                    <img src="/icon/loading.gif" alt="Loading..." />
                </div>
            </MockupComponent>
        );
    }

    //신간 아이콘 내보내기
    const pubDate = new Date(item ? item.pubDate: searchItemPubDate)
    
    const date = new Date()
    const futureDate = new Date()
    date.setDate(date.getDate() - 21)
    futureDate.setDate(futureDate.getDate() + 14)
    
    // 코멘트리스트로 보내는 정보
    const commentMove = (item) => {
        router.push({
            pathname: '/CommentList',
            query: { itemId: item.itemId, itemCover: item.cover, itemTitle: item.title },
        });
    };
    // 읽는중 버튼
    const authorize = async () => {
        const q = query(
            collection(db, "readlist"),
            where("email", "==", session.user.email),
            where("title", "==", item.title),
        );
        const querySnapshot = await getDocs(q);
        // querySnapshot.forEach(item=>{
        //     item.data()
        //     item.id
        // })
        // console.log(querySnapshot.doc,'=============')

        if (querySnapshot.empty) {
            const docRef = collection(db, "readlist"); // 컬렉션 참조 생성
            await addDoc(docRef, {
                email: session.user.email,
                title: item.title,
                bookid: item.itemId,
                cover: item.cover,
                author: item.author,
                
            });
            alert("읽는중에 추가되었습니다.");
        } else {
            await deleteDoc(doc(db, "readlist", querySnapshot.docs[0].id))
            // 이미 존재하는 경우의 로직을 여기에 추가할 수 있습니다.
            alert("'읽는중'이 취소되었습니다.");
        }
    };

    // 읽고싶어요 버튼
    const readwantBtn = async () => {
        const q = query(
            collection(db, "readwantlist"),
            where("email", "==", session.user.email),
            where("title", "==", item.title),
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            const docRef = collection(db, "readwantlist"); // 컬렉션 참조 생성
            await addDoc(docRef, {
                email: session.user.email,
                title: item.title,
                bookid: item.itemId,
                cover: item.cover,
                author: item.author,
            });
            alert("읽고싶어요에 추가되었습니다.");
        } else {
            await deleteDoc(doc(db, "readwantlist", querySnapshot.docs[0].id))
            alert("이미 등록된 책입니다.");
        }
    };
    if(!searchItemTitle){
        return (
            <MockupComponent>
                <main style={{marginTop:'20px', height:'850px'}}>
                    <div className={detail.subWrap}>
                        <div className={detail.subTop}>
                            <a onClick={backBtn}><img src='./arrow-left.svg' /></a>
                            <a onClick={shareBtn}><img src='./share.svg' /></a>
                        </div>
                        <div className={detail.detail}>
                            <div className={detail.detailThumbArea}>
                                <div className={detail.detailThumbBg}>
                                    <img src={item.cover} alt={item.title} />
                                </div>
                                <div className={detail.detailThumbBox}>
                                    <div className={detail.detailThumb}>
                                        <img src={item.cover} alt={item.title} />
                                    </div>
                                    <div className={detail.detailThumbInfo}>
                                        <h5 className={detail.detailThumbTit}>{item.title}</h5>
                                        <span className={detail.detailThumbWriter}>{item.author}</span>
                                        <span className={detail.detailThumbType}>{item.categoryName}</span>
                                        <div className={detail.detailThumbIcon}>
                                            {
                                                item.bestRank ? 
                                                <p>베스트<br/>{item.bestRank}&nbsp;위</p>
                                                : <></>
                                            }
                                            {
                                                item.customerReviewRank > 0 ? 
                                                <p>블로거<br/>{item.customerReviewRank}&nbsp;위</p>
                                                : <></>
                                            }
                                            {
                                                futureDate >= pubDate && pubDate >= date ? 
                                                <p>신&nbsp;간</p>
                                                : <></>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className={detail.detailInfoArea}>
                                    <div className={detail.detailInfoMark}>
                                        <div className={detail.detailInfoGrade}>
                                            <span>평균</span>
                                            <p>
                                                <i><img src='./star.svg' alt="star" /></i>
                                                <span>{averageRating}</span>
                                            </p>
                                            <span>({commentList.length}명)</span>
                                        </div>
                                        <div className={detail.detailInfoLikes}>
                                        </div>
                                    </div>
                                
                                    <div className={detail.detailInfoIcon}>
                                        {session ? (
                                            <div onClick={() => {
                                                readwantBtn();
                                                setReadWantState(!readWantState); // 상태 즉시 반영
                                            }}>
                                                {readWantState === true ? (
                                                    <i><img src='./icon/icon_detail_readwantbtn_color.svg' /></i>
                                                ) : (
                                                    <i><img src='./interest.svg' /></i>
                                                )}
                                                <span>읽고싶어요</span>
                                            </div>
                                        ) : (
                                            <div onClick={() => alert('로그인이 필요한 서비스입니다')}>
                                                <i><img src='./interest.svg' /></i>
                                                <span>읽고싶어요</span>
                                            </div>
                                        )}
                                        {session ? (
                                            <div onClick={() => commentMove(item)}>
                                                <i><img src='./comment.svg' /></i>
                                                <span>코멘트</span>
                                            </div>
                                        ) : (
                                            <div onClick={() => alert('로그인이 필요한 서비스입니다')}>
                                                <i><img src='./comment.svg' /></i>
                                                <span>코멘트</span>
                                            </div>
                                        )}
                                        {session ? (
                                            <div onClick={() => {
                                                authorize();
                                                setReadState(!readState); // 상태 즉시 반영
                                            }}>
                                                {readState === true ? (
                                                    <i><img src='./icon/icon_detail_reading_color.svg' /></i>
                                                ) : (
                                                    <i><img src='./icon_detail_reading.svg' /></i>
                                                )}
                                                <span>읽는중</span>
                                            </div>
                                        ) : (
                                            <div onClick={() => alert('로그인이 필요한 서비스입니다')}>
                                                {readState === true ? (
                                                    <i><img src='./icon/icon_detail_reading_color.svg' /></i>
                                                ) : (
                                                    <i><img src='./icon_detail_reading.svg' /></i>
                                                )}
                                                <span>읽는중</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className={detail.detailInfo}>
                                        <p className={detail.detailInfoTit}>기본 정보</p>
                                        <span>{item.categoryName}</span>
                                        <p className={detail.detailInfoDescription}>
                                            {item.description}
                                        </p>
                                    </div>
                                    <div className={detail.detailInfoBox}>
                                        <div>
                                            <span>출판일</span>
                                            <span>{item.pubDate}</span>
                                        </div>
                                        <div>
                                            <span>가격(정가)</span>
                                            <span>{item.priceStandard}원</span>
                                        </div>
                                        <div>
                                            <span>출판사</span>
                                            <span>{item.publisher}</span>
                                        </div>
                                    </div>
                                    <div className={detail.detailInfoPlace}>
                                        <p>구매 가능한 곳</p>
                                        <div className={detail.detailInfoImgbox}>
                                            <img src='./aladin.jpg'></img>
                                            <img src='./kyobo.jpg'></img>
                                            <img src='./yes24.jpg'></img>
                                        </div>
                                    </div>
                                    <div className={detail.detailCommentWrap}>
                                        <div className={`${s.contentTitle} ${detail.contentTitle}`}>
                                            <h2>코멘트</h2>
                                            <a onClick={() => commentMove(item)}>
                                                <button>전체보기</button>
                                            </a>
                                        </div>
                                        <div className={`${commentS.commentCard_list} ${commentS.commentCard_list2}`}>
                                            {
                                                commentList.slice(0, 3).map((comment, index) => (
                                                    <div key={index} className={commentS.detailComment}>
                                                        <div>
                                                            <img src={comment.userImage || './profile.png'} alt="Profile" />
                                                        </div>
                                                        <div className={commentS.detailCommentInfo}>
                                                            <div className={commentS.detailCommentNickName}>
                                                                <p>{comment.nickname}</p>
                                                                <span>{comment.Creationdate}</span>
                                                            </div>
                                                            <div className={commentS.detailCommentStar}>
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
                                                            <p className={commentS.detailCommentCont}>{comment.comment}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Modal isModalOpen={isModalOpen} shareClose={shareClose} copyLink={copyLink} />
                </main>
            <Footer />
        </MockupComponent>
        );
    }else if(searchItemTitle){
        return (
            <MockupComponent>
                <main style={{marginTop:'20px', height:'850px'}}>
                    <div className={detail.subWrap}>
                        <div className={detail.subTop}>
                            <a onClick={backBtn}><img src='./arrow-left.svg' /></a>
                            <a onClick={shareBtn}><img src='./share.svg' /></a>
                        </div>
                        <div className={detail.detail}>
                            <div className={detail.detailThumbArea}>
                                <div className={detail.detailThumbBg}>
                                    <img src={searchItemCover? searchItemCover : searchItemLogo} alt={searchItemTitle} />
                                </div>
                                <div className={detail.detailThumbBox}>
                                    <div className={detail.detailThumb}>
                                        <img src={searchItemCover? searchItemCover : searchItemLogo} alt={searchItemTitle} />
                                    </div>
                                    <div className={detail.detailThumbInfo}>
                                        <h5 className={detail.detailThumbTit}>{searchItemTitle}</h5>
                                        <span className={detail.detailThumbWriter}>{searchItemAuthor}</span>
                                        <span className={detail.detailThumbType}>{searchItemCategory}</span>
                                        <div className={detail.detailThumbIcon}>
                                            {
                                                searchItemBestRank ? 
                                                <p>베스트<br/>{searchItemBestRank}&nbsp;위</p>
                                                : <></>
                                            }
                                            {
                                                searchItemCustomerReviewRank > 0 ? 
                                                <p>블로거<br/>{searchItemCustomerReviewRank}&nbsp;위</p>
                                                : <></>
                                            }
                                            {
                                                futureDate >= pubDate && pubDate >= date ? 
                                                <p>신&nbsp;간</p>
                                                : <></>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className={detail.detailInfoArea}>
                                    <div className={detail.detailInfoMark}>
                                        <div className={detail.detailInfoGrade}>
                                            <span>평균</span>
                                            <p>
                                                <i><img src='./star.svg' alt="star" /></i>
                                                <span>{averageRating}</span>
                                            </p>
                                            <span>({commentList.length}명)</span>
                                        </div>
                                        <div className={detail.detailInfoLikes}>
                                        </div>
                                    </div>
                                   
                                    <div className={detail.detailInfoIcon}>
                                        {session ? (
                                            <div onClick={() => {
                                                readwantBtn();
                                                setReadWantState(!readWantState); // 상태 즉시 반영
                                            }}>
                                                {readWantState === true ? (
                                                    <i><img src='./icon/icon_detail_readwantbtn_color.svg' /></i>
                                                ) : (
                                                    <i><img src='./interest.svg' /></i>
                                                )}
                                                <span>읽고싶어요</span>
                                            </div>
                                        ) : (
                                            <div onClick={() => alert('로그인이 필요한 서비스입니다')}>
                                                <i><img src='./interest.svg' /></i>
                                                <span>읽고싶어요</span>
                                            </div>
                                        )}
                                        {session ? (
                                            <div onClick={() => commentMove(item)}>
                                                <i><img src='./comment.svg' /></i>
                                                <span>코멘트</span>
                                            </div>
                                        ) : (
                                            <div onClick={() => alert('로그인이 필요한 서비스입니다')}>
                                                <i><img src='./comment.svg' /></i>
                                                <span>코멘트</span>
                                            </div>
                                        )}
                                        {session ? (
                                            <div onClick={() => {
                                                authorize();
                                                setReadState(!readState); // 상태 즉시 반영
                                            }}>
                                                {readState === true ? (
                                                    <i><img src='./icon/icon_detail_reading_color.svg' /></i>
                                                ) : (
                                                    <i><img src='./icon_detail_reading.svg' /></i>
                                                )}
                                                <span>읽는중</span>
                                            </div>
                                        ) : (
                                            <div onClick={() => alert('로그인이 필요한 서비스입니다')}>
                                                {readState === true ? (
                                                    <i><img src='./icon/icon_detail_reading_color.svg' /></i>
                                                ) : (
                                                    <i><img src='./icon_detail_reading.svg' /></i>
                                                )}
                                                <span>읽는중</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className={detail.detailInfo}>
                                        <p className={detail.detailInfoTit}>기본 정보</p>
                                        <span>{searchItemCategory}</span>
                                        <p className={detail.detailInfoDescription}>
                                            {searchItemDesc}
                                        </p>
                                    </div>
                                    <div className={detail.detailInfoBox}>
                                        <div>
                                            <span>출판일</span>
                                            <span>{searchItemPubDate}</span>
                                        </div>
                                        <div>
                                            <span>가격(정가)</span>
                                            <span>{searchItemPrice}원</span>
                                        </div>
                                        <div>
                                            <span>출판사</span>
                                            <span>{searchItemPublisher}</span>
                                        </div>
                                    </div>
                                    <div className={detail.detailInfoPlace}>
                                        <p>구매 가능한 곳</p>
                                        <div className={detail.detailInfoImgbox}>
                                            <Link href={searchItemLink}><img src='./aladin.jpg'></img></Link>
                                            <Link href={'https://www.kyobobook.co.kr/'}><img src='./kyobo.jpg'></img></Link>
                                            <Link href={'https://m.yes24.com/Home/Main'}><img src='./yes24.jpg'></img></Link>
                                        </div>
                                    </div>
                                    <div className={detail.detailCommentWrap}>
                                        <div className={`${s.contentTitle} ${detail.contentTitle}`}>
                                            <h2>코멘트</h2>
                                            <a onClick={() => commentMove(item)}>
                                                <button>전체보기</button>
                                            </a>
                                        </div>
                                        <div className={`${commentS.commentCard_list} ${commentS.commentCard_list2}`}>
                                            {   commentList.length > 0 && commentList[0].title == searchItemTitle ?
                                                commentList.slice(0, 3).map((comment, index) => (
                                                    <div key={index} className={commentS.detailComment}>
                                                        <div>
                                                            <img src={comment.userImage || './profile.png'} alt="Profile" />
                                                        </div>
                                                        <div className={commentS.detailCommentInfo}>
                                                            <div className={commentS.detailCommentNickName}>
                                                                <p>{comment.nickname}</p>
                                                                <span>{comment.Creationdate}</span>
                                                            </div>
                                                            <div className={commentS.detailCommentStar}>
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
                                                            <p className={commentS.detailCommentCont}>{comment.comment}</p>
                                                        </div>
                                                    </div>
                                                )) : ''
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Modal isModalOpen={isModalOpen} shareClose={shareClose} copyLink={copyLink} />
                </main>
                <Footer />
            </MockupComponent>
        );
    }
};

export default Detail;
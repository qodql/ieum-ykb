import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import s from '@/styles/css/page/main.module.scss';
import detail from '@/styles/css/page/detail.module.scss';
import { ButtonAll } from '../component/Button';
import Footer from '../component/Footer';
import BookStore from '../stores/BookStore';
import { Rating } from '@mui/material';
import Modal from '../component/Modal';
import { useSession } from 'next-auth/react';
import { db } from '@/lib/firebase';
import { addDoc, collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';

const Detail = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const { itemId, mainCateNum } = router.query;
    const { category, itemApi } = BookStore();
    const [item, setItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [comment, setComment] = useState('');
    const [modalBtn, setModalBtn] = useState(false);
    const [commentTitle, setCommenttitle] = useState('');
    const [readState, setReadState] = useState(false);
    const [readWantState, setReadWantState] = useState(false);

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
    if (!item) {
        return (
            <div className={s.loading}>
                <img src="/icon/loading.gif" alt="Loading..." />
            </div>
        );
    }

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

        if (querySnapshot.empty) {
            const docRef = collection(db, "readlist"); // 컬렉션 참조 생성
            await addDoc(docRef, {
                email: session.user.email,
                title: item.title,
                bookid: item.itemId,
                cover: item.cover
            });
            alert("읽는중에 추가되었습니다.");
        } else {
            // 이미 존재하는 경우의 로직을 여기에 추가할 수 있습니다.
            alert("이미 등록된 책입니다.");
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
                cover: item.cover
            });
            alert("읽고싶어요에 추가되었습니다.");
        } else {
            alert("이미 등록된 책입니다.");
        }
    };

    return (
        <>
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
                                <div className={detail.detailThumbIcon}>
                                    <span>베스트</span>
                                    <span>편집자추천</span>
                                </div>
                                <h5 className={detail.detailThumbTit}>{item.title}</h5>
                                <span className={detail.detailThumbWriter}>{item.author}</span>
                                <span className={detail.detailThumbType}>{item.categoryName}</span>
                            </div>
                        </div>
                        <div className={detail.detailInfoArea}>
                            <div className={detail.detailInfoMark}>
                                <div className={detail.detailInfoGrade}>
                                    <span>평균</span>
                                    <p>
                                        <i><img src='./star.svg' alt="star" /></i>
                                        <span>4.0</span>
                                    </p>
                                    <span>(12명)</span>
                                </div>
                                <div className={detail.detailInfoLikes}>
                                </div>
                            </div>
                            <div className={detail.detailInfoStar}>
                                <Rating
                                    name="simple-controlled"
                                    precision={0.5}
                                    sx={{
                                        '& .MuiRating-icon': {
                                            fontSize: '48px',
                                            borderRadius: '50%',
                                            transition: 'color 0.3s ease',
                                        },
                                        '& .MuiRating-iconHover': {
                                            color: '#FFC700',
                                        },
                                        '& .MuiRating-iconFilled': {
                                            color: '#FFC700',
                                        },
                                        '& .MuiRating-iconEmpty': {
                                            color: '#EAEAEA',
                                        },
                                    }}
                                />
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
                                <div>
                                    <i><img src='./add.svg' /></i>
                                    <span>더보기</span>
                                </div>
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
                                    <span>페이지</span>
                                    <span>400p</span>
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
                                    <ButtonAll />
                                </div>
                                <div className={detail.detailComment}>
                                    <div><img src='./profile.png' /></div>
                                    <div className={detail.detailCommentInfo}>
                                        <div className={detail.detailCommentNickName}>
                                            <p>나야들기름</p>
                                            <span>2024-10-11</span>
                                        </div>
                                        <div className={detail.detailCommentStar}>
                                            <img src='./star.svg'></img>
                                            <img src='./star.svg'></img>
                                            <img src='./star.svg'></img>
                                            <img src='./star.svg'></img>
                                            <img src='./star.svg'></img>
                                        </div>
                                        <p className={detail.detailCommentCont}>
                                            작가님의 책은 지금 곧바로 읽고 봐야하는 필독서!
                                        </p>
                                    </div>
                                </div>
                                <div className={detail.detailComment}>
                                    <div><img src='./profile.png' /></div>
                                    <div className={detail.detailCommentInfo}>
                                        <div className={detail.detailCommentNickName}>
                                            <p>고죠백종원</p>
                                            <span>2024-10-07</span>
                                        </div>
                                        <div className={detail.detailCommentStar}>
                                            <img src='./star.svg'></img>
                                            <img src='./star.svg'></img>
                                            <img src='./star.svg'></img>
                                            <img src='./star.svg'></img>
                                            <img src='./star.svg'></img>
                                        </div>
                                        <p className={detail.detailCommentCont}>
                                            이야~ 책으로 어떻게 이런 맛을 내죠?
                                        </p>
                                    </div>
                                </div>
                                <div className={detail.detailComment}>
                                    <div><img src='./profile.png' /></div>
                                    <div className={detail.detailCommentInfo}>
                                        <div className={detail.detailCommentNickName}>
                                            <p>나주맛피자</p>
                                            <span>2024-09-30</span>
                                        </div>
                                        <div className={detail.detailCommentStar}>
                                            <img src='./star.svg'></img>
                                            <img src='./star.svg'></img>
                                            <img src='./star.svg'></img>
                                            <img src='./star.svg'></img>
                                            <img src='./star.svg'></img>
                                        </div>
                                        <p className={detail.detailCommentCont}>
                                            아쉬워요. 무엇을 말하려고 하는지는 알겠으나 별로 와닿지는 않아요.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal isModalOpen={isModalOpen} shareClose={shareClose} copyLink={copyLink} />
            <Footer />
        </>
    );
};

export default Detail;
import s from '@/styles/css/page/main.module.scss';
import Footer from '../component/Footer';
import Header from '../component/Header';
import { ButtonAll, ButtonArrow } from '../component/Button';
import { CommentCard } from '../component/contents/ContentCard';
import { ContentListMain1, ContentListMain2, ContentListMain3, BannerBox} from '../component/contents/ContentList';
import { useEffect, useState } from 'react';
import BookStore from '../stores/BookStore';
import LoadingScreen from '../component/loadingScreen';
import MockupComponent from '@/component/MockupComponent';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function Home() {
    const { mainItems, itemApi, error } = BookStore();
    const [cate, setCate] = useState('1');
    const [active, setActive] = useState(true);
    // 처음 들어올 때만 로고 화면 표시 (이미 받아둔 데이터가 있으면 바로 본문)
    const [loading, setLoading] = useState(!mainItems.Bestseller.item.length);
    const [loadingfadeOut, setLoadingfadeOut] = useState(false);
    const [randomComment, setRandomComment] = useState(null);

    const categoryNum = (num) => {
        setCate(num);
    };

    // mainItems
    useEffect(() => {
        const cateNum = '';
        const coverSize = 'Big';
        if(!mainItems.Bestseller.item.length){
            async function fetchData() {
                // 요청이 성공하든 실패하든 끝나면 로고 화면을 닫음
                await itemApi('main', cateNum, coverSize);
                setTimeout(() => {
                    setLoadingfadeOut(true);
                    setTimeout(() => setLoading(false), 500);
                }, 1000);
            }
            fetchData();
        }
    }, []);

    //랜덤 코멘트
    useEffect(() => {
        const fetchRandomComment = async () => {
            const querySnapshot = await getDocs(collection(db, 'comment'));
            const comments = querySnapshot.docs.map((doc) => doc.data());

            if (comments.length > 0) {
                const random = Math.floor(Math.random() * comments.length);
                setRandomComment(comments[random]);
            }
        };

        fetchRandomComment();
    }, []);



    if (loading) return <LoadingScreen loadingfadeOut={loadingfadeOut}/>;

    // API 호출이 실패해 데이터가 없을 때 원인을 화면에 표시
    if (!mainItems.Bestseller.item.length && error) {
        return (
            <MockupComponent>
                <Header/>
                <main style={{ padding: '80px 16px', textAlign: 'center', color: '#666' }}>
                    <p>도서 정보를 불러오지 못했어요.</p>
                    <p style={{ fontSize: '13px', marginTop: '8px' }}>
                        {error?.response?.data?.message ?? error?.message ?? '잠시 후 다시 시도해 주세요.'}
                    </p>
                </main>
                <Footer/>
            </MockupComponent>
        );
    }

    return (
        <>
        <MockupComponent>
            <Header/>
            <main >
                <BannerBox mainItems={mainItems} />                   
                <div className={s.mainContent1}>
                    <div className={s.contentTitle}>
                        <h2>블로거 베스트셀러</h2>
                        <ButtonAll category="BlogBest"/>
                    </div>
                    <ContentListMain1 mainItems={mainItems} />
                </div>

                <div className={s.mainContent2}>
                    <div className={s.contentTitle}>
                        <h2>신간 리스트</h2>
                        <ButtonAll category="ItemNewAll"/>
                    </div>
                    <ContentListMain2 mainItems={mainItems} />
                </div>

                <div className={s.mainContent3}>
                    <div className={s.contentTitle}>
                        <h2>편집자 추천 리스트</h2>
                        <ButtonAll category="Bestseller"/>
                    </div>
                    <ul className={s.c3Category}>
                        <li className={s.c3Category_li}>
                            <button className={`${cate === '1' ?  s.active : s.c3Category_btn}`} onClick={() => { categoryNum('1') }}>문학</button>
                        </li>
                        <li className={s.c3Category_li}>
                            <button className={`${cate === '170' ?  s.active : s.c3Category_btn}`} onClick={() => { categoryNum('170') }}>경제</button>
                        </li>
                        <li className={s.c3Category_li}>
                            <button className={`${cate === '2556' ?  s.active : s.c3Category_btn}`} onClick={() => { categoryNum('2556') }}>추리</button>
                        </li>
                        <li className={s.c3Category_li}>
                            <button className={`${cate === '55889' ?  s.active : s.c3Category_btn}`} onClick={() => { categoryNum('55889') }}>종교</button>
                        </li>
                        <li className={s.c3Category_li}>
                            <button className={`${cate === '8516' ?  s.active : s.c3Category_btn}`} onClick={() => { categoryNum('8516') }}>에세이</button>
                        </li>
                        <li className={s.c3Category_li}>
                            <button className={`${cate === '4132' ?  s.active : s.c3Category_btn}`} onClick={() => { categoryNum('4132') }}>판타지</button>
                        </li>
                    </ul>
                    <ContentListMain3 
                        categoryNum={categoryNum} 
                        cate={cate} />
                </div>
                <div className={s.mainContent4}>
                    <div className={s.contentTitle}>
                        <h2>지금 뜨는 코멘트</h2>
                        <ButtonArrow />
                    </div>
                    <CommentCard randomComment={randomComment}/>
                </div>
            </main>
            <Footer/>
        </MockupComponent>
        </>
    );
}

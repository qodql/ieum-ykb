import React, { useEffect, useState } from 'react';
import Header from '../component/Header'
import Footer from '../component/Footer'
import { ContentList_card } from '../component/contents/ContentCard'
import list from '../styles/css/page/book.module.scss'
import s from '../styles/css/page/main.module.scss'
import BookStore from '../stores/BookStore';
import MockupComponent from '@/component/MockupComponent';
import { useRouter } from 'next/router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const Book = () => {
    const { mainItems, itemApi, loading } = BookStore();
    const [categoryTab, setCategoryTab] = useState('Bestseller');
    const router = useRouter();
    const categoryQuery = router.query.category || 'Bestseller';
    const [comment, setComment] = useState();
    
    //api 요청
    useEffect(() => {
        const coverSize = 'Mid';
        itemApi('main', coverSize);
    }, [itemApi]);

    // 네비게이션
    useEffect(() => {
        setCategoryTab(categoryQuery);
    }, [categoryQuery]);

    const categoryItems = ['Bestseller', 'ItemNewAll', 'BlogBest'];

    // 카테고리 이름 변경
    const getCategoryLabel = (category) => {
        switch (category) {
            case 'Bestseller':
                return '베스트 셀러';
            case 'ItemNewAll':
                return '신간 베스트';
            case 'BlogBest':
                return '블로거 베스트';
            default:
                return '베스트 셀러';
        }
    };

    //평균 평점
    useEffect(() => {
        const fetchAverageComment = async () => {
            const q = query(collection(db, 'comment'));
            const querySnapshot = await getDocs(q);
            let comments = []
            querySnapshot.forEach((doc) => comments.push(doc.data()) );
            
            setComment(comments)
        };

        fetchAverageComment();
    }, []);

    // 로딩
    if (loading || !comment) {
        return (
            <MockupComponent>
                <div className={s.loading}>
                    <img src="/icon/loading.gif" alt="Loading..." />
                </div>
            </MockupComponent>
        );
    }

    // 상세페이지 이동
    const detailMove = (item) => {
        router.push({
            pathname: '/Detail',
            query: { itemId: item.itemId, itemTitle: item.title},
        });
    };

    // 순위 계산
    const rankItems = (item) => {
        return item.map((v, i) => ({
            ...v,
            bestRank: v.bestRank || (i + 1), 
        }));
    };
    // setCategoryTab(v)
    
    return (
        <>
        <MockupComponent>
            <Header/>
            <main>
            <div className={list.book}>
                <div className={list.bookBanner}>
                    <h2>
                        {getCategoryLabel(categoryTab)}
                    </h2>
                </div>
                <div className={list.tabContainer}>
                    {categoryItems.map((v) => (
                        <button
                            key={v}
                            className={router.query === v ? list.activeTab : list.tab}
                            onClick={() => router.push({ pathname: '/Book', query: { category: v } })}
                        >
                            <img src={`./icon/${v}.png`} alt={v}
                                className={list.tabImage} 
                            />
                        </button>
                    ))}
                </div>

                <div className={list.bookList}>
                    {mainItems[categoryTab]?.item && rankItems(mainItems[categoryTab].item).map((item) => (
                        <div key={item.itemId} onClick={() => detailMove(item)}>
                            <ContentList_card item={item} showBookmark={true} comment={comment}/>
                        </div>
                    ))}
                </div>
            </div>
            </main>
            <Footer />
            </MockupComponent>
        </>
    );
};

export default Book;

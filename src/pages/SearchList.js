import React, { useEffect, useState } from 'react'
import { ContentList_card } from '../component/contents/ContentCard'
import s from '../styles/css/page/SearchList.module.scss'
import BookStore from '../stores/BookStore';
import Header from '../component/Header';
import Footer from '../component/Footer';
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router';
import MockupComponent from '@/component/MockupComponent';
import { db } from '@/lib/firebase';
import { collection, getDocs, query } from 'firebase/firestore';

const SearchList = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { searchResults, searchApi, loading } = BookStore();
    const [keyword, setKeyword] = useState('');
    const searchKeyword = searchParams.get('k')
    const [comment, setComment] = useState();

    

    useEffect(() => {
        async function fetchData(){
                await searchApi(searchParams.get('k'))
            }
            if(searchKeyword){
                fetchData();
            }
        }, [searchKeyword]);

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
        

    const detailMove = (item) => {
        router.push({
            pathname: '/Detail',
            query: { 
                searchItemId: item.itemId,
                searchItemTitle: item.title,
                searchItemCover: item.cover,
                searchItemLogo: item.logo,
                searchItemAuthor: item.author,
                searchItemCategory: item.categoryName,
                searchItemDesc: item.description,
                searchItemPubDate: item.pubDate,
                searchItemPrice: item.priceStandard,
                searchItemPublisher: item.publisher,
                searchItemLink: item.link,
                searchItemBestRank: item.bestRank,
                searchItemCustomerReviewRank: item.customerReviewRank,
            },
        });
    };

    // 로딩
    if (!searchResults.item || !comment) {
        return (
            <MockupComponent>
                 <div className={s.loading}>
                    <img src="/icon/loading.gif" alt="Loading..." />
                </div>
            </MockupComponent>
        );
    }

    return (
        <MockupComponent>
            <Header />
                <main style={{marginTop:'80px', height:'800px'}}>
                    <div className={s.book}>
                        <div className={s.bookBanner}>
                            <h2>검색 결과</h2>
                        </div>
                        <div className={s.bookList}>
                        {searchResults.item && searchResults.item.length > 0 ? (
                            searchResults.item.map((item, idx) => (
                                <div key={item.itemId} onClick={() => detailMove(item)}>
                                    <ContentList_card item={item} showBookmark={false} comment={comment}/>
                                </div>
                            ))
                        ) : (
                            (()=>{
                                alert('검색결과가 없습니다.')
                                router.back();
                            })()
                        )
                            }
                        </div>
                    </div>
                </main>
            <Footer />
        </MockupComponent>
    )
}

export default SearchList
import React, { useEffect, useState } from 'react'
import { ContentList_card } from '../component/contents/ContentCard'
import s from '../styles/css/page/SearchList.module.scss'
import BookStore from '../stores/BookStore';
import Header from '../component/Header';
import Footer from '../component/Footer';
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router';

const SearchList = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { searchResults, searchApi, loading } = BookStore();
    const [keyword, setKeyword] = useState('');
    const searchKeyword = searchParams.get('k')

    

    useEffect(() => {
        async function fetchData(){
                await searchApi(searchParams.get('k'))
            }
            if(searchKeyword){
                fetchData();
            }
        }, [searchKeyword]);
        

    const detailMove = (item) => {
        router.push({
            pathname: '/Detail',
            query: { itemId: item.itemId },
        });
    };

    // 로딩
    if (!searchResults.item) {
        return (
            <div className={s.loading}>
                <img src="/icon/loading.gif" alt="Loading..." />
            </div>
        );
    }

    return (
        <>
            <Header />
            <div className={s.book}>
                <div className={s.bookBanner}>
                    <h2>검색 결과</h2>
                </div>

                <div className={s.bookList}>
                {searchResults.item && searchResults.item.length > 0 ? (
                    searchResults.item.map((item) => (
                        <div key={item.itemId} onClick={() => detailMove(item)}>
                            <ContentList_card item={item} showBookmark={false} />
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
            <Footer />
        </>
    )
}

export default SearchList
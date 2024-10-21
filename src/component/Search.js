import s from '@/styles/css/component/Search.module.scss'
import BookStore from '../stores/BookStore'; 
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Search = () => {

  const { searchResults, searchApi } = BookStore();
  const [keyword, setKeyword] = useState('');
  const router = useRouter();

  useEffect(() => {

  }, [searchResults]);

 

  // 검색
  const handleSearch = (e) => {
    e.preventDefault();
    searchApi(keyword);
    router.push(`/SearchList?k=${keyword}`)
  };

  return (
    <div>
        <form className={s.headerSearch} onSubmit={handleSearch}>
            <input 
              type="text" 
              name="search" 
              placeholder="도서 이름을 입력해 주세요"
              onChange={(e) => setKeyword(e.target.value)}
            />
            <span 
            className={s.searchIcon}
            style={{backgroundImage:`url(./Vector.svg)`}}></span>
        </form>
    </div>
  )
}

export default Search
import s from '@/styles/css/component/Search.module.scss'
import BookStore from '../stores/BookStore'; 
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Search = () => {
  const { searchResults, searchApi } = BookStore();
  const [keyword, setKeyword] = useState('');
  const router = useRouter();

  useEffect(() => {}, [searchResults]);

  // 검색 실행 함수
  const handleSearch = (e) => {
    e.preventDefault(); 
    if (!keyword.trim()) return; 
    searchApi(keyword);
    router.push(`/SearchList?k=${keyword}`);
  };

  return (
    <div>
      <form className={s.headerSearch} onSubmit={handleSearch}>
        <input 
          type="text" 
          name="search" 
          placeholder="도서 이름을 입력해 주세요"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <span 
          className={s.searchIcon}
          style={{ backgroundImage: `url(./Vector.svg)` }}
          onClick={handleSearch}
          role="button" 
          tabIndex={0} 
        ></span>
      </form>
    </div>
  );
};

export default Search;

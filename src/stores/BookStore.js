import {create} from 'zustand';
import axios from 'axios';

const instant = axios.create({
  baseURL: '/api', 
});

// 스토어
const BookStore = create((set) => ({
  // 메인 데이터
  mainItems: {
    ItemNewAll: { item: [] },        // 초기값 설정
    Bestseller: { item: [] },        // 초기값 설정
    BlogBest: { item: [] },          // 초기값 설정
    ItemEditorChoice: { item: [] }   // 초기값 설정
  },      

  // 카테고리 데이터
  category: {
    ItemNewAll: { item: [] },        
    Bestseller: { item: [] },      
    BlogBest: { item: [] },          
    ItemEditorChoice: { item: [] }   
  },

  // 리스트 데이터
  items: [],         // 리스트 데이터
  searchResults: [], // 검색 결과
  loading: true,    // 로딩 상태
  cateLoading: true, // 편집자 추천(카테고리) 로딩 상태
  searchLoading: true, // 검색 로딩 상태
  error:'',

  // List Api 요청
  itemApi: async (type, categoryId, Cover = 'Big') => {
    const loadingKey = type === 'cate' ? 'cateLoading' : 'loading';
    set({ [loadingKey]: true, error: null });
    try {
      const response = await instant.get('/yes24', {
        params: { type , categoryId, Cover }
      });
      if(type==='main'){
        set({ mainItems: response.data, loading: false });
      }else if(type==='cate'){
        set({ category: response.data, cateLoading: false });
      }else{
        set({ items: response.data.item, loading: false });
      }

    } catch (error) {
      set({ error: error, [loadingKey]: false });
    }
  },

  // Search API 요청
  searchApi: async (keyword) => {
    set({ searchLoading: true, error: null });
    try {
      const response = await instant.get('/yes24', {
        params: { type:'search', Query: keyword}
      });
      set({ searchResults: response.data, searchLoading: false });
    } catch (error) {
      set({ error: '에러', searchLoading: false });
    }
  },

 
}));

export default BookStore;
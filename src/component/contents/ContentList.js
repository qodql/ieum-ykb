import React, { useEffect, useState } from 'react'
import { ContentCard1, ContentCard2, ContentCard3 } from './ContentCard'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules'; 
import 'swiper/css';
import 'swiper/css/pagination';
import s from '@/styles/css/component/content/contentList.module.scss'
import BookStore from '../../stores/BookStore';
import { useRouter } from 'next/router';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const BannerBox = (props) => {
  const router = useRouter();
  const [likeCounts, setLikeCounts] = useState({});

  // 상세페이지 이동
  const detailMove = (item) => {
    router.push({
      pathname: '/Detail',
      query: { itemId: item.itemId, itemTitle: item.title },
    });
  };

  // 각 책의 좋아요 수 가져오기 (실시간 업데이트)
  useEffect(() => {
    const fetchLikeCounts = () => {
      props.mainItems.Bestseller.item.forEach((item) => {
        const q = query(collection(db, "readwantlist"), where("bookid", "==", item.itemId));

        // 실시간으로 좋아요 수 감지
        const unsubscribe = onSnapshot(q, (snapshot) => {
          setLikeCounts((prev) => ({
            ...prev,
            [item.itemId]: snapshot.size, // 해당 책의 좋아요 수 저장
          }));
        });

        return unsubscribe;
      });
    };

    if (props.mainItems?.Bestseller?.item) {
      fetchLikeCounts();
    }
  }, [props.mainItems]);

  return (
    <Swiper
      modules={[Pagination, Autoplay]}
      pagination={{
        type: "fraction",
        el: '.swiper-pagination'
      }}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false
      }}
      slidesPerView={'1'}
      spaceBetween={50}
      className={`${s.banner} mySwiper`}>
      {props.mainItems.Bestseller.item.slice(0, 3).map((idx) => (
        <SwiperSlide className={s.bannerBox} key={idx.itemId} onClick={() => detailMove(idx)}>
          <div className={s.bannerImg} style={{ backgroundImage: `url(${idx.cover})` }}>
          </div>
          <div className={s.bannerText}>
            <div className={s.bannerTitle}>
              <h2>{idx.title}</h2>
              <p>{idx.author}</p>
            </div>
            <div className={s.bannerOverview}>
              <p>{idx.description}</p>
            </div>
            <div className={s.bannerBot}>
              <img src="/Like.png" alt="like" className={s.likeIcon} />
              <p>{likeCounts[idx.itemId] || 0}</p>
            </div>
          </div>
        </SwiperSlide>
      ))}
      <div className="swiper-pagination"></div>
    </Swiper>
  )
}

const ContentListMain1 = (props) => {
  
  const router = useRouter();
  const detailMove = (item) => {
    router.push({
        pathname: '/Detail',
        query: { itemId: item.itemId, itemTitle: item.title },
    });
  };

  return (
    <Swiper
    slidesPerView={'3'}
    spaceBetween={50}
    className={`${s.content1} mySwiper`}>
      {
        props.mainItems.BlogBest.item.slice(0,7).map((item)=>
        <SwiperSlide key={item.itemId} onClick={() => detailMove(item)}>
          <ContentCard1 item={item}/>
        </SwiperSlide>
        )
      }
    </Swiper>
  )
}

const ContentListMain2 = (props) => {
  const router = useRouter();
  const detailMove = (item, cate) => {
    router.push({
        pathname: '/Detail',
        query: { itemId: item.itemId, itemTitle: item.title},
    });
  };


  return (
    <Swiper
    slidesPerView={'2'}
    spaceBetween={16}
    className={` ${s.content2} mySwiper`}>
      {
        props.mainItems.ItemNewAll.item.slice(0,8).map((item)=>
          <SwiperSlide key={item.itemId} onClick={() => detailMove(item)}>
            <ContentCard2 item={item}/>
          </SwiperSlide>
        )
      }                 
    </Swiper>
  )
}

const ContentListMain3 = (props) => {


  const router = useRouter();
  const detailMove = (item,mainCateNum) => {
    router.push({
        pathname: '/Detail',
        query: { itemId: item.itemId, mainCateNum: mainCateNum, itemTitle: item.title  },
    });
  };

  const {category, itemApi, loading} = BookStore();

  useEffect( () => {
    
    const coverSize = 'Big'; 
    async function fetchData(){
      await itemApi('cate', props.cate, coverSize);
    }
    if(props.cate){
        fetchData();
    }
  }, [props.cate]);
  
  const mainCateNum = props.cate

  // 로딩
  if (loading || !category.ItemEditorChoice.item) {
    return (
        <div className={s.loading}>
            <img src="/icon/loading.gif" alt="Loading..." />
        </div>
    );
  }

  return (
    <Swiper 
    slidesPerView={'3'}
    spaceBetween={100}
    className={`${s.content3} mySwiper`}>
      {
        category.ItemEditorChoice.item.slice(0,7).map((item)=>
          <SwiperSlide key={item.itemId} onClick={() => detailMove(item, mainCateNum)}>
            <ContentCard3 item={item}/>
          </SwiperSlide>
        )
      }
    </Swiper>
  )
}


export {ContentListMain1, ContentListMain2, ContentListMain3, BannerBox}

import React from 'react';
import s from '@/styles/css/component/skeleton.module.scss';

// 메인 - 분야별 추천 카드 스켈레톤
export const SkeletonCardRow = ({ count = 3 }) => (
    <div className={s.cardRow} aria-busy="true" aria-label="도서 목록을 불러오는 중">
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className={s.card3}>
                <span className={`${s.bone} ${s.card3Image}`} />
                <span className={`${s.bone} ${s.card3Title}`} />
                <span className={`${s.bone} ${s.card3Author}`} />
            </div>
        ))}
    </div>
);

// 목록/검색 페이지 카드 스켈레톤
export const SkeletonList = ({ count = 6 }) => (
    <div aria-busy="true" aria-label="도서 목록을 불러오는 중">
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className={s.listCard}>
                <span className={`${s.bone} ${s.listImage}`} />
                <div className={s.listText}>
                    <span className={`${s.bone} ${s.listTitle}`} />
                    <span className={`${s.bone} ${s.listAuthor}`} />
                    <span className={`${s.bone} ${s.listCategory}`} />
                    <span className={`${s.bone} ${s.listRate}`} />
                </div>
            </div>
        ))}
    </div>
);

// 메인 페이지 전체 스켈레톤 (배너 + 섹션 3개)
export const SkeletonMain = () => (
    <div aria-busy="true" aria-label="메인 화면을 불러오는 중">
        <div className={s.banner}>
            <span className={`${s.bone} ${s.bannerImg}`} />
            <div className={s.bannerText}>
                <span className={`${s.bone} ${s.bannerLine}`} />
                <span className={`${s.bone} ${s.bannerLineShort}`} />
            </div>
        </div>

        <span className={`${s.bone} ${s.sectionTitle}`} />
        <div className={s.cardRow}>
            {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} className={`${s.bone} ${s.card1}`} />
            ))}
        </div>

        <span className={`${s.bone} ${s.sectionTitle}`} />
        <div className={s.cardRow}>
            {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className={s.card2}>
                    <span className={`${s.bone} ${s.card2Image}`} />
                    <span className={`${s.bone} ${s.card2Line}`} />
                    <span className={`${s.bone} ${s.card2Line}`} />
                </div>
            ))}
        </div>

        <span className={`${s.bone} ${s.sectionTitle}`} />
        <div className={s.tabRow}>
            {Array.from({ length: 6 }).map((_, i) => (
                <span key={i} className={`${s.bone} ${s.tab}`} />
            ))}
        </div>
        <SkeletonCardRow count={3} />
    </div>
);

import React from 'react';
import s from '@/styles/css/page/main.module.scss';

const loadingScreen = ({ loadingfadeOut }) => {
    return (
        <div className={`${s.loadingScreen} ${loadingfadeOut ? scrollTo.loadingfadeOut : ''}`}>
            <img src="/IEUMLOGO_white.svg" alt="로고" style={{ width: '120px' }} />
        </div>
    );
};

export default loadingScreen;

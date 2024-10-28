import React from 'react';
import s from '@/styles/css/page/main.module.scss';
import MockupComponent from './MockupComponent';

const loadingScreen = ({ loadingfadeOut }) => {
    return (
        <MockupComponent>
            <main style={{marginTop:'20px', height:'860px', borderRadius:'6px',overflow:'hidden'}}>
                <div className={`${s.loadingScreen} ${loadingfadeOut ? scrollTo.loadingfadeOut : ''}`}>
                    <img src="/IEUMLOGO_white.svg" alt="로고" style={{ width: '120px' }} />
                </div>
            </main>
        </MockupComponent>
    );
};

export default loadingScreen;

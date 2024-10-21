import React, { useCallback, useEffect, useState } from 'react';
import s from '@/styles/css/component/header.module.scss';
import Search from './Search';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Header = () => {
    const [position, setPosition] = useState(0);
    const [visible, setVisible] = useState(true);
    const router = useRouter();

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [position]);

    const handleScroll = useCallback(() => {
        const moving = window.scrollY;
        setVisible(moving < 100 ? true : false); 
        setPosition(moving);
    }, [position]);
    

    return (
        <header>
            <div className={!visible ? `${s.header1} ${s.header1Act}` : `${s.header1}`}>
                <Link href="/" className={s.headerLogo} style={{ backgroundImage: `url(./IEUMLOGO.png)` }} />
                <Search />
            </div>
            <ul className={!visible ? `${s.header2} ${s.header2Active}` : `${s.header2}`}>
                <li className={s.header2Li}>
                    <Link href="/" className={`${router.pathname === '/' ? s.activeLink : ''}`}>
                        홈
                    </Link>
                </li>
                <li className={s.header2Li}>
                    <Link href={{ pathname: '/Book', query: { category: 'Bestseller' } }} className={`${router.pathname === '/Book' && router.query.category === 'Bestseller' ? s.activeLink : ''}`}>
                        베스트
                    </Link>
                </li>
                <li className={s.header2Li}>
                    <Link href={{ pathname: '/Book', query: { category: 'ItemNewAll' } }} className={`${router.pathname === '/Book' && router.query.category === 'ItemNewAll' ? s.activeLink : ''}`}>
                        신간
                    </Link>
                </li>
                <li className={s.header2Li}>
                    <Link href={{ pathname: '/Book', query: { category: 'BlogBest' } }} className={`${router.pathname === '/Book' && router.query.category === 'BlogBest' ? s.activeLink : ''}`}>
                        추천도서
                    </Link>
                </li>
            </ul>
        </header>
    );
};

export default Header;

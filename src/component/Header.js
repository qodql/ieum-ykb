import React, { useCallback, useEffect, useState } from 'react';
import s from '@/styles/css/component/header.module.scss';
import Search from './Search';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Header = () => {
    const router = useRouter();

    return (
        <header>
            <div className={`${s.header1}`}>
                <Link href="/" className={s.headerLogo} style={{ backgroundImage: `url(./IEUMLOGO.png)` }} />
                <Search />
            </div>
            <ul className={`${s.header2}`}>
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

import React from 'react';
import s from '@/styles/css/page/main.module.scss';

const Modal = ({ isModalOpen, shareClose, copyLink }) => {
    if (!isModalOpen) return null;

    return (
        <div className={s.modalOverlay} onClick={shareClose}>
            <div className={`${s.modalContent} ${isModalOpen ? s.open : ''}`} onClick={(e) => e.stopPropagation()}>
                <h3>공유하기</h3>
                <ul>
                    <li onClick={copyLink}>링크 복사</li>
                    <li>
                        <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer">
                            트위터로 공유
                        </a>
                    </li>
                    {/* <li>
                        <a href={`https://talk.kakao.com/share?url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer">
                            카카오톡으로 공유
                        </a>
                    </li> */}
                </ul>
                <button onClick={shareClose}>닫기</button>
            </div>
        </div>
    );
};

export default Modal;

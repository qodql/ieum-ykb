import React from 'react'
import s from '@/styles/css/component/content/contentCard.module.scss'


const ContentCard1 = (props) => {
    return (
        <div className={s.contentCard1}>
            <span className={s.bookmark} style={{backgroundImage:`url(./bookmark.png)`}}>{props.item.bestRank}</span>
            <div className={s.contentCard1_image} style={{backgroundImage:`url(${props.item.cover})`}}></div>
        </div>
    )
}

const ContentCard2 = (props) => {
    return (
        <div className={s.contentCard2}>
            <div className={s.contentCard2_image} style={{backgroundImage:`url(${props.item.cover})`}}></div>
            <p className={s.contentCard2_category}>{props.item.categoryName}</p>
            <p className={s.contentCard2_title}>{props.item.title}</p>
            <p className={s.contentCard2_author}>{props.item.author}</p>
        </div>
    )
}

const ContentCard3 = (props) => {
    return (
        <div className={s.contentCard3}>
            <div className={s.contentCard3_image} style={{backgroundImage:`url(${props.item.cover})`}}></div>
            <p className={s.contentCard3_title}>{props.item.title}</p>
            <p className={s.contentCard3_author}>{props.item.author}</p>
        </div>
    )
}

const CommentCard = () => {
    return (
        <div className={s.comment}>
            <div className={s.profile}>
            <span style={{backgroundImage:`url(./image16.png)`}}></span>
            <div className={s.profile_text}>
                <p className={s.name}>지적 호기심</p>
                <p className={s.date}>2024-10-22</p>
            </div>
            </div>
            <div className={s.commentCard}>
                <div className={s.commentCard_img} style={{backgroundImage:`url(./image2.png)`}}></div>
                <div className={s.commentCard_text}>
                    <p className={s.commentCard_title}>시대예보: 호명사회</p>
                    <div className={s.commentCard_rate}>★★★★☆</div>
                    <p className={s.commentCard_review}>송길영 작가님은 책도 영상도 지금 곧바로 읽고 봐야하는 필독서! 특히 이해되지 않거나 공감되지 않는 부분이 있다면 그냥 넘어가기보다...</p>
                </div>
            </div>
        </div>
    )
}


const ContentList_card = ({item, showBookmark }) => {
    return (
        <div className={s.ContentList_card}>
            <div className={s.ContentList_card_main}>
                <div className={s.ContentList_card_img}>
                {showBookmark && (
                        <span className={s.ContentList_card_bookmark} style={{ backgroundImage: `url(./bookmark.png)` }}>
                            {item.bestRank}
                        </span>
                    )}
                    <div className={s.ContentList_card_mainImg} style={{ backgroundImage: `url(${item.cover})` }}></div>
                </div>
                <div className={s.ContentList_card_text}>
                    <h2 className={s.ContentList_card_title}>
                        {item.title}
                    </h2>
                    <p className={s.ContentList_card_auther}>
                        {item.author}
                    </p>
                    <p className={s.ContentList_card_rateTitle}>
                    책이음 평점
                    </p>
                    <p className={s.ContentList_card_rate}>
                    ★★★★☆ 4.0
                    </p>
                </div>
            </div>
            <div className={s.ContentList_card_foot}>
                <p className={s.ContentList_card_Like}>
                </p>
                <p className={s.ContentList_card_category}>
                    {item.categoryName}
                </p>
            </div>
        </div>
    )
}

//Mypage contentsCard
const MypageCard = (props) => {

    return (
        <div className={s.MypageCard}>
            <div className={s.MypageCard_box}>
                <div className={s.MypageCard_image} style={{backgroundImage:`url(${props.item.cover})`}}></div>
            </div>
            <p className={s.MypageCard_title}>{props.item.title}</p>
        </div>
    )
}

//Mypage2 contentsCard
const MypageCard2 = (props) => {

    return (
        <div className={s.MypageCard}>
            <div className={s.MypageCard_box}>
                <div className={s.MypageCard_image} style={{backgroundImage:`url(${props.item.cover})`}}></div>
            </div>
            <p className={s.MypageCard_title}>{props.item.title}</p>
        </div>
    )
}

//Mypage commentCard
const MypageComment = (props) => {
    return (
        <div className={s.MypageComment}>
            <div className={s.MypageComment_img} style={{backgroundImage:`url(${props.item.cover})`}}></div>
            <div className={s.MypageComment_text}>
                <p className={s.MypageComment_date}>
                    {props.item.Creationdate}
                </p>
                <h2 className={s.MypageComment_title}>
                    {props.item.title}
                </h2>
                <p className={s.MypageComment_rate}>
                    ★★★★☆
                </p>
                <p className={s.MypageComment_review}>
                    {props.item.comment}
                </p>
            </div>
            <span className={s.MypageComment_more} style={{backgroundImage:`url(/more.png)`}}></span>        
        </div>
    )
}


export {ContentCard1, ContentCard2, ContentCard3, CommentCard, ContentList_card, MypageCard, MypageComment, MypageCard2}
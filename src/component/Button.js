import React from 'react'
import s from '@/styles/css/component/button.module.scss'
import Link from 'next/link'

const ButtonAll = ({ category }) => {
  return (
    <Link href={{ pathname: '/Book', query: { category } }}>
      <button>전체보기</button>
    </Link>
  )
}

const ButtonArrow = () => {
    return(
        <Link href="../CommentList">
          <button className={s.contentTitle4_btn}></button>
        </Link>
    )
}

const ButtonArrowBack = ()=>{
  return(
    <button className={s.buttonArrowBack}></button>
  )
}

export {ButtonAll, ButtonArrow,ButtonArrowBack}
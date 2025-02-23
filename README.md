<div align="left">

<!-- logo -->
<p><img src="https://github.com/qodql/ieum-ykb/blob/main/public/IEUMLOGO.svg" width="200" height="130"/></p>
<img src="https://github.com/qodql/ieum-ykb/blob/main/public/readme/icon-project-html.svg"/>
<img src="https://github.com/qodql/ieum-ykb/blob/main/public/readme/icon-project-css.svg"/>
<img src="https://github.com/qodql/ieum-ykb/blob/main/public/readme/icon-project-sass.svg"/>
<img src="https://github.com/qodql/ieum-ykb/blob/main/public/readme/icon-project-figma.svg"/>
<img src="https://github.com/qodql/ieum-ykb/blob/main/public/readme/icon-project-swiper.svg"/>
<img src="https://github.com/qodql/ieum-ykb/blob/main/public/readme/icon-project-mui2.svg"/>
<img src="https://github.com/qodql/ieum-ykb/blob/main/public/readme/icon-project-js.svg"/>
<img src="https://github.com/qodql/ieum-ykb/blob/main/public/readme/icon-project-next.svg"/>
<img src="https://github.com/qodql/ieum-ykb/blob/main/public/readme/icon-project-react.svg"/>
<img src="https://github.com/qodql/ieum-ykb/blob/main/public/readme/icon-project-firebase.svg"/>
<img src="https://github.com/qodql/ieum-ykb/blob/main/public/readme/icon-project-firestore.svg"/>
<img src="https://github.com/qodql/ieum-ykb/blob/main/public/readme/icon-project-zustand.svg"/>
<img src="https://github.com/qodql/ieum-ykb/blob/main/public/readme/icon-project-vercel.svg"/>
<img src="https://github.com/qodql/ieum-ykb/blob/main/public/readme/icon-project-git.svg"/>
</div> 

## 📝 프로젝트 소개
IEUM은 독서 활동을 기록하고 원하는 도서 검색 및 책에 대한<br />
의견을 공유할 수 있는 도서리뷰 웹 애플리케이션입니다.
<br />
<br />
Next.js와 Firebase를 활용해 사용자 인증 및 데이터 저장 기능을 구현했으며, <br />
React와 SCSS로 사용자가 쉽게 탐색할 수 있도록 깔끔한 UI/UX를 설계했습니다.<br />

## 🗓 프로젝트 일정
**총 일정 2024.10.4 ~ 2024.10.27(24일), 3인**
<br /><br />
10.4 ~ 10.8 주제선정 및 기획
<br />
10.8 ~ 10.11 디자인 및 화면 구성
<br />
10.12 ~ 10.22 프로젝트 진행
<br />
10.23 ~ 10.27 점검 및 오류 수정

## 🔗 배포 URL
<a href="https://book-ieum.vercel.app/" target="_blank">https://book-ieum.vercel.app/</a>
<br />

## 💁‍♂️ 프로젝트 팀원
<table>
    <tr>
        <th>이름</th>
        <th>Github</th>
        <th>직무</th>
    </tr>
    <tr>
        <td>강민현</td>
        <td><a href="https://github.com/minhyun-k">minhyun-k</a></td>
        <td>팀장, 데이터</td>
    </tr>
     <tr>
        <td>윤경빈</td>
        <td><a href="https://github.com/qodql">qodql</a></td>
        <td>배포, API, 디자인</td>
    </tr>
    <tr>
        <td>이홍영</td>
        <td><a href="https://github.com/Infouse">Infouse</a></td>
        <td>기능 개발</td>
    </tr>
</table>

## 🖥 화면 구성
<img src="https://github.com/qodql/ieum-ykb/blob/main/public/readme/img-project02.jpg" width="680">

## ⚙ 기술 스택
이 프로젝트는 다양한 최신 기술을 활용하여 구현되었습니다.

- **NEXT**: 프론트엔드 프레임워크, 컴포넌트 기반 UI를 구현
- **Zustand**: 애플리케이션 상태 관리
- **Axios**: API 통신을 위한 HTTP 클라이언트
- **SASS**: CSS 방식으로 컴포넌트 스타일링
- **Vercel**: 배포 플랫폼 (배포 사이트: [https://book-ieum.vercel.app/](https://book-ieum.vercel.app/))
- **GitHub**: 버전 관리 및 협업 도구
<br />

## 🛠 주요 기능 및 특징
1. **서비스 접속 초기화면**: 접속 시 splash 화면이 나타난 뒤, 본 페이지가 로드됩니다.

2. **홈 화면**:
   - 홈 화면은 4가지 도서 리스트로 구성되어 있으며, 각 리스트는 알라딘 api 서버 요청을 통해 다른 데이터베이스 없이 직접 요청으로 불러와 각 목록에 적합한 데이터를 출력하도록 했으며, 각각의 리스트는 스와이퍼 기능을 제공합니다.
   - 베스트셀러 및 블로거 추천 도서 목록은 각 순위가 표시됩니다.
   - 신간 도서는 일정 시간이 지나면 자동으로 업데이트되어 새로운 책이 표시됩니다.
   - 편집자 추천 리스트는 **탭버튼**을 사용하여 카테고리별로 책을 추천합니다.
   - **Firebase**를 이용하여 저장된 코멘트 중 일부가 랜덤으로 출력됩니다.

3. **도서 목록 페이지**:
   - 화면 상단의 **탭버튼**이나 **'전체보기'** 버튼을 클릭하면 도서 목록 페이지로 이동합니다.
   - 각 도서 목록은 제목, 저자, 별점 정보와 함께 출력되며, 평점이 없는 경우 '평점 없음'이라는 표시가 나타납니다.

4. **도서 상세 페이지**:
   - 사용자가 도서 제목이나 이미지를 클릭하면 도서의 상세 정보를 확인할 수 있는 페이지로 이동합니다.
   - 상세페이지는 도서의 정보, 베스트셀러 및 신간 표시, 북마크 및 코멘트 기능을 제공합니다.
   - 신간 도서는 출판일 기준으로 3주 전부터 2주 후까지 '신간'으로 표시됩니다.
   - **Firebase**를 이용해 북마크 및 코멘트 기능을 구현하였으며, 비로그인 상태에서는 로그인 안내 메시지가 표시됩니다.

5. **검색 기능**:
   - 상단에 고정된 검색창을 통해 사용자가 원하는 책을 검색할 수 있습니다.
   - 검색어 입력 후, 검색 결과 페이지로 이동합니다.

6. **로그인 기능**:
   - 사용자는 **네이버**, **깃허브**, **구글 로그인** 및 **직접 회원가입**을 통해 로그인할 수 있습니다.
   - 로그인 시 **마이페이지**로 이동하여 북마크 및 코멘트 목록을 확인하고, 회원 정보를 수정할 수 있습니다.
<br />

## 🤔 기술적 이슈와 해결 과정

### 1. **홈 화면 편집자 추천 리스트 탭버튼 클릭 시 전체 페이지 재랜더링 발생**

 - 문제: 탭 버튼을 클릭할 때마다 전체 페이지가 다시 랜더링되어 불필요한 서버 요청이 발생했습니다.

 -  해결: 탭버튼을 사용하는 **편집자 추천 리스트**는 별도로 컴포넌트를 분리하여 해당 컴포넌트만 부분 렌더링되도록 최적화했습니다. 또한, 컴포넌트의 데이터 요청과 홈 화면의 데이터 요청이 맞물려 무한루프가 발생한 문제를 해결하기 위해, 로딩 화면을 추가하여 데이터가 로드되기 전까지 로딩을 표시하도록 처리했습니다.

### 2. **서비스 이용 중 홈 화면으로 돌아갈 때마다 로딩 splash 화면 반복 노출**

 - 문제: 홈 화면으로 돌아갈 때마다 splash 화면이 반복적으로 나타났습니다.

 - 해결: 홈 화면으로 돌아갈 때, 이미 필요한 데이터가 로드된 상태에서는 다시 로딩 화면이 표시되지 않도록 조건문을 추가했습니다. 이를 통해 불필요한 로딩 화면을 방지했습니다.

### 3. **검색 및 리스트 페이지에서 요청하는 데이터가 달라 상세페이지 오류 발생**

 - 문제: 검색을 통해 요청하는 데이터와 리스트 페이지에서 요청하는 데이터가 달라, 상세페이지에서 오류가 발생했습니다.

 - 해결: 검색 결과 페이지와 리스트 페이지에서 각각 다른 API 요청을 하도록 수정했습니다. **router.query** 값을 사용해 각 페이지의 요청을 조건별로 처리하고, 각 페이지에 맞는 데이터를 정확하게 반환하도록 수정하여 상세페이지 오류를 해결했습니다.

### 3. **홈 화면 각 리스트 별 데이터 요청이 서로 달라 무한 랜더링 발생**

 - 문제: 카테고리별 리스트를 출력할 때, 컴포넌트를 이용하여 다른 서버요청 실행으로 인해 홈 화면의 서버요청이 반복되어 무한 랜더링이 발생하였습니다.

 - 해결: 랜더링을 실행할 때, 서로 다른 전역 변수에 저장하는 방법을 사용하여 서버요청으로 인한 전역변수의 변화가 서로 다르게 하여 반복적인 서버요청을 하지 않도록 해결했습니다.
<br />

##  :file_folder: 폴더 구조
<pre class="notranslate">
<code>
📦BOOK-IEUM
 ┣ 📂public                  # 이미지, 폰트, 아이콘 등 정적 자원
 ┃ ┣ 📂icons                 # 로고 이미지
 ┣ 📂src                     # 소스 코드 디렉토리
 ┃ ┣ 📂components            # 컴포넌트 폴더
 ┃ ┣ 📂lib
 ┃ ┃ ┗ 📜firebase.js         # DB
 ┃ ┣ 📂pages                 # 페이지 폴더
 ┃ ┃ ┣ 📂api                 # api 관련 파일(데이터 및 서버)
 ┃ ┃ ┃ ┣ 📂auth
 ┃ ┃ ┃ ┃ ┗ 📜[...nextauth].js   # 로그인 관련 (Next Auth)
 ┃ ┃ ┃ ┣ 📜aladin.js            # 알라딘 API
 ┃ ┣ 📂store                 # 전역 상태 관리
 ┃ ┃ ┣ 📜aladin.js           # zustand 사용 상태관리
 ┃ ┣ 📂styles                # scss
 ┣ 📜.env                    # 민감한 정보나 환경 변수를 안전하게 관리
 ┗ 📜README.md
 </code>
 </pre>






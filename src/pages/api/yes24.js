import axios from "axios";

/**
 * YES24 Open API 프록시
 * - API 키는 서버(.env.local)에만 두고 브라우저에는 노출하지 않습니다.
 * - 응답은 기존 알라딘 형태({ item: [...] }, pubDate, priceStandard ...)로 변환해서
 *   기존 컴포넌트를 거의 수정하지 않고 쓸 수 있게 합니다.
 * 문서: https://developers.yes24.com/docs
 */

const yes24 = axios.create({
  baseURL: "https://apis.yes24.com/v1",
  headers: { "X-Api-Key": process.env.YES24_API_KEY },
  timeout: 8000,
});

const ROOT_CATEGORY = "001"; // 국내도서

// 기존 화면의 리스트 키 → YES24 엔드포인트
const LIST_ENDPOINTS = {
  Bestseller: "/category/bestseller",              // 베스트
  ItemNewAll: "/category/newproduct",              // 신간
  BlogBest: "/category/bestsellerSteady",          // 추천도서 → 스테디셀러
  ItemEditorChoice: "/category/newproductAttention", // 편집자 추천 → 주목할 신상품
};
const RANKED_LISTS = ["Bestseller", "BlogBest"];

// Main.js 의 알라딘 카테고리 번호 → YES24 카테고리 이름 키워드
// (YES24 카테고리 코드는 /v1/category/list 에서 자동으로 찾아옵니다)
const ALADIN_CATEGORY_KEYWORDS = {
  "1": "소설",          // 문학
  "170": "경제",        // 경제
  "2556": "추리",       // 추리
  "55889": "종교",      // 종교
  "8516": "에세이",     // 에세이
  "4132": "판타지",     // 판타지
};

// ---------- 카테고리 ----------
let categoryCache = null; // { list, fetchedAt }
const CATEGORY_TTL = 1000 * 60 * 60 * 24;

async function getCategoryList() {
  if (categoryCache && Date.now() - categoryCache.fetchedAt < CATEGORY_TTL) {
    return categoryCache.list;
  }
  const { data } = await yes24.get("/category/list");
  const list = data?.data?.data ?? [];
  categoryCache = { list, fetchedAt: Date.now() };
  return list;
}

const normalize = (s = "") => s.replace(/[\s/·,]/g, "");

async function resolveCategory(categoryId) {
  const id = categoryId ? String(categoryId) : "";
  const keyword = ALADIN_CATEGORY_KEYWORDS[id];

  if (keyword) {
    try {
      const list = await getCategoryList();
      const match = list
        .filter((c) => (c.categoryFullPath ?? "").startsWith("국내도서"))
        .filter((c) => normalize(c.categoryName).includes(normalize(keyword)))
        .sort((a, b) => a.categoryId.length - b.categoryId.length)[0];
      if (match) return { id: match.categoryId, name: match.categoryName };
    } catch (e) {
      console.error("[yes24] 카테고리 목록 조회 실패:", e.message);
    }
    return { id: ROOT_CATEGORY, name: "" };
  }

  // 이미 YES24 코드(예: 001001046)를 넘긴 경우 그대로 사용
  if (/^0\d{2,}$/.test(id)) return { id, name: "" };

  return { id: ROOT_CATEGORY, name: "" };
}

// ---------- 응답 변환 (YES24 → 알라딘 형태) ----------
const stripHtml = (s) =>
  (s ?? "").replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();

function toAladinItem(item, { categoryName = "", ranked = false } = {}) {
  return {
    itemId: item.itemId,
    title: item.title,
    subTitle: item.subTitle ?? "",
    author: item.author,
    publisher: item.publisher,
    pubDate: item.publishDate,
    cover: item.cover,
    link: item.link,
    isbn: item.isbn10,
    isbn13: item.isbn13,
    priceStandard: item.shopPrice,
    priceSales: item.salePrice,
    description: stripHtml(item.contentDetail?.bookIntroduction),
    categoryName: categoryName || item.goodsType || "",
    customerReviewRank: item.starScore ?? 0, // 알라딘과 같은 0~10 점수
    bestRank: ranked ? item.sortOrder : undefined,
    adult: item.adultYn === "Y",
    pages: item.pages ?? null,
  };
}

const wrap = (items, opts) => ({ item: (items ?? []).map((i) => toAladinItem(i, opts)) });

// ---------- 호출 ----------
async function fetchList(key, category, pageSize) {
  const endpoint = LIST_ENDPOINTS[key];
  try {
    const { data } = await yes24.get(endpoint, {
      params: { categoryId: category.id, pageSize, detail: "Y" },
    });
    return wrap(data?.data?.items, { categoryName: category.name, ranked: RANKED_LISTS.includes(key) });
  } catch (e) {
    // 404 (결과 없음)는 빈 목록으로 처리
    if (e.response?.status === 404) return { item: [] };
    throw e;
  }
}

async function mainItems(res, categoryId) {
  const category = await resolveCategory(categoryId);
  const keys = Object.keys(LIST_ENDPOINTS);
  const results = await Promise.allSettled(keys.map((k) => fetchList(k, category, 10)));

  const body = {};
  keys.forEach((k, i) => {
    body[k] = results[i].status === "fulfilled" ? results[i].value : { item: [] };
    if (results[i].status === "rejected") console.error(`[yes24] ${k} 실패:`, results[i].reason?.message);
  });

  // 주목할 신상품이 비어 있으면 해당 분야 베스트셀러로 대체
  if (!body.ItemEditorChoice.item.length) body.ItemEditorChoice = body.Bestseller;

  res.status(200).json(body);
}

async function listItems(res, type, categoryId) {
  if (!LIST_ENDPOINTS[type]) return res.status(400).json({ message: `알 수 없는 type: ${type}` });
  const category = await resolveCategory(categoryId);
  res.status(200).json(await fetchList(type, category, 20));
}

async function searchItems(res, query) {
  if (!query) return res.status(200).json({ item: [] });
  try {
    const { data } = await yes24.get("/goods/itemList", {
      params: { query, category: "BOOK", pageSize: 20, detail: "Y" },
    });
    res.status(200).json(wrap(data?.data?.items));
  } catch (e) {
    if (e.response?.status === 404) return res.status(200).json({ item: [] }); // 검색 결과 없음
    throw e;
  }
}

// 디버깅용: /api/yes24?type=categories 로 YES24 카테고리 코드 확인
async function categories(res) {
  res.status(200).json(await getCategoryList());
}

export default async function handler(req, res) {
  if (!process.env.YES24_API_KEY) {
    return res.status(500).json({ message: "YES24_API_KEY 환경변수가 설정되지 않았습니다." });
  }

  const { type, categoryId, Query } = req.query;

  try {
    switch (type) {
      case "main":
      case "cate":
        return await mainItems(res, categoryId);
      case "search":
        return await searchItems(res, Query);
      case "categories":
        return await categories(res);
      default:
        return await listItems(res, type, categoryId);
    }
  } catch (e) {
    const status = e.response?.status ?? 500;
    const code = e.response?.data?.errorCode;
    console.error("[yes24] API 오류:", status, code, e.message);
    res.status(status).json({ message: e.response?.data?.message ?? "YES24 API 호출 실패", errorCode: code });
  }
}

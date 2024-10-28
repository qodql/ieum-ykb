import axios from "axios";

const instant = axios.create({
  baseURL: 'http://www.aladin.co.kr/ttb/api', 
  params: {
    ttbkey: 'ttbhongyeong5751628001',
    MaxResults: 10,
    start: 1,
    SearchTarget: 'Book',
    output: 'js',
    Version: '20131101',
  }
});

//Main
async function mainItems(res, categoryId, Cover) {
  try {
    let [ItemNewAll, Bestseller, BlogBest, ItemEditorChoice] = await Promise.all([
      instant(`/ItemList.aspx?QueryType=ItemNewAll&categoryId=${categoryId}&Cover=${Cover}`),
      instant(`/ItemList.aspx?QueryType=Bestseller&categoryId=${categoryId}&Cover=${Cover}`),
      instant(`/ItemList.aspx?QueryType=BlogBest&categoryId=${categoryId}&Cover=${Cover}`),
      instant(`/ItemList.aspx?QueryType=ItemEditorChoice&categoryId=${categoryId}&Cover=${Cover}`)
    ]);
    
    ItemNewAll = ItemNewAll.data;
    Bestseller = Bestseller.data;
    BlogBest = BlogBest.data;
    ItemEditorChoice = ItemEditorChoice.data;
    
    res.status(200).json({ItemNewAll, Bestseller, BlogBest, ItemEditorChoice});
  } catch(error) {
    throw new Error(`Error. Status: ${error}`);
  }
}

//List
async function listItems(res, type, categoryId, Cover) {
  try {
    const response = await instant(`/ItemList.aspx?QueryType=${type}&categoryId=${categoryId}&Cover=${Cover}`);
    const data = response.data;
    res.status(200).json(data);
  }catch(error) {
    throw new Error(`Error. Status: ${error}`);
  }
}

//Search
async function searchItems(res, Query) {
  try {
    const response = await instant(`/ItemSearch.aspx?&Query=${Query}`);
    const data = response.data;
    res.status(200).json(data);
  }catch(error){
      throw new Error(`Error. Status: ${error}`);
  }
}

//Handler
export default async function handler(req, res) {
  const { type, categoryId, Cover, Query } = req.query; 
    
  switch (type) {
    case 'main':
      return await mainItems(res, categoryId, Cover);
    case 'cate':
      return await mainItems(res, categoryId, Cover);
    case 'search':
      return await searchItems(res, Query);
    default: 
      return await listItems(res, type, categoryId, Cover);
  }
}
  

  
  
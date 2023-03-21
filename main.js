let news = [];
let page = 1;
let total_pages = 0;
let menus = document.querySelectorAll(".menus button");
menus.forEach((menu)=> menu.addEventListener("click", (event)=>getNewsByTopic(event) ));
let searchInput = document.getElementById("search-input");
searchInput.addEventListener("keypress", (event)=>{
    if(event.key === "Enter"){
        event.preventDefault();
        document.getElementById("btn").click();
    }
});
let url;

const getNews = async() => {
    try{
        let header = new Headers({
            'x-api-key': 'ZwFczRV4Sl9EPsXiQ9pzGKqXedoVWN9BCXF3xZIhkVU'
        });
        url.searchParams.set('page', page);
        console.log("page:",page);
        let response = await fetch(url, {headers:header});
        let data = await response.json();
        if(response.status == 200){
            if(data.total_hits == 0){
                throw new Error("검색된 결과값이 없습니다.")
            }
            news = data.articles;
            total_pages = data.total_pages;
            page = data.page;
            render();
            pagenation();
        }else{
            throw new Error(data.message);
        }
    } catch(error){
        errorRender(error.message);
    }
};

const getLatestNews = async() => {
    url = new URL(`https://api.newscatcherapi.com/v2/search?q=sport&lang=ko&countries=KR&page_size=10`);
    getNews();
};
getLatestNews();

const getNewsByTopic = async (event) => {
    let topic = event.target.textContent.toLowerCase();
    url = new URL(`https://api.newscatcherapi.com/v2/search?lang=ko&countries=KR&page_size=10&q=${topic}`);
    getNews();
};

const openNav = () => {
    document.getElementById("mySidenav").style.width = "250px";
};
  
const closeNav = () => {
    document.getElementById("mySidenav").style.width = "0";
};

const openSearchBox = () => {
    let inputArea = document.getElementById("input-area");
    if (inputArea.style.display === "inline") {
      inputArea.style.display = "none";
    } else {
      inputArea.style.display = "inline";
    }
};

const searchNews = async() => {
    let input = searchInput.value;
    url = new URL(`https://api.newscatcherapi.com/v2/search?lang=ko&countries=KR&page_size=10&q=${input}`);
    getNews();
};

const render= () =>{
    let result = "";
    news.forEach((item)=>{
        result += `<div class="row news">
        <div class="col-lg-4">
        <img
          class="news-img-size"
          src="${
            item.media || 
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"
        }"/>
      </div>
      <div class="col-lg-8">
        <h2>${item.title}</h2>
        <p>${
            item.summary==null || item.summary==""
                ? "내용없음":item.summary.length > 200
                ? item.summary.substring(0,200)+"...":item.summary
            }</p>
        <div>${
            item.rights || "no source"} ${moment(item.published_date).fromNow()}</div>
      </div>
      </div>`
    })
    document.getElementById("news-board").innerHTML = result;
};

const errorRender = (error) => {
    let errorHTML = `<div class="alert alert-danger text-center" role="alert">${error}</div>`;
    document.getElementById("news-board").innerHTML = errorHTML;
};

const pagenation = () => {
    let pagenationHTML = ``;
    let pageGroup=0;
    let last=0;
    let first=0;
    if(total_pages<=5){
        pageGroup = 1;
        last = total_pages;
        first = 1;
    }else if((Math.ceil(page/5))*5>total_pages){
        pageGroup = Math.ceil(page/5);
        last = total_pages;
        first = pageGroup*5-4;
    }else{
        pageGroup = Math.ceil(page/5);
        last = pageGroup*5;
        first = pageGroup*5-4;
    }
    if(page!=1){
        pagenationHTML += `<li class="page-item">
        <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${1})">
        <span aria-hidden="true">&laquo;</span>
        </a>
        </li>
        <li class="page-item">
        <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${page-1})">
        <span aria-hidden="true">&lt;</span>
        </a>
        </li>`
    }
    for(let i=first;i<=last;i++){
        pagenationHTML += `
        <li class="page-item ${page==i? "active" : ""}">
            <a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a>
        </li>`;
    }
    if(page != total_pages){
        pagenationHTML += `<li class="page-item">
        <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${page+1})">
        <span aria-hidden="true">&gt;</span>
        </a>
        </li>
        <li class="page-item">
        <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${total_pages})">
        <span aria-hidden="true">&raquo;</span>
        </a>
        </li>`;
    }
    document.querySelector(".pagination").innerHTML=pagenationHTML;
};

const moveToPage =(pageNum)=>{
    //1.이동하고싶은 페이지를 알아
    page = pageNum;
    //2.이동하고싶은 페이지의 api를 다시 호출
    getNews();
}
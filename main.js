//https://app.newscatcherapi.com/dashboard/
// this api will be expired 50 times 
let news = [];
let url;
let topic = '';
let page= 1;
let totalPage = 1;
let menusBtn = document.querySelectorAll(".menus button");
let sideMenusBtn = document.querySelectorAll(".second-menus button");
menusBtn.forEach((menu)=> menu.addEventListener("click", (event)=>getNewsByTopic(event) ));
sideMenusBtn.forEach((menu)=> menu.addEventListener("click", (event)=>getNewsBySideMenu(event) ));

const getNews = async()=>{
    try{
        let header = new Headers({'x-api-key':'S_YKA6DzkJ7WPaRIRTao2ZWeVE1vzhkcvUCWsfqCz94'});
        url.searchParams.set("page", page);
        let response = await fetch(url,{headers: header});
        let data = await response.json();
        if(response.status == 200){
            if(data.total_hits == 0){
                console.log("A", data);
                page = 0;
                totalPage = 0 ;
                renderPagination();
                throw new Error(data.status);
            }
            console.log("B",data)
            news = data.articles;
            totalPage = data.total_pages;
            render();
            renderPagination();
        }else {
            console.log("C", data);
            page = 0;
            totalPage = 0;
            renderPagination();
            throw new Error(data.message);
        }
    }catch (e){
        console.log("에러", e);
        errorRender(e.message);
        page = 0;
        totalPage = 0;
        renderPagination();
    }
};

const getLatestNews = async() => {
    page = 1;
    url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10`);
    getNews();
};

const render=()=>{
    let newsHTML = '';
    news.forEach((item)=>{
        newsHTML += `
        <a href="${item.link}" class="title-link"><div class="row news">
            <div class="col-lg-4">
                <img class="img-size" src="${item.media||"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"}"/>
            </div>
            <div class="col-lg-8">
                <h2>${item.title}</h2>
                <p>${item.summary==null||item.summary==""
                ?"내용없음":item.summary.length>200
                ?item.summary.substring(0,200)+"...":item.summary}</p>
                <div>${item.rights||"no source"} ${moment(item.published_date).fromNow()}</div>
            </div>
        </div></a>`
    })
    document.getElementById("news-board").innerHTML = newsHTML;
};

const renderPagination=()=>{
    let pageHTML = '';
    let pageGroup = Math.ceil(page/5);
    let last = pageGroup*5;
    if(last > totalPage){
        last = totalPage;
    }
    let first = last - 4 <= 0 ? 1 : last - 4;

    if(page > 1 ){
        pageHTML = `
        <li class="page-item">
            <a class="page-link" href="#" aria-label="Previous" onclick="pageClick(${1})">
                <span aria-hidden="true">&laquo;</span>
            </a>
        </li>
        <li class="page-item">
            <a class="page-link" href="#" aria-label="Previous" onclick="pageClick(${page-1})">
                <span aria-hidden="true">&lt;</span>
            </a>
        </li>`
    }
    for(let i=first; i<=last; i++){
        pageHTML += `
        <li class="page-item ${i==page?"active":""}">
            <a class="page-link" href="#" onclick="pageClick(${i})">${i}</a>
        </li>`;
    }
    if(page != totalPage){
        pageHTML += `
        <li class="page-item">
          <a class="page-link" href="#" aria-label="Next" onclick="pageClick(${page+1})">
            <span aria-hidden="true">&gt;</span>
          </a>
        </li>
        <li class="page-item">
          <a class="page-link" href="#" aria-label="Next" onclick="pageClick(${totalPage})">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>`
    }
    document.querySelector(".pagination").innerHTML = pageHTML;
};

const pageClick=(pageNum)=>{
    page = pageNum;
    getNews();
}

const getNewsByTopic = async(event) => {
    page = 1;
    topic = event.target.textContent.toLowerCase();
    url = new URL(`https://api.newscatcherapi.com/v2/search?q=${topic}&countries=KR&page_size=10`);
    getNews();
};
const getNewsBySideMenu = async(event) => {
    page=1;
    topic = event.target.textContent.toLowerCase();
    url = new URL(`https://api.newscatcherapi.com/v2/search?q=${topic}&countries=KR&page_size=10`);
    closeSideNav();
    getNews();
};

const searchNews = async()=>{
    page = 1;
    input = document.querySelector(".search-input");
    topic = input.value;
    url = new URL(`https://api.newscatcherapi.com/v2/search?q=${topic}&countries=KR&page_size=10`);
    getNews(); 
    input.value = '';
};

const openSideNav=()=>{
    document.getElementById("mySidenav").style.width= "150px";
};

const closeSideNav=()=>{
    document.getElementById("mySidenav").style.width= "0px";
};

const openSearchBox=()=>{
    let inputArea=document.getElementById("input-area");
    (inputArea.style.display==="inline")
    ?inputArea.style.display="none":inputArea.style.display="inline";
};

const errorRender = (message) =>{
    document.getElementById(
        "news-board"
    ).innerHTML = `<h3 class="text-center alert alert-danger mt-1">${message}</h3>`;
};

getLatestNews();
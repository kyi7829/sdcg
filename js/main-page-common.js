const btnHome = document.getElementById('btnHome');
const btnCalendar = document.getElementById('btnCalendar');
const btnUserInfo = document.getElementById('btnUserInfo');
const btnSettings = document.getElementById('btnSettings');

// 현재 페이지로 이동 제한
function movePage (targetUrl) {
    const targetFileName = targetUrl.split('/').pop();
    const currentFileName = window.location.href.split('/').pop();
    
    if (currentFileName !== targetFileName) {
        window.location.href = targetUrl;
    } 
}

btnHome.addEventListener('click', function() {
    movePage('../html/main-page.html');
});

btnCalendar.addEventListener('click', function() {
    movePage('../html/calendar-page.html');
});

btnUserInfo.addEventListener('click', function() {
    movePage('../html/userInfo-page.html');
});

btnSettings.addEventListener('click', function() {
    movePage('../html/settings-page.html');
});
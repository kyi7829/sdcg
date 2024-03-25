/***************************************************************************************************************************************
 *                                                     페이지 이동
 * *************************************************************************************************************************************/
const btnCalendar = document.getElementById('btnCalendar');
const btnHome = document.getElementById('btnHome');
const btnModalOpen = document.getElementById('btnModalOpen');
const btnUserInfo = document.getElementById('btnUserInfo');
const btnSettings = document.getElementById('btnSettings');

// 현재 페이지로 이동 제한
function movePage (targetUrl) {
    if (!window.location.href.includes(targetUrl.split('/').pop().replace('.html', ''))) {
        window.location.href = targetUrl;
    } 
}

// 페이지 이동
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

/***************************************************************************************************************************************
 *                                                     공통 함수
 * *************************************************************************************************************************************/
// 기존 화면 요소 비활성화
function disableElements() {
    const elementsToDisable = document.querySelectorAll(".disable-on-popup");

    elementsToDisable.forEach((element) => {
        element.style.pointerEvents = "none"; 
    });
}
window.disableElements = disableElements;

// 기존 화면 요소 활성화
function enableElements() {
    const elementsToEnable = document.querySelectorAll(".disable-on-popup");

    // 기존 버튼과의 충돌로 인해 활성화 딜레이 추가
    setTimeout(() => {
        elementsToEnable.forEach((element) => {
            element.style.pointerEvents = "auto";
        });
    }, 100); // 0.1초(100밀리초) 딜레이
}
window.enableElements = enableElements;

// 절약 금액 inputFilter 적용
function filterInput(inputElement, maxValue) {
    inputElement.addEventListener('input', function () {
        const inputValue = inputElement.value.replace(/[^0-9]/g, ''); // 숫자 이외의 문자 제거
        let numericValue = parseInt(inputValue, 10); // 숫자로 변환

        // 최대값 적용
        if (isNaN(numericValue) || numericValue < 1) {
            inputElement.value = ''; // 값이 비거나 1 미만인 경우, 입력란 비움
        } else {
            numericValue = Math.min(maxValue, numericValue); // 최대값으로 제한
            inputElement.value = numericValue; // 숫자를 다시 입력란에 반영
        }
    });
}
window.filterInput = filterInput;

// 알림창 출력 
function showNotification(message, type) {
    var notification = document.getElementById('notification');
    
    // alert / warning 구분    
    if (type == "W") {
        notification.classList.remove("success");
        notification.classList.add("warning");
    } else {
        notification.classList.remove("warning");
        notification.classList.add("success");
    }

    notification.textContent = message;
    notification.style.display = 'block';

    setTimeout(function() {
      notification.style.display = 'none';
    }, 5000); // 5초 후에 알림창을 숨김
}
window.showNotification = showNotification;

// 가이드 이미지 스택
let guideStack;

// 가이드 출력
function openGuide() {
    const guideWrapper = document.getElementById('guideWrapper');
    const questionMark = document.querySelector('.fa-regular.fa-circle-question');

    guideStack = 1;
    questionMark.style.color = '#1E808A';
    guideWrapper.style.display = 'flex';
}
window.openGuide = openGuide;

/***************************************************************************************************************************************
 *                                                     내역 추가 모달 OPEN
 * *************************************************************************************************************************************/
// 현재 시각을 가져오는 함수
function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    let hours = now.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12; // 0시는 12시로 표시
    const hoursString = String(hours).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const datePart = `${year}-${month}-${day}`;
    const timePart = `${hoursString}:${minutes} ${ampm}`;

    return [datePart, timePart];
}

// 저장할 데이터의 신규키 채번
function getNextKey() {
    const prefix = 'sdcg-';

    // Local Storage에서 모든 데이터의 key 가져오기
    const allKeys = Object.keys(localStorage);

    // prefix로 시작하는 key만 필터링
    const matchingKeys = allKeys.filter((key) => key.startsWith(prefix));

    if (matchingKeys.length === 0) {
        // prefix로 시작하는 키가 하나도 없다면 sdcg-1 반환
        return `${prefix}1`;
    }

    // matchingKeys 배열에서 최대값 추출
    const maxNumericKey = matchingKeys.reduce((max, key) => {
        const match = key.match(/^sdcg-(\d+)$/);
        return match ? Math.max(max, parseInt(match[1], 10)) : max;
    }, 0);

    // 최대값 + 1 반환
    return `${prefix}${maxNumericKey + 1}`;
}

// 이미지를 미리 로드하여 캐시에 저장
const imageCache = {};

function preloadImage(url) {
    if (!imageCache[url]) {
        const img = new Image();
        img.src = url;
        imageCache[url] = img;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const recentAdd_modalWrapper = document.getElementById('recentAdd_modalWrapper');
    const recentAdd_calendarWrapper = document.getElementById('recentAdd_calendarWrapper');
    const recentAdd_closeModalBtn = document.getElementById('recentAdd_closeModalBtn');

    // 모달 열기
    btnModalOpen.addEventListener('click', () => {
        recentAdd_modalWrapper.style.display = 'flex';
        
        // 현재 시각을 가져와서 표시
        const [datePart, timePart] = getCurrentDateTime();
        document.getElementById('recentAdd_yearMonthDayText').textContent = datePart;
        document.getElementById('recentAdd_timepicker').value = timePart;
        timeValue = timePart;

        // 항목 값 초기화
        document.getElementById('recentAdd_categorySelect').selectedIndex = 0; // 항목
        document.getElementById('recentAdd_inputMoney').value = null; // 금액
        document.getElementById('recentAdd_memo').value = null; // 메모
    });

    // 모달 닫기
    recentAdd_closeModalBtn.addEventListener('click', () => {
        recentAdd_modalWrapper.style.display = 'none';
    });

    // 달력
    // [calendar 객체 지정]
    var recentAdd_calendarElement = document.getElementById("recentAdd_calendar");

    // [full-calendar 생성]
    var recentAdd_calendar = new FullCalendar.Calendar(recentAdd_calendarElement, {
    
        // 해더에 표시할 툴바
        headerToolbar: {
            // left: 'prev,next', // 이전, 다음
            left: 'prev,next,today', // 이전, 다음, 오늘
            center: 'title', // 중앙 타이틀
            right: null
            //right: 'dayGridMonth,timeGridDay' // 월, 일
            //right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek' // 월, 주, 일, 일정목록
        },
    
        initialView: 'dayGridMonth', // 초기 로드 될때 보이는 캘린더 화면 (기본 설정: 달)
        
        navLinks: false, // 날짜를 선택하면 Day 캘린더나 Week 캘린더로 링크
        
        locale: 'ko', // 한국어 설정
    
        selectLongPressDelay:300, // 선택 클릭 발동 시간 
        
        dateClick: function (info) {
            // 날짜 수정
            document.getElementById('recentAdd_yearMonthDayText').textContent = info.dateStr;
    
            // 캘린더 닫기
            document.getElementById('recentAdd_calendarWrapper').style.display = 'none';  
    
            // 기존 항목 클릭 활성화
            enableElements();
        }
    
    });
    // [캘린더 랜더링]
    recentAdd_calendar.render();      
    
    // 달력 열기
    recentAdd_yearMonthDayImg.addEventListener('click', () => {
        recentAdd_calendarWrapper.style.display = 'flex';

        // css 충돌 방지 초기화(클릭)
        document.querySelector("#recentAdd_calendar > div.fc-header-toolbar.fc-toolbar.fc-toolbar-ltr > div:nth-child(1) > div > button.fc-next-button.fc-button.fc-button-primary").click();  
        document.querySelector("#recentAdd_calendar > div.fc-header-toolbar.fc-toolbar.fc-toolbar-ltr > div:nth-child(1) > div > button.fc-today-button.fc-button.fc-button-primary").click(); 
    
        // 기존 항목 클릭 비활성화
        disableElements();
    });  
    
    // 절약 금액
    const inputMoney = document.getElementById('recentAdd_inputMoney');
    filterInput(inputMoney, 10000000);
    
    // 금액 포맷 변경 100,000원 -> 100000
    inputMoney.addEventListener('focus', function() {
        const inputValue = inputMoney.value; 
        const numericValue = parseInt(inputValue.replace(/,|원/g, ''), 10); // 쉼표 및 "원" 제거 후 정수로 변환
        if (!isNaN(numericValue)) {
            inputMoney.value = numericValue; // 변환된 값으로 업데이트
        } 
    }); 
    
    // 금액 포맷 변경 100000 -> 100,000원
    inputMoney.addEventListener('blur', function() {    
        const inputValue = inputMoney.value; 
        if (!isNaN(inputValue)) {
            const stringValue = parseFloat(inputValue).toLocaleString();
            if (stringValue != 'NaN') {
                inputMoney.value = stringValue + '원';
            }           
        }        
    });

    // 등록
    recentAdd_submitModalBtn.addEventListener('click', () => {
        // 날짜
        const yearMonthDay = document.getElementById('recentAdd_yearMonthDayText').textContent; 
        // 시간
        const hourMinute = document.getElementById('recentAdd_timepicker').value;
        // 항목
        const selectedItem = document.querySelector('.white-bg select').value;
        // 금액
        const money = document.getElementById('recentAdd_inputMoney').value;
        // 메모
        const memo = document.getElementById('recentAdd_memo').value;

        if (money == "") {
            showNotification("금액은 필수 입력 값입니다.", "W");
            document.getElementById('recentAdd_inputMoney').focus();
        } else {
            const saveDataInfo = {
                yearMonthDay,
                hourMinute,
                selectedItem,
                money,
                memo,
            };
        
            // 로컬 스토리지에 데이터를 JSON 형태로 저장
            localStorage.setItem(getNextKey(), JSON.stringify(saveDataInfo));
        
            // 모달 숨김
            recentAdd_modalWrapper.style.display = 'none';    

            // 페이지별 별도 처리
            const currentPage = window.location.href;
            if (currentPage.includes('main')) {    
                // 메인화면            
                // 새로고침으로 통일화?
                showNotification("내역이 추가되었습니다."); 
                getLocalStorageData(); 
                drawChart(); 
            } else if (currentPage.includes('calendar') || currentPage.includes('userInfo') || currentPage.includes('settings')) {                
                // 캘린더, 사용자 정보, 설정                            
                localStorage.setItem('sdcg-showNotificationYn', true);               
                localStorage.setItem('sdcg-messageContents', '내역이 추가되었습니다.');                
                location.reload(); 
            }
        }
    });       

    // 가이드
    const guideWrapper = document.getElementById('guideWrapper');
    const questionMark = document.querySelector('.fa-regular.fa-circle-question');

    const modalContent = document.getElementsByClassName('modal-content-guide');
    function changeGuideImg() {
        switch (guideStack) {
            case 1:
                preloadImage('../images/guide2.jpg'); 
                modalContent[0].style.backgroundImage = "url('../images/guide1.jpg')";
                break;
            case 2:
                preloadImage('../images/guide3.jpg'); 
                modalContent[0].style.backgroundImage = "url('../images/guide2.jpg')";
                break;
            case 3:
                modalContent[0].style.backgroundImage = "url('../images/guide3.jpg')";
                break;
        }
    }

    questionMark.addEventListener('click', function() {
        openGuide();        
    });
    
    leftBtn.addEventListener('click', function () {
        guideStack--;
        changeGuideImg();

        if (guideStack == 1) {
            leftBtn.style.display = 'none';
        } else if (guideStack == 2) {
            rightBtn.className = 'fa-solid fa-caret-right';
        }
    });

    rightBtn.addEventListener('click', function () {
        if (guideStack == 2) {
            guideStack++;
            changeGuideImg();
            leftBtn.style.display = 'block';
            rightBtn.className = 'fa-solid fa-xmark';
        } else if (guideStack == 3) {
            guideWrapper.style.display = 'none';
            document.querySelector('.fa-regular.fa-circle-question').style.color = '#808080';
            guideStack == 1;
            rightBtn.className = 'fa-solid fa-caret-right';
        } else {
            guideStack++;
            changeGuideImg();
            leftBtn.style.display = 'block';
        }
    });
});    

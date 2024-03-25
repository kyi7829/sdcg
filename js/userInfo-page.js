// 알림창 출력 플래그 
let showNotificationYn = localStorage.getItem('sdcg-showNotificationYn') === 'true';
let messageContents = localStorage.getItem('sdcg-messageContents');

// 목표설정 DATA KEY
const dataKey = "sdcg-goalKey";

// 날짜선택 class
const dateSearchImgs = document.querySelectorAll('.dateSearchImg');

// 날짜선택 분기변수
let dateSearchType;

// 오늘 날짜를 가져오는 함수
window.getCurrentDate = function() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

// 이벤트 핸들러 함수 정의
const openCalendar = (clickedImg) => {
    calendarWrapper.style.display = 'flex';

    // 달력 초기화
    document.querySelector(".fc-next-button.fc-button.fc-button-primary").click();
    document.querySelector(".fc-today-button.fc-button.fc-button-primary").click();

    // 기존 항목 클릭 비활성화
    disableElements();

    // 분기변수 설정
    dateSearchType = clickedImg;
};

// 각 이미지에 이벤트 추가
dateSearchImgs.forEach(img => {
    if (img.id != 'recentAdd_yearMonthDayImg') {
        img.addEventListener('click', () => {
            // 클릭된 이미지의 id를 전달하여 openCalendar 함수 실행
            openCalendar(img.id);
        });   
    }
});

// 다운로드 링크 복사
function copyLink(division) {

    let linkUrl;

    // FIXME -------------------------------------------------------------------------------------------------------------->
    // 앱 출시 후 URL 변경 필요
    // if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    //     linkUrl = 'ios TEST'
    // } else {
    //     linkUrl = 'android TEST'
    // }  

    if (division == 'google') {
        // Google Play Store url
        linkUrl = 'PlayStore 출시 예정입니다.';
    } else {
        // Apple Appstore url
        linkUrl = 'Appstore 출시 예정입니다.';
    }

    // Clipboard API를 사용하여 텍스트를 클립보드에 복사
    navigator.clipboard.writeText(linkUrl);
}

// 누적금액 계산
window.getCumulativeAmountFromBaseDate = function(allData, baseDate) {

    // 기준일 이전의 데이터 필터링 및 계산
    const totalMoneyBeforeBaseDate = allData
    .filter(entry => new Date(entry.data.yearMonthDay) >= new Date(baseDate))
    .reduce((sum, entry) => {
        const money = entry.data.money.replace(/,/g, '').replace('원', ''); 
        return sum + Number(money);
    }, 0);

    return parseFloat(totalMoneyBeforeBaseDate).toLocaleString() + '원';
}

// 누적금액 날짜조회
window.getCumulativeAmountFromDate = function(allData, startDate, endDate) {
    
    // 시작일과 종료일 사이의 데이터 필터링 및 계산
    const totalMoneyBetweenDates = allData
        .filter(entry => {
            const entryDate = new Date(entry.data.yearMonthDay);
            return entryDate >= new Date(startDate) && entryDate <= new Date(endDate);
        })
        .reduce((sum, entry) => {
            const money = entry.data.money.replace(/,/g, '').replace('원', ''); // 모든 콤마 제거 및 '원' 문자 제거
            return sum + Number(money);
        }, 0);

    return parseFloat(totalMoneyBetweenDates).toLocaleString() + '원';
}

document.addEventListener('DOMContentLoaded', function () {

    // 로컬 스토리지에서 모든 데이터 가져오기
    const allData = Object.entries(localStorage)
        .filter(([key, value]) => key.startsWith('sdcg-') && /^\d+$/.test(key.slice(5))) // sdcg-로 시작하면서 숫자로만 이루어진 키만 필터링
        .map(([key, value]) => ({
            numericKey: Number(key.slice(5)),
            data: JSON.parse(value)
        })); 

    const modalWrapper = document.getElementById('modalWrapper');
    const calendarWrapper = document.getElementById('calendarWrapper');

    // 모달 열기
    openModalBtn.addEventListener('click', () => {
        // 목표설정 데이터
        const goalData = JSON.parse(localStorage.getItem(dataKey));

        // 오늘일자
        const today = getCurrentDate(); 

        // dataKey로 INSERT/UPDATE 구분
        if (goalData == null ) { // INSERT                        
            // 시작일
            document.getElementById('yearMonthDayText').textContent = today;
            // 누적금액
            document.getElementById('cumulativeAmount').textContent = getCumulativeAmountFromBaseDate(allData, today);
        } else { // UPDATE
            // 목표
            document.getElementById('inputGoal').value = goalData.inputGoal;
            // 목표금액
            document.getElementById('inputGoalMoney').value = goalData.inputGoalMoney;
            // 시작일
            document.getElementById('yearMonthDayText').textContent = goalData.yearMonthDayText;
            // 누적금액
            document.getElementById('cumulativeAmount').textContent = getCumulativeAmountFromBaseDate(allData, goalData.yearMonthDayText);      
        }

        modalWrapper.style.display = 'flex';
    });

    // 모달 닫기
    closeModalBtn.addEventListener('click', () => {
        modalWrapper.style.display = 'none';
    });


    // 달력
    // [calendar 객체 지정]
    var calendarElement = document.getElementById("calendar");

    // [full-calendar 생성]
    var calendar = new FullCalendar.Calendar(calendarElement, {

        // 해더에 표시할 툴바
        headerToolbar: {
            left: 'prev,next,today', // 이전, 다음, 오늘
            center: 'title', // 중앙 타이틀
            right: null
        },

        initialView: 'dayGridMonth', // 초기 로드 될때 보이는 캘린더 화면 (기본 설정: 달)
        
        navLinks: false, // 날짜를 선택하면 Day 캘린더나 Week 캘린더로 링크
        
        locale: 'ko', // 한국어 설정

        selectLongPressDelay:300, // 선택 클릭 발동 시간 
        
        dateClick: function (info) {

            if (dateSearchType == 'yearMonthDayImg') {
                // 날짜 수정
                document.getElementById('yearMonthDayText').textContent = info.dateStr;

                // 누적금액 수정
                document.getElementById('cumulativeAmount').textContent = getCumulativeAmountFromBaseDate(allData, info.dateStr);
            } else {

                let startDate = document.getElementById('startDate').value;
                let endDate = document.getElementById('endDate').value;
                let currentDate = info.dateStr;

                if (dateSearchType == 'startDateImg') {
                    if (null === endDate) {
                      document.getElementById('startDate').value = currentDate;
                    } else {
                        if (new Date(endDate) < new Date(currentDate)) {
                            showNotification("시작일은 종료일 이전 날짜로\n선택 해주세요.", "W");
                            return false;
                        }
                        document.getElementById('startDate').value = currentDate;      
                        document.getElementById('savingAmount').value = getCumulativeAmountFromDate(allData, currentDate, endDate);
                    }                    
                } else {
                    if (null === startDate) {
                        document.getElementById('endDate').value = currentDate;
                      } else {
                          if (new Date(startDate) > new Date(currentDate)) {
                              showNotification("종료일은 시작일 이후 날짜로\n선택 해주세요.", "W");
                              return false;
                          }
                          document.getElementById('endDate').value = currentDate;      
                          document.getElementById('savingAmount').value = getCumulativeAmountFromDate(allData, startDate, currentDate);
                      }                     
                }
            }

            // 캘린더 닫기
            document.getElementById('calendarWrapper').style.display = 'none';  

            // 기존 항목 클릭 활성화
            enableElements();
        }

    });
    // [캘린더 랜더링]
    calendar.render();      

    // 금액
    const inputGoalMoney = document.getElementById('inputGoalMoney');
    filterInput(inputGoalMoney, 10000000);

    // 금액 포맷 변경 100,000원 -> 100000
    inputGoalMoney.addEventListener('focus', function() {
        const inputValue = inputGoalMoney.value; 
        const numericValue = parseInt(inputValue.replace(/,|원/g, ''), 10); // 쉼표 및 "원" 제거 후 정수로 변환
        if (!isNaN(numericValue)) {
            inputGoalMoney.value = numericValue; // 변환된 값으로 업데이트
        } 
    }); 

    // 금액 포맷 변경 100000 -> 100,000원
    inputGoalMoney.addEventListener('blur', function() {    
        const inputValue = inputGoalMoney.value; 
        if (!isNaN(inputValue)) {
            const stringValue = parseFloat(inputValue).toLocaleString();
            if (stringValue != 'NaN') {
                inputGoalMoney.value = stringValue + '원';
            }           
        }        
    });

    // 알림창 출력
    if (showNotificationYn) {
        showNotification(messageContents);

        // 알림창 출력 플래그 변경
        localStorage.setItem('sdcg-showNotificationYn', false);                  
    }
});

// 등록
submitModalBtn.addEventListener('click', () => {

    // 목표
    const inputGoal = document.getElementById('inputGoal').value; 
    // 목표금액
    const inputGoalMoney = document.getElementById('inputGoalMoney').value;
    // 시작일
    const yearMonthDayText = document.getElementById('yearMonthDayText').textContent;
    // 누적금액
    const cumulativeAmount = document.getElementById('cumulativeAmount').textContent;

    if (inputGoal == "") {
        showNotification("목표를 입력해주세요.", "W");
        document.getElementById('inputGoal').focus();
    } else if (inputGoalMoney == "") {
        showNotification("목표금액을 입력해주세요.", "W");
        document.getElementById('inputGoalMoney').focus();
    } else if (yearMonthDayText == "") {
        showNotification("시작일을 선택해주세요.", "W");
        document.getElementById('yearMonthDayImg').click();
    } else {
        const goalDataInfo = {
            inputGoal,
            inputGoalMoney,
            yearMonthDayText,
            cumulativeAmount
        };
    
        // 로컬 스토리지에 데이터를 JSON 형태로 저장
        localStorage.setItem(dataKey, JSON.stringify(goalDataInfo));
    
        // 모달 숨김
        modalWrapper.style.display = 'none';
    
        // 알림창 출력
        showNotification("목표가 추가되었습니다.");
        
        // 차트 갱신
        drawBarChart();
    }    
});     

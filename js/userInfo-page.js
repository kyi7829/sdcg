// 목표설정 DATA KEY
const dataKey = "sdcg-goalKey";

// 오늘 날짜를 가져오는 함수
window.getCurrentDate = function() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

// 기존 화면 요소 비활성화
function disableElements() {
    const elementsToDisable = document.querySelectorAll(".disable-on-popup");

    elementsToDisable.forEach((element) => {
        element.style.pointerEvents = "none"; 
    });
}

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

// 금액 inputFilter 적용
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

// 누적금액 계산
window.getCumulativeAmountFromBaseDate = function(allData, baseDate) {

    // 기준일 이전의 데이터 필터링 및 계산
    const totalMoneyBeforeBaseDate = allData
        .filter(entry => new Date(entry.data.yearMonthDay) >= new Date(baseDate))
        .reduce((sum, entry) => sum + Number(entry.data.money.replace('원', '').replace(',', '')), 0);

    return parseFloat(totalMoneyBeforeBaseDate).toLocaleString() + '원';
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
            document.getElementById('cumulativeAmount').textContent = getCumulativeAmountFromBaseDate(allData, today);      
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
            // 날짜 수정
            document.getElementById('yearMonthDayText').textContent = info.dateStr;

            // 누적금액 수정
            document.getElementById('cumulativeAmount').textContent = getCumulativeAmountFromBaseDate(allData, info.dateStr);

            // 캘린더 닫기
            document.getElementById('calendarWrapper').style.display = 'none';  

            // 기존 항목 클릭 활성화
            enableElements();
        }

    });
    // [캘린더 랜더링]
    calendar.render();      

    // 달력 열기
    yearMonthDayImg.addEventListener('click', () => {
        calendarWrapper.style.display = 'flex';

        // 달력 초기화
        document.querySelector(".fc-next-button.fc-button.fc-button-primary").click(); // css 충돌 방지 버튼 클릭
        document.querySelector(".fc-today-button.fc-button.fc-button-primary").click(); // 오늘 일자로 이동

        // 기존 항목 클릭 비활성화
        disableElements();
    });  
    
    // 금액
    const inputGoalMoney = document.getElementById('inputGoalMoney');
    filterInput(inputGoalMoney, 999999999999);

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

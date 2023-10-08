
// 현재 시각을 가져오는 함수
function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const datePart = `${year}-${month}-${day}`;
    const timePart = `${hours}:${minutes}`;

    return [datePart, timePart];
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

// 메인화면 데이터 최신화
function getLocalStorageData() {
    
    // 로컬 스토리지에서 모든 데이터 가져오기
    const allData = Object.entries(localStorage).map(([key, value]) => ({
        key,
        value: JSON.parse(value)
    }));


    
    // =====================================================================================================================================
    //                                                          수정필요
    // =====================================================================================================================================
    // 데이터의 "money" 값을 정수로 파싱하여 더한 후 다시 형식을 변환하는 함수
    function calculateTotalMoney(data) {
        let totalMoney = 0;
        for (const item of data) {
            // "money" 값에서 콤마(,)와 "원" 문자를 모두 제거한 후 정수로 파싱
            const money = parseInt(item.value.money.replace(/,/g, '').replace('원', ''), 10);
            totalMoney += money;
        }
        return totalMoney;
    }
    // 이번 달, 이번 주, 오늘의 데이터 필터링
    const today = new Date();
    const thisMonthData = allData.filter((item) => {
        const itemDate = new Date(`${item.value.yearMonthDay} ${item.value.hourMinute}`);
        return itemDate.getMonth() === today.getMonth();
    });

    // 이번 주의 시작 날짜 (월요일)
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - (today.getDay() + 6) % 7);

    const thisWeekData = allData.filter((item) => {
        const itemDate = new Date(`${item.value.yearMonthDay} ${item.value.hourMinute}`);
        return itemDate >= thisWeekStart;
    });

    const todayData = allData.filter((item) => {
        const itemDate = new Date(`${item.value.yearMonthDay} ${item.value.hourMinute}`);
        return itemDate.getDate() === today.getDate();
    });

    // 각 항목에 데이터 출력
    document.getElementById('monthlySavings').textContent = calculateTotalMoney(thisMonthData).toLocaleString() + '원';
    document.getElementById('weeklySavings').textContent = calculateTotalMoney(thisWeekData).toLocaleString() + '원';
    document.getElementById('dailySavings').textContent = calculateTotalMoney(todayData).toLocaleString() + '원';
    // =====================================================================================================================================



    // key를 기준으로 내림차순으로 정렬
    allData.sort((a, b) => {
        const keyA = parseInt(a.key, 10);
        const keyB = parseInt(b.key, 10);

        return keyB - keyA;
    });

    // 최근 3개의 데이터 선택
    const recentData = allData.slice(0, 3);

    recentData.forEach((data, index) => {
        const dateElement = document.getElementById(`recentSavingsDate${index + 1}`);
        const itemElement = document.getElementById(`recentSavingsItem${index + 1}`);
        const moneyElement = document.getElementById(`recentSavingsMoney${index + 1}`);
        
        if (dateElement && itemElement && moneyElement) {
            dateElement.textContent = data.value.yearMonthDay + ' ' + data.value.hourMinute;
            itemElement.textContent = data.value.selectedItem;
            moneyElement.textContent = data.value.money;
        }
    });    
}

// 저장할 데이터의 신규키 채번
function getNextKey() {
    // Local Storage에서 모든 데이터의 key 가져오기
    const allKeys = Object.keys(localStorage);

    // key가 숫자인 경우만 필터링 
    const numericKeys = allKeys.filter((key) => !isNaN(Number(key)));

    // numericKeys 배열에서 최대값 + 1
    return Math.max(...numericKeys.map(Number), 0) + 1;
}

document.addEventListener('DOMContentLoaded', function () {

    // 메인화면 데이터 최신화
    getLocalStorageData();    

    const modalWrapper = document.getElementById('modalWrapper');
    const calendarWrapper = document.getElementById('calendarWrapper');

    // 모달을 초기에 숨김
    modalWrapper.style.display = 'none';

    // 모달 열기
    openModalBtn.addEventListener('click', () => {
        modalWrapper.style.display = 'flex';
        
        // 현재 시각을 가져와서 표시
        const [datePart, timePart] = getCurrentDateTime();
        document.getElementById('yearMonthDay').textContent = datePart;
        document.getElementById('hourMinute').textContent = timePart;

        // 항목 값 초기화
        document.querySelector('td.white-bg select').selectedIndex = 0; // 항목
        document.getElementById('inputMoney').value = null; // 금액
        document.getElementById('memo').value = null; // 메모
    });

    // 모달 닫기
    closeModalBtn.addEventListener('click', () => {
        modalWrapper.style.display = 'none';
    });


    // 달력

    // [현재 날짜 및 시간 확인]
    // var korea_date = dayjs(new Date().toLocaleString("en-US", {timeZone: "Asia/Seoul"}));
    // var format = "YYYY-MM-DDTHH:mm:ss"; // 포맷 타입
    // var koreaNow = korea_date.format(format);

    // [calendar 객체 지정]
    var calendarElement = document.getElementById("calendar");

    // [full-calendar 생성]
    var calendar = new FullCalendar.Calendar(calendarElement, {
        
        // expandRows: true, // 화면에 맞게 높이 재설정
        // slotMinTime: '00:00', // 캘린더에서 일정 시작 시간
        // slotMaxTime: '23:59', // 캘린더에서 일정 종료 시간

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
        
        // editable: false, // 수정 가능 여부
        
        // selectable: false, // 달력 일자 드래그 설정가능
        
        // nowIndicator: false, // 현재 시간 마크
        
        // dayMaxEvents: true, // 이벤트가 오버되면 높이 제한 (+ 몇 개식으로 표현)
        
        locale: 'ko', // 한국어 설정

        selectLongPressDelay:300, // 선택 클릭 발동 시간 
        
        dateClick: function (info) {
            
            // 날짜 수정
            document.getElementById('yearMonthDay').textContent = info.dateStr;

            // 캘린더 닫기
            document.getElementById('calendarWrapper').style.display = 'none';  

            // 기존 항목 클릭 활성화
            enableElements();
        }

    });
    // [캘린더 랜더링]
    calendar.render();      

    // 달력 열기
    yearMonthDay.addEventListener('click', () => {
        calendarWrapper.style.display = 'flex';

        // 오늘 일자로 자동이동
        document.querySelector(".fc-today-button.fc-button.fc-button-primary").click();

        // 기존 항목 클릭 비활성화
        disableElements();
    });  
    
    // 절약 금액
    const inputMoney = document.getElementById('inputMoney');
    filterInput(inputMoney, 999999999999);

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
});

// 달력 초기화
window.onload = function () {    
    const buttonToClick1 = document.querySelector(".fc-next-button.fc-button.fc-button-primary");
    const buttonToClick2 = document.querySelector(".fc-today-button.fc-button.fc-button-primary");

    buttonToClick1?.click();
    buttonToClick2?.click();

    calendarWrapper.style.display = 'none';
}

// 등록
submitModalBtn.addEventListener('click', () => {
    // 날짜
    const yearMonthDay = document.getElementById('yearMonthDay').textContent; 
    // 시간
    const hourMinute = document.getElementById('hourMinute').textContent;
    // 항목
    const selectedItem = document.querySelector('.white-bg select').value;
    // 금액
    const money = document.getElementById('inputMoney').value;
    // 메모
    const memo = document.getElementById('memo').value;

    const saveDataInfo = {
        yearMonthDay,
        hourMinute,
        selectedItem,
        money,
        memo,
    };

    // 로컬 스토리지에 데이터를 JSON 형태로 저장
    localStorage.setItem(getNextKey(), JSON.stringify(saveDataInfo));

    modalWrapper.style.display = 'none';

    // 메인화면 데이터 최신화
    getLocalStorageData();
});    

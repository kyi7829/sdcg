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

// 메인화면 데이터 최신화
function getLocalStorageData() {
    
    // 로컬 스토리지에서 모든 데이터 가져오기
    const allData = Object.entries(localStorage)
        .filter(([key, value]) => /^\d+$/.test(key)) // 숫자로만 이루어진 키만 필터링
        .map(([key, value]) => ({
            key: Number(key),
            value: JSON.parse(value)
    }));

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

    // =====================================================================================================================================
    // 이번 달, 이번 주, 오늘의 데이터 필터링
    const today = new Date();

    // month
    const thisMonthData = allData.filter((item) => {
        const itemDate = new Date(`${item.value.yearMonthDay} ${item.value.hourMinute}`);
        return itemDate.getMonth() === today.getMonth();
    });

    // week - 이번 주의 시작 날짜 (월요일)
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - (today.getDay() + 6) % 7);
    thisWeekStart.setHours(0, 0, 0, 0);
    
    const thisWeekEnd = new Date(thisWeekStart);
    thisWeekEnd.setDate(thisWeekStart.getDate() + 6);
    thisWeekEnd.setHours(23, 59, 59, 999); 
    
    const thisWeekData = allData.filter((item) => {
        const itemDate = new Date(`${item.value.yearMonthDay} ${item.value.hourMinute}`);
        return itemDate >= thisWeekStart && itemDate <= thisWeekEnd;
    });    

    // day
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
    // [calendar 객체 지정]
    var calendarElement = document.getElementById("calendar");

    // [full-calendar 생성]
    var calendar = new FullCalendar.Calendar(calendarElement, {

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

        // 달력 초기화
        document.querySelector(".fc-next-button.fc-button.fc-button-primary").click(); // css 충돌 방지 버튼 클릭
        document.querySelector(".fc-today-button.fc-button.fc-button-primary").click(); // 오늘 일자로 이동

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

    if (money == "") {
        showNotification("금액은 필수 입력 값입니다.", "W");
        document.getElementById('inputMoney').focus();
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
        modalWrapper.style.display = 'none';
    
        // 알림창 출력
        showNotification("내역이 추가되었습니다.");

        // 메인화면 데이터 최신화
        getLocalStorageData();        
    }
});     

// 알림창 출력 플래그 
let showNotificationYn = localStorage.getItem('showNotificationYn') === 'true';
let workDivision = localStorage.getItem('workDivision') === 'true';

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

window.onload = async function() {

    // [현재 날짜 및 시간 확인]
    var korea_date = dayjs(new Date().toLocaleString("en-US", {timeZone: "Asia/Seoul"}));
    var format = "YYYY-MM-DDTHH:mm:ss"; 
    var koreaNow = korea_date.format(format);

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
        
        editable: false, // 수정 가능 여부
        
        // selectable: false, // 달력 일자 드래그 설정가능
        
        // nowIndicator: false, // 현재 시간 마크
        
        dayMaxEvents: 2, // 이벤트가 오버되면 높이 제한 (+ 몇 개식으로 표현)
        
        locale: 'ko', // 한국어 설정

        selectLongPressDelay:300, // 선택 클릭 발동 시간 

        eventClick: function (info) {

            // 기존 세부 창 닫기
            var closeButton = document.querySelector('.fc-popover-close.fc-icon.fc-icon-x');
            if (closeButton) {
                closeButton.click();
            }

            // 기존 데이터
            var key = info.event.id;
            const dataInfo = JSON.parse(localStorage.getItem(key));

            // 모달창
            const modalWrapper = document.getElementById('modalWrapper');
            modalWrapper.style.display = 'flex';
                            
            // 항목 값 초기화
            document.getElementById('yearMonthDay').textContent = dataInfo.yearMonthDay; // 날짜
            document.getElementById('timepicker').value = dataInfo.hourMinute; // 시간  
            document.querySelector('td.white-bg select').value = dataInfo.selectedItem; // 항목
            document.getElementById('inputMoney').value = dataInfo.money; // 금액
            document.getElementById('memo').value = dataInfo.memo; // 메모
        
            // 취소버튼
            closeModalBtn.addEventListener('click', () => {
                modalWrapper.style.display = 'none';
            });

            // 삭제버튼
            deleteModalBtn.addEventListener('click', () => {
                localStorage.removeItem(key);

                // 알림창 출력 플래그 변경
                localStorage.setItem('showNotificationYn', true);                
                localStorage.setItem('workDivision', false);    

                // 페이지 새로고침
                location.reload();  
            });            

            // 저장버튼
            submitModalBtn.addEventListener('click', () => {
                const yearMonthDay = document.getElementById('yearMonthDay').textContent; // 날짜
                const hourMinute = document.getElementById('timepicker').textContent; // 시간
                const selectedItem = document.querySelector('td.white-bg select').value; // 항목
                const money = document.getElementById('inputMoney').value; // 금액
                const memo = document.getElementById('memo').value; // 메모

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
                    localStorage.setItem(key, JSON.stringify(saveDataInfo));

                    // 알림창 출력 플래그 변경
                    localStorage.setItem('showNotificationYn', true);                
                    localStorage.setItem('workDivision', true);                

                    // 페이지 새로고침
                    location.reload();                       
                }                                         
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
        },        

        // 이벤트 
        events: []        
    });

    // [캘린더 랜더링]
    calendar.render();

    // 이벤트 추가 함수
    function addEvent(title, start, key) {
        var eventData = {
            title: title,
            start: start,
            id: key
        };
        calendar.addEvent(eventData);
    }

    // 1. 로컬 스토리지에서 모든 데이터 가져오기
    const allData = Object.entries(localStorage)
        .filter(([key, value]) => /^\d+$/.test(key)) // 숫자로만 이루어진 키만 필터링
        .map(([key, value]) => ({
            key: Number(key),
            value: JSON.parse(value)
    }));

    // 이번 달 데이터만 달력에 추가
    // 
    // 2. 달력의 타이틀을 가져옵니다.
    // const calendarTitle = document.querySelector('h2.fc-toolbar-title').textContent;
    //
    // 3. 타이틀에서 년도와 월을 추출합니다.
    // const titleParts = calendarTitle.split(' ');
    // const year = parseInt(titleParts[0].replace('년', ''), 10);
    // const month = parseInt(titleParts[1].replace('월', ''), 10);
    //
    // // 4. 해당 월에 해당하는 데이터만 필터링합니다.
    // const filteredData = allData.filter((data) => {
    //     const yearMonth = data.value.yearMonthDay.substring(0, 7); // "2023-10" 형식으로 추출
    //     const [dataYear, dataMonth] = yearMonth.split('-');
    //     return parseInt(dataYear, 10) === year && parseInt(dataMonth, 10) === month;
    // });
    // filteredData 배열을 순환하며 이벤트 추가
    // filteredData.forEach(function (data) {
    //     var yearMonthDay = data.value.yearMonthDay; // 데이터의 날짜
    //     var money = data.value.money; // 데이터의 금액

    //     // 이벤트 생성 및 추가
    //     addEvent(money, yearMonthDay, data.key);
    // });

    // 데이터 배열을 순환하며 이벤트 추가
    allData.forEach(function (data) {
        var yearMonthDay = data.value.yearMonthDay; // 데이터의 날짜
        var money = data.value.money; // 데이터의 금액

        // 이벤트 생성 및 추가
        addEvent(money, yearMonthDay, data.key);
    });    

    // 알림창 출력
    if (showNotificationYn) {
        if (workDivision) {
            showNotification("내역이 수정되었습니다.");
        } else {
            showNotification("내역이 삭제되었습니다.");
        }

        // 알림창 출력 플래그 변경
        localStorage.setItem('showNotificationYn', false);                  
    }
};    

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

   
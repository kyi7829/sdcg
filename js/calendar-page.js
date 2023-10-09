window.onload = async function() {

    // [현재 날짜 및 시간 확인]
    var korea_date = dayjs(new Date().toLocaleString("en-US", {timeZone: "Asia/Seoul"}));
    var format = "YYYY-MM-DDTHH:mm:ss"; // 포맷 타입
    var koreaNow = korea_date.format(format);

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
        
        editable: false, // 수정 가능 여부
        
        // selectable: false, // 달력 일자 드래그 설정가능
        
        // nowIndicator: false, // 현재 시간 마크
        
        dayMaxEvents: 2, // 이벤트가 오버되면 높이 제한 (+ 몇 개식으로 표현)
        
        locale: 'ko', // 한국어 설정

        selectLongPressDelay:300, // 선택 클릭 발동 시간 
        
        dateClick: function (info) {
            alert(info.dateStr);
        },

        eventClick: function (info) {
            // 클릭한 이벤트의 날짜 정보를 얻기
            var eventInfo = info.event;

            var key = eventInfo.id;
            var startStr = eventInfo.startStr;
            
            console.log(key + " " + startStr);
        },        

        // 이벤트 
        events: []        
    });

    // [캘린더 랜더링]
    calendar.render();
    
    
    //----------------------------------------------------------------------------------------------------------------------------

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
    const allData = Object.entries(localStorage).map(([key, value]) => ({
        key,
        value: JSON.parse(value)
    }));

    // 2. 달력의 타이틀을 가져옵니다.
    const calendarTitle = document.querySelector('h2.fc-toolbar-title').textContent;

    // 3. 타이틀에서 년도와 월을 추출합니다.
    const titleParts = calendarTitle.split(' ');
    const year = parseInt(titleParts[0].replace('년', ''), 10);
    const month = parseInt(titleParts[1].replace('월', ''), 10);

    // 4. 해당 월에 해당하는 데이터만 필터링합니다.
    const filteredData = allData.filter((data) => {
        const yearMonth = data.value.yearMonthDay.substring(0, 7); // "2023-10" 형식으로 추출
        const [dataYear, dataMonth] = yearMonth.split('-');
        return parseInt(dataYear, 10) === year && parseInt(dataMonth, 10) === month;
    });
    
    // filteredData 배열을 순환하며 이벤트 추가
    filteredData.forEach(function (data) {
        var yearMonthDay = data.value.yearMonthDay; // 데이터의 날짜
        var money = data.value.money; // 데이터의 금액

        // 이벤트 생성 및 추가
        addEvent(money, yearMonthDay, data.key);
    });
};    
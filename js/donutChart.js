google.charts.load("current", {packages:["corechart"]});
google.charts.setOnLoadCallback(drawChart);

// 문자열 -> 숫자 파싱
function parseMoney(moneyString) {
    return parseInt(moneyString.replace(/[^\d]/g, ''), 10) || 0;
}

// 숫자 -> 문자열 파싱
function parseString(moneyString) {
    const stringValue = parseFloat(moneyString).toLocaleString();
    if (stringValue != 'NaN') {
        return stringValue + '원';
    }  
}

// 차트 그리기
function drawChart() {

    // 로컬 스토리지에서 모든 데이터 가져오기
    const allData = Object.entries(localStorage)
        .filter(([key, value]) => key.startsWith('sdcg-') && /^\d+$/.test(key.slice(5))) 
        .map(([key, value]) => ({
            numericKey: Number(key.slice(5)),
            data: JSON.parse(value)
        }));

    const today = new Date();


    // 이번달 데이터 필터
    const thisMonthData = allData.filter((item) => {
        const itemDate = new Date(`${item.data.yearMonthDay} ${item.data.hourMinute}`);
        return itemDate.getMonth() === today.getMonth();
    });

    // 데이터가 없을경우 이미지 출력
    if (thisMonthData.length == 0) {
        return false;
    }

    // 데이터 배열 처리
    var localData = [];

    // 헤더 추가
    localData.unshift(['구분', '이번 달 항목별 차트']);

    thisMonthData.forEach(item => {
        
        var existingItemIndex = localData.findIndex(entry => entry[0] === item.data.selectedItem);

        if (existingItemIndex !== -1) {
            localData[existingItemIndex][1] += parseMoney(item.data.money);
        } else {
            localData.push([item.data.selectedItem, parseMoney(item.data.money)]);
        }
    });

    // 차트 생성
    var data = google.visualization.arrayToDataTable(localData);

    var options = {
    // title: '이번 달 절약 항목별 통계',
    pieHole: 0.2,
    colors: ['#1E808A', '#CCE2E4', '#E9F4F5'] // 각 섹션에 대한 색상 지정
    };

    const donutchart = document.getElementById('donutchart');

    var chart = new google.visualization.PieChart(donutchart);
    chart.draw(data, options);
}
window.drawChart = drawChart;
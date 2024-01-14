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

    // 데이터가 없을경우 
    if (allData.length == 0) {
        
    }

    // 데이터 배열 처리
    var localData = [];

    // 헤더 추가
    localData.unshift(['구분', '이번 달 항목별 차트']);

    allData.forEach(item => {
        
        var existingItemIndex = localData.findIndex(entry => entry[0] === item.data.selectedItem);

        if (existingItemIndex !== -1) {
            localData[existingItemIndex][1] += parseMoney(item.data.money);
        } else {
            localData.push([item.data.selectedItem, parseMoney(item.data.money)]);
        }
    });

    // 테스트용 데이터
    var testData = google.visualization.arrayToDataTable([
        ['Element', 'Density', { role: 'style' }],
        ['목표', 150000, 'color: #e5e4e2' ], // CSS-style declaration
     ]);

    // 차트 생성
    var data = google.visualization.arrayToDataTable(localData);

    var options = {
    title: '이번 달 절약 항목별 통계',
    pieHole: 0.2,
    };

    const barchart = document.getElementById('barchart');

    var chart = new google.visualization.BarChart(barchart);
    chart.draw(testData, options);
    
    //chart.draw(data, options);
}
window.drawChart = drawChart;
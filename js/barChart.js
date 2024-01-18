google.charts.load("current", {packages:["corechart"]});
google.charts.setOnLoadCallback(drawBarChart);

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
function drawBarChart() {

    const dataInfo = JSON.parse(localStorage.getItem('sdcg-goalKey'));

    // 데이터가 없을경우 
    if (dataInfo == null) {
        return false;
    } 

    // 로컬 스토리지에서 모든 데이터 가져오기
    const allData = Object.entries(localStorage)
        .filter(([key, value]) => key.startsWith('sdcg-') && /^\d+$/.test(key.slice(5))) // sdcg-로 시작하면서 숫자로만 이루어진 키만 필터링
        .map(([key, value]) => ({
            numericKey: Number(key.slice(5)),
            data: JSON.parse(value)
        }));     

    // 목표
    const inputGoal =  dataInfo.inputGoal;
    // 목표금액
    const inputGoalMoney = dataInfo.inputGoalMoney;
    // 시작일
    const yearMonthDayText = dataInfo.yearMonthDayText;
    // 누적금액
    const cumulativeAmount = getCumulativeAmountFromBaseDate(allData, dataInfo.yearMonthDayText);    
    
    var data = google.visualization.arrayToDataTable([
        ["Element", "금액", { role: "style" } ],
        ["목표", parseMoney(inputGoalMoney), "#FF6347"],
        ["누적", parseMoney(cumulativeAmount), "#1E90FF"]
      ]);

    var view = new google.visualization.DataView(data);
    view.setColumns([0, 1,
                    { calc: "stringify",
                        sourceColumn: 1,
                        type: "string",
                        role: "annotation" },
                    2]);

    var options = {
    title: inputGoal + " (시작일 : " + yearMonthDayText + ")",
    width: "100%",
    height: "auto",
    bar: {groupWidth: "80%"},
    legend: { position: "none" },
    hAxis: {
        textStyle: {
            fontSize: 15, // 하단 라벨 텍스트 크기
        },
    },
    annotations: {
        textStyle: {
            fontSize: 18, // bar 안의 주석 텍스트 크기
        },
    },   
    };
    var chart = new google.visualization.BarChart(document.getElementById("barchart"));
    chart.draw(view, options);
}
window.drawBarChart = drawBarChart;
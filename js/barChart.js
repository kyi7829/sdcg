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

    // 목표 :
    // 목표 금액 : 
    // 기준일 : 
    // 현재까지의 누적 금액 : 



    
    var data = google.visualization.arrayToDataTable([
        ["Element", "금액", { role: "style" } ],
        ["목표", 1000, "#FF6347"],
        ["누적", 200, "#1E90FF"]
      ]);

      var view = new google.visualization.DataView(data);
      view.setColumns([0, 1,
                       { calc: "stringify",
                         sourceColumn: 1,
                         type: "string",
                         role: "annotation" },
                       2]);

      var options = {
        title: "나이키 조던 구매하기" + " (단위 : 천원)",
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



    // // 로컬 스토리지에서 모든 데이터 가져오기
    // const allData = Object.entries(localStorage)
    //     .filter(([key, value]) => key.startsWith('sdcg-') && /^\d+$/.test(key.slice(5))) 
    //     .map(([key, value]) => ({
    //         numericKey: Number(key.slice(5)),
    //         data: JSON.parse(value)
    //     }));

    // const today = new Date();

    // // 데이터가 없을경우 
    // if (allData.length == 0) {
        
    // }

    // // 데이터 배열 처리
    // var localData = [];

    // // 헤더 추가
    // localData.unshift(['구분', '이번 달 항목별 차트']);

    // allData.forEach(item => {
        
    //     var existingItemIndex = localData.findIndex(entry => entry[0] === item.data.selectedItem);

    //     if (existingItemIndex !== -1) {
    //         localData[existingItemIndex][1] += parseMoney(item.data.money);
    //     } else {
    //         localData.push([item.data.selectedItem, parseMoney(item.data.money)]);
    //     }
    // });

    // // 테스트용 데이터
    // var testData = google.visualization.arrayToDataTable([
    //     ['Element', 'Density',{ role: 'style' }],
    //     ['목표', 150, 'color: #e5e4e2' ], // CSS-style declaration
    //     ['현재', 10, 'color: #e5e4e2' ], // CSS-style declaration
    //  ]);

    // // 차트 생성
    // var data = google.visualization.arrayToDataTable(localData);

    // var options = {
    // title: '나이키 조던 구매까지 (단위 : 천원)'
    // };

    // const barchart = document.getElementById('barchart');

    // var chart = new google.visualization.BarChart(barchart);
    // chart.draw(testData, options);
    
    // chart.draw(data, options);
}
window.drawChart = drawChart;
// 메인화면 데이터 최신화
function getLocalStorageData() {
    
    // 로컬 스토리지에서 모든 데이터 가져오기
    const allData = Object.entries(localStorage)
        .filter(([key, value]) => key.startsWith('sdcg-') && /^\d+$/.test(key.slice(5))) // sdcg-로 시작하면서 숫자로만 이루어진 키만 필터링
        .map(([key, value]) => ({
            numericKey: Number(key.slice(5)),
            data: JSON.parse(value)
        }));

    // 도넛차트 이미지 출력
    if (allData.length == 0) {
        document.querySelector('#donutImage').style.display = 'block';
        document.querySelector('#donutImage i').style.display = 'block';
        document.querySelector('#donutImage div').style.display = 'block';        
    } else {
        document.querySelector('#donutImage').style.display = 'none';
        document.querySelector('#donutImage i').style.display = 'none';
        document.querySelector('#donutImage div').style.display = 'none';
    } 

    // 데이터의 "money" 값을 정수로 파싱하여 더한 후 다시 형식을 변환하는 함수
    function calculateTotalMoney(data) {
        let totalMoney = 0;
        for (const item of data) {
            // "money" 값에서 콤마(,)와 "원" 문자를 모두 제거한 후 정수로 파싱
            const money = parseInt(item.data.money.replace(/,/g, '').replace('원', ''), 10);
            totalMoney += money;
        }
        return totalMoney;
    }

    // =====================================================================================================================================
    // 이번 달, 이번 주, 오늘의 데이터 필터링
    const today = new Date();

    // month
    const thisMonthData = allData.filter((item) => {
        const itemDate = new Date(`${item.data.yearMonthDay} ${item.data.hourMinute}`);
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
        const itemDate = new Date(`${item.data.yearMonthDay} ${item.data.hourMinute}`);
        return itemDate >= thisWeekStart && itemDate <= thisWeekEnd;
    });    

    // day
    const todayData = allData.filter((item) => {
        const itemDate = new Date(`${item.data.yearMonthDay} ${item.data.hourMinute}`);
        return itemDate.getDate() === today.getDate();
    });

    // 각 항목에 데이터 출력
    document.getElementById('monthlySavings').textContent = calculateTotalMoney(thisMonthData).toLocaleString() + '원';
    document.getElementById('weeklySavings').textContent = calculateTotalMoney(thisWeekData).toLocaleString() + '원';
    document.getElementById('dailySavings').textContent = calculateTotalMoney(todayData).toLocaleString() + '원';
    // =====================================================================================================================================

    // key를 기준으로 내림차순으로 정렬
    allData.sort((a, b) => {
        const keyA = a.key ? parseInt(a.key.replace('sdcg-', ''), 10) : 0;
        const keyB = b.key ? parseInt(b.key.replace('sdcg-', ''), 10) : 0;
    
        return keyB - keyA;
    });

    // 최근 3개의 데이터 선택
    const recentData = allData.slice(0, 3);

    recentData.forEach((datas, index) => {
        const dateElement = document.getElementById(`recentSavingsDate${index + 1}`);
        const itemElement = document.getElementById(`recentSavingsItem${index + 1}`);
        const moneyElement = document.getElementById(`recentSavingsMoney${index + 1}`);
        
        if (dateElement && itemElement && moneyElement) {
            dateElement.textContent = datas.data.yearMonthDay;
            itemElement.textContent = datas.data.selectedItem;
            moneyElement.textContent = datas.data.money;
        }
    });    
}
window.getLocalStorageData = getLocalStorageData;

document.addEventListener('DOMContentLoaded', function () {

    const guideWrapper = document.getElementById('guideWrapper');

    // 가이드 출력 여부 확인
    if (localStorage.getItem('sdcg-lastPage') == 'index') {
        localStorage.removeItem('sdcg-lastPage');

        if (localStorage.getItem('sdcg-showGuideYn') == 'Y') {
            openGuide();
            localStorage.setItem('sdcg-showGuideYn', 'N');            
        }
    }

    // 메인화면 데이터 최신화
    getLocalStorageData();    
});



// 초기화 플래그
let resetDivision;

// 알림창 출력 플래그 
let showNotificationYn = localStorage.getItem('sdcg-showNotificationYn') === 'true';
let messageContents = localStorage.getItem('sdcg-messageContents');

// 가이드 출력 옵션 변경
function updateLocalStorage(value) {
    localStorage.setItem('sdcg-showGuideYn', value);
}

// 컨펌 모달 출력
function openConfirmModal(division) {
    
    // 컨펌창 text 수정
    if (division == "R") {        
        document.getElementById('confirm-content').textContent = "정말로 초기화 하시겠습니까?";
        document.getElementById('submitModalBtn').textContent  = "초기화";
    } else {
        document.getElementById('confirm-content').textContent = "정말로 삭제 하시겠습니까?";
        document.getElementById('submitModalBtn').textContent  = "삭제";
    }

    modalWrapper.style.display = 'flex';

    resetDivision = division;
}

document.addEventListener('DOMContentLoaded', function () {

    // 가이드 ON/OFF
    const showGuideYn = localStorage.getItem('sdcg-showGuideYn');
    
    if (showGuideYn === 'Y') {
        document.getElementById('bootGuideOn').checked = true;
    } else if (showGuideYn === 'N') {
        document.getElementById('bootGuideOff').checked = true;
    }

    // 수행
    submitModalBtn.addEventListener('click', () => {
        modalWrapper.style.display = 'none';

        // 구분에 따른 작업 수행
        if (resetDivision == 'D') {

            // Local Storage에서 모든 데이터의 key 가져오기
            const allKeys = Object.keys(localStorage);

            // prefix로 시작하는 key만 필터링
            const matchingKeys = allKeys.filter((key) => key.startsWith('sdcg-') && /^\d+$/.test(key.slice(5)));   

            matchingKeys.forEach((key) => {
                localStorage.removeItem(key);
            });

            // 알림창 출력
            showNotification("삭제되었습니다.");

        } else if (resetDivision == 'R') {
            
            // 모든 localStrage 삭제 후 index page로 이동
            const keysToRemove = Object.keys(localStorage).filter((key) => key.startsWith("sdcg-"));

            keysToRemove.forEach((key) => {
                localStorage.removeItem(key);
            });
            
            // 인덱스 페이지로 이동
            window.location.href = '../index-page.html';        
        }        
    });

    // 모달 닫기
    closeModalBtn.addEventListener('click', () => {
        modalWrapper.style.display = 'none';
    });

    // 알림창 출력
    if (showNotificationYn) {
        showNotification(messageContents);

        // 알림창 출력 플래그 변경
        localStorage.setItem('sdcg-showNotificationYn', false);                  
    }
});
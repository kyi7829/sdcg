let resetDivision;

// 컨펌 모달 출력
function openConfirmModal(division) {
    
    // 컨펌창 text 수정
    if (division == "R") {        
        document.getElementById('confirm-content').textContent = "초기화 하시겠습니까?";
        document.getElementById('submitModalBtn').textContent  = "초기화";
    } else {
        document.getElementById('confirm-content').textContent = "삭제 하시겠습니까?";
        document.getElementById('submitModalBtn').textContent  = "삭제";
    }

    modalWrapper.style.display = 'flex';

    resetDivision = division;
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

document.addEventListener('DOMContentLoaded', function () {

    // 수행
    submitModalBtn.addEventListener('click', () => {
        modalWrapper.style.display = 'none';

        // 구분에 따른 작업 수행
        if (resetDivision == 'D') {

            // 로컬 스토리지에서 절약내역 데이터 가져오기
            const allData = Object.entries(localStorage)
                .filter(([key, value]) => /^\d+$/.test(key)) 
                .map(([key, value]) => ({
                    key: Number(key),
                    value: JSON.parse(value)
            }));

            allData.forEach((data) => {
                localStorage.removeItem(data.key);
            });

            // 알림창 출력
            showNotification("삭제되었습니다.");

        } else if (resetDivision == 'R') {

            // FIXME 데이터 저장 형식 변경 후 작업 예정
            // 모든 localStrage 삭제 후 index page로 이동
            

            
        }        
    });

    // 모달 닫기
    closeModalBtn.addEventListener('click', () => {
        modalWrapper.style.display = 'none';
    });
});
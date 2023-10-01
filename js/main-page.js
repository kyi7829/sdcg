// 현재 시각을 가져오는 함수
function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} : ${hours}:${minutes}:${seconds}`;
}

const openModalBtn = document.getElementById('openModalBtn');
const modalWrapper = document.getElementById('modalWrapper');
const closeModalBtn = document.getElementById('closeModalBtn');

document.addEventListener('DOMContentLoaded', function () {
    const modalWrapper = document.getElementById('modalWrapper');
    
    // 모달을 초기에 숨김
    modalWrapper.style.display = 'none';

    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');

    // 모달 열기
    openModalBtn.addEventListener('click', () => {
        modalWrapper.style.display = 'flex';
        
        // 현재 시각을 가져와서 표시
        const currentDateTimeElement = document.getElementById('currentDateTime');
        currentDateTimeElement.textContent = getCurrentDateTime();
    });

    // 모달 닫기
    closeModalBtn.addEventListener('click', () => {
        modalWrapper.style.display = 'none';
    });
});

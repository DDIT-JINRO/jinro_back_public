function openCounselingPopup(url) {
    // 팝업 창의 크기와 위치를 설정합니다.
    const width = 1200;
    const height = 800;
    const left = (screen.width / 2) - (width / 2);
    const top = (screen.height / 2) - (height / 2);

    // 새 팝업 창을 엽니다.
    window.open(url, 'counselingPopup', `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`);
}
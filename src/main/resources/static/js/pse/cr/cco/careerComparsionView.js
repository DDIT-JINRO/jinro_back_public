const sortOrders = {};

document.addEventListener('DOMContentLoaded', function() {
    // 모든 북마크 버튼
    const bookmarkButtons = document.querySelectorAll('.bookmark-button');

    // 이벤트 추가
    bookmarkButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault(); 
            handleBookmarkToggle(this);
        });
    });

    const sortableHeaders = document.querySelectorAll('.comparison-table__category-header--sortable');
    sortableHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const sortKey = header.dataset.sortKey;
            sortTableByColumn(sortKey, header);
        });
    });

    highlightBestValues();

    document.querySelectorAll('.job-card-condensed__remove').forEach(button => {
        button.addEventListener('click', handleRemoveJobColumn);
    });
});

const handleBookmarkToggle = (button) => {
    if (memId == "" || memId == "anonymousUser") {
		showConfirm("로그인 후 이용 가능합니다.","로그인하시겠습니까?", 
		    () => {
		        sessionStorage.setItem("redirectUrl", location.href);
		        location.href = "/login";
		    },
		    () => {
		        
		    }
		);
		return;
    }

    const bmCategoryId = button.dataset.categoryId;
    const bmTargetId = button.dataset.targetId;

    // 현재 버튼이 'active' 클래스를 가지고 있는지 확인
    const isBookmarked = button.classList.contains('is-active');
    
    const data = {
        bmCategoryId: bmCategoryId,
		bmTargetId: bmTargetId
    };

    const apiUrl = isBookmarked ? '/mpg/mat/bmk/deleteBookmark.do' : '/mpg/mat/bmk/insertBookmark.do';

    fetch(apiUrl, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('서버 응답에 실패했습니다.');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
			showConfirm2(data.message,"", 
			    () => {
			    }
			);
			button.classList.toggle('is-active');
        } else {
			showConfirm2("북마크 처리에 실패했습니다.","", 
			   () => {
			    }
			);
        }
    })
    .catch(error => {
        // 네트워크 오류나 서버 응답 실패 시
        console.error('북마크 처리 중 오류 발생:', error);
		showConfirm2("오류가 발생했습니다.","잠시 후 다시 시도해주세요.", 
		   () => {
		    }
		);
    });
}

async function sortTableByColumn(sortKey, clickedHeader) {
    const table = document.querySelector('.comparison-table');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    const headerRow = thead.querySelector('tr');
    const dataRows = Array.from(tbody.querySelectorAll('tr'));

	// 정렬 중임을 표시하고 중복 클릭 방지
	if (table.classList.contains('sorting')) return;
	table.classList.add('sorting');

	// 1. 페이드 아웃 애니메이션 시작
	await fadeOutTable(table);
	
	// 2. 정렬 순서 결정
    const currentOrder = sortOrders[sortKey] === 'desc' ? 'asc' : 'desc';
    sortOrders[sortKey] = currentOrder;
	
    // 3. 컬럼(열) 데이터를 추출하여 배열로 만듭니다.
    const columns = [];
    const jobHeaders = Array.from(headerRow.querySelectorAll('.comparison-table__job-col-header'));

    jobHeaders.forEach((jobHeader, index) => {
        const columnData = {
            headerElement: jobHeader,
            cellElements: dataRows.map(row => row.querySelectorAll('td')[index]),
        };
        
        const sortRow = tbody.querySelector(`[data-sort-key="${sortKey}"]`).closest('tr');
        const sortCell = sortRow.querySelectorAll('td')[index];
        columnData.sortValue = parseSortValue(sortCell.textContent.trim(), sortKey);
        columns.push(columnData);
    });

    // 4. 데이터를 정렬합니다.
    columns.sort((a, b) => {
        if (currentOrder === 'asc') {
            return a.sortValue - b.sortValue;
        } else {
            return b.sortValue - a.sortValue;
        }
    });

    // 5. 정렬된 순서에 따라 DOM을 재배치합니다.
    columns.forEach(column => {
        headerRow.appendChild(column.headerElement);
        column.cellElements.forEach(cell => cell.parentElement.appendChild(cell));
    });

    // 6. 정렬 상태 시각적 표시 업데이트
    updateSortIndicator(clickedHeader, currentOrder);
	
	// 7. 최고 값 강조 업데이트
	highlightBestValues();

	// 8. 페이드 인 애니메이션
	await fadeInTable(table);

	// 정렬 완료
	table.classList.remove('sorting');
}

/**
 * ===================================================
 * 데이터와 관련된 부분 정렬을 위한 기준을 정의하는 곳
 * ===================================================
 */

function parseSortValue(text, key) {
    switch (key) {
        case 'salary': // '억'과 '만원' 단위를 모두 처리하여 '만원' 단위로 통일합니다.
            let salary = 0;
            if (text.includes('억')) {
                // "억"이 포함된 경우, 해당 숫자를 만원 단위로 변환 (1억 -> 10000)
                const billions = text.match(/(\d+)억/);
                if (billions) {
                    salary += parseInt(billions[1], 10) * 10000;
                }
            }
            if (text.includes('만원')) {
                // "만원"이 포함된 경우, 해당 숫자를 더합니다.
                const millions = text.match(/(\d+)만원/);
                if (millions) {
                    salary += parseInt(millions[1], 10);
                }
            }
            // "1억" 처럼 만원 단위가 없을 경우를 대비해, salary가 0이면 그냥 숫자만 파싱
            if (salary === 0) {
                 return parseInt(text.replace(/[^0-9]/g, ''), 10) || 0;
            }
            return salary;

        case 'satisfaction':
            return parseInt(text.replace('%', ''), 10) || 0;

        case 'prospect':
            // 실제 데이터에 맞게 랭킹 시스템을 확장합니다.
            const prospectRank = {
                '증가': 5,
                '다소 증가': 4,
                '유지': 3,
                '다소 감소': 2,
                '감소': 1,
            };
            return prospectRank[text] || -1; // 순위가 없는 경우 맨 뒤로

        case 'education':
            // 학력 순서에 따라 숫자 값을 부여 (높을수록 좋음)
            const eduRank = { '대학원졸이상': 5, '대학원졸': 4, '대졸': 3, '전문대졸': 2, '고졸이하': 1, '고졸': 1 };
            return eduRank[text] || 0;
            
        default:
            return 0;
    }
}

/**
 * 정렬된 헤더에 시각적 표시를 업데이트합니다.
 * @param {HTMLElement} activeHeader - 현재 클릭된 헤더
 * @param {string} order - 정렬 순서 ('asc' 또는 'desc')
 */
function updateSortIndicator(activeHeader, order) {
    // 모든 헤더에서 활성 클래스와 아이콘 초기화
    document.querySelectorAll('.comparison-table__category-header--sortable').forEach(header => {
        header.classList.remove('comparison-table__category-header--sort-active');
        header.textContent = header.textContent.replace(/ [↑↓]$/, ' ↕');
    });

    // 현재 클릭된 헤더에만 활성 클래스 추가
    activeHeader.classList.add('comparison-table__category-header--sort-active');
    
    // 정렬 방향 아이콘 변경
    const arrow = order === 'desc' ? ' ↓' : ' ↑';
    activeHeader.textContent = activeHeader.textContent.replace(' ↕', '') + arrow;
}

/**
 * 각 비교 항목(행)에서 가장 높은 값을 찾아 'highlight-best' 클래스를 적용합니다.
 */
function highlightBestValues() {
    const tbody = document.querySelector('.comparison-table__body');
    // 정렬 가능한 행들만 대상으로 합니다.
    const sortableRows = tbody.querySelectorAll('.comparison-table__category-header--sortable');

    sortableRows.forEach(header => {
        const sortKey = header.dataset.sortKey;
        const row = header.parentElement;
        const cells = Array.from(row.querySelectorAll('td'));

        if (cells.length === 0) return;

        let maxValue = -Infinity;
        // 1. 최고 값 찾기
        cells.forEach(cell => {
            const value = parseSortValue(cell.textContent.trim(), sortKey);
            if (value > maxValue) {
                maxValue = value;
            }
        });

        // 2. 최고 값과 일치하는 모든 셀에 클래스 추가
        cells.forEach(cell => {
             const value = parseSortValue(cell.textContent.trim(), sortKey);
             if (value === maxValue) {
                 cell.classList.add('comparison-table__cell--highlighted');
             } else {
                 // 다른 정렬을 위해 이전에 적용된 클래스가 있다면 제거
                 cell.classList.remove('comparison-table__cell--highlighted');
             }
        });
    });
}

/**
 * X 버튼 클릭 시 해당 직업의 열 전체를 삭제합니다.
 * @param {Event} event - 클릭 이벤트 객체
 */
function handleRemoveJobColumn(event) {
    // 1. 클릭된 버튼이 속한 헤더(th)를 찾습니다.
    const headerCell = event.target.closest('.comparison-table__job-col-header');
    if (!headerCell) return;
	
    // 2. 전체 직업 헤더 목록에서 현재 헤더의 인덱스(순서)를 찾습니다.
    const allHeaderCells = Array.from(document.querySelectorAll('.comparison-table__header .comparison-table__job-col-header'));
	
	if (allHeaderCells.length <= 2) {
		showConfirm2("비교를 위해 최소 2개의 직업이 필요합니다.","", 
		    () => {
		    }
		);
		return;
	}
	
    const columnIndex = allHeaderCells.indexOf(headerCell);
    
    if (columnIndex === -1) return;

    // 3. 해당 인덱스의 헤더(th)를 삭제합니다.
    headerCell.remove();

    // 4. 본문의 모든 행(tr)을 순회하며 해당 인덱스의 데이터(td)를 삭제합니다.
    const dataRows = document.querySelectorAll('.comparison-table__body .comparison-table__row');
    dataRows.forEach(row => {
        const cellToRemove = row.querySelectorAll('td')[columnIndex];
        if (cellToRemove) {
            cellToRemove.remove();
        }
    });
    
    // 5. 중요: 열이 삭제되었으므로, 남은 데이터를 기준으로 최고 값 강조와 막대그래프를 다시 계산합니다.
    highlightBestValues();
}

// 페이드 아웃 애니메이션
function fadeOutTable(table) {
    return new Promise(resolve => {
        table.style.transition = 'opacity 0.3s ease-out';
        table.style.opacity = '0.3';
        
        // 컬럼들에 개별 애니메이션 효과
        const columns = table.querySelectorAll('th:not(:first-child), td');
        columns.forEach((col, index) => {
            setTimeout(() => {
                col.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease-out';
                col.style.transform = 'translateY(-10px)';
                col.style.opacity = '0.2';
            }, index * 20); // 순차적으로 애니메이션
        });

        setTimeout(resolve, 200);
    });
}

// 페이드 인 애니메이션
function fadeInTable(table) {
    return new Promise(resolve => {
        const columns = table.querySelectorAll('th:not(:first-child), td');
        
        // 컬럼들 순차적으로 나타나기
        columns.forEach((col, index) => {
            setTimeout(() => {
                col.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
                col.style.transform = 'translateY(0)';
                col.style.opacity = '1';
            }, index * 30);
        });

        // 전체 테이블 페이드 인
        setTimeout(() => {
            table.style.opacity = '1';
            setTimeout(() => {
                // 애니메이션 완료 후 스타일 정리
                table.style.transition = '';
                columns.forEach(col => {
                    col.style.transition = '';
                    col.style.transform = '';
                });
                resolve();
            }, 200);
        }, 300);
    });
}
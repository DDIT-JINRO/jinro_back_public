const sortOrders = {};

document.addEventListener('DOMContentLoaded', function() {
	document.querySelectorAll('.comparison-table__category-header--sortable').forEach(header => {
		header.addEventListener('click', () => {
			const sortKey = header.dataset.sortKey;
			sortTableByColumn(sortKey, header);
		});
	});

    highlightBestValues();
	
	document.querySelectorAll('.job-card-condensed__remove').forEach(button => {
		button.addEventListener('click', handleRemoveColumn);
	});
	
	document.querySelectorAll('.bookmark-button').forEach(button => {
		button.addEventListener('click', function(event) {
			event.preventDefault();
			// 함수 전달
			handleBookmarkToggle(this);
		});
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

    // 3. 컬럼 데이터 추출 및 정렬
    const columns = [];
    const colHeaders = Array.from(headerRow.querySelectorAll('.comparison-table__job-col-header'));

	colHeaders.forEach((colHeader, index) => {
	    const columnData = {
	        headerElement: colHeader,
	        cellElements: dataRows.map(row => row.querySelectorAll('td')[index]),
	    };
	    const sortRow = tbody.querySelector(`[data-sort-key="${sortKey}"]`).closest('tr');
	    const sortCell = sortRow.querySelectorAll('td')[index];
	    columnData.sortValue = parseSortValue(sortCell.textContent.trim(), sortKey);
	    columns.push(columnData);
	});

    // 4. 데이터 정렬
    columns.sort((a, b) => {
        if (currentOrder === 'asc') {
            return a.sortValue - b.sortValue;
        } else {
            return b.sortValue - a.sortValue;
        }
    });

    // 5. DOM 재배치
    columns.forEach(column => {
        headerRow.appendChild(column.headerElement);
        column.cellElements.forEach(cell => cell.parentElement.appendChild(cell));
    });

    // 6. 정렬 상태 표시 업데이트
    updateSortIndicator(clickedHeader, currentOrder);
    
    // 7. 최고 값 강조 업데이트
    highlightBestValues();

    // 8. 페이드 인 애니메이션
    await fadeInTable(table);

    // 정렬 완료
    table.classList.remove('sorting');
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


function parseSortValue(text, key) {
	switch (key) {
	        case 'admissionRate':
	            // "5.9:1" 형식에서 경쟁률 숫자 부분만 추출
	            const ratio = text.match(/(\d+\.?\d*):1/);
	            return ratio ? parseFloat(ratio[1]) : 0;

	        case 'avgSalary':
	        case 'avgTuitionFormatted': 
	        case 'avgScholarFormatted':
	            // "181만원", "549만원" 형식에서 숫자 부분만 추출
	            const amount = text.match(/(\d+)만원/);
	            return amount ? parseInt(amount[1], 10) : 0;

	        case 'satisfactionAvg':
	            // "B+ (3.8)" 형식에서 괄호 안의 숫자 추출
	            const satisfaction = text.match(/\((\d+\.?\d*)\)/);
	            return satisfaction ? parseFloat(satisfaction[1]) : 0;

	        case 'empRate':
	            // "48.3 %" 형식에서 숫자 부분만 추출
	            return parseFloat(text.replace(/[^0-9.]/g, '')) || 0;
        
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
    const arrow = order === 'desc' ? ' ↑' : ' ↓';
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

function handleRemoveColumn(event) {
	const headerCell = event.target.closest('.comparison-table__job-col-header');
	if (!headerCell) return;

	const allHeaderCells = Array.from(document.querySelectorAll('.comparison-table__header .comparison-table__job-col-header'));

	if (allHeaderCells.length <= 2) {
		showConfirm2("비교를 위해 최소 2개의 학과가 필요합니다.","",
			() => {
			}
		);
		return;
	}

	const columnIndex = allHeaderCells.indexOf(headerCell);
	if (columnIndex === -1) return;

	headerCell.remove();

	const dataRows = document.querySelectorAll('.comparison-table__body .comparison-table__row');
	dataRows.forEach(row => {
	    const cellToRemove = row.querySelectorAll('td')[columnIndex];
	    if (cellToRemove) {
	        cellToRemove.remove();
	    }
	});

	highlightBestValues();
}
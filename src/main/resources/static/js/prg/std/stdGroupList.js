// stdGroupList2.js
document.addEventListener('DOMContentLoaded', function() {
  // 1) 카드 클릭 이동 & 글쓰기 버튼 (기존 로직 그대로)
  document.querySelectorAll('.group-card').forEach(card => {
    card.addEventListener('click', () => {
      location.href = '/prg/std/stdGroupDetail.do?stdGroupId=' + card.dataset.stdbId;
    });
  });

  const btnWrite = document.getElementById('btnWrite');
  if (btnWrite) {
    btnWrite.addEventListener('click', () => {
      if (!memId || memId === 'anonymousUser') {
		showConfirm("로그인 후 이용 가능합니다.", "로그인하시겠습니까?",
			() => {
				sessionStorage.setItem("redirectUrl", location.href);
				location.href = "/login";
			},
			() => {

			}
		);
		return;

      } 
      
	  location.href = '/prg/std/createStdGroup.do';
    });
  }

  // 2) 아코디언 토글 (기존 로직 그대로)
  const toggleButton = document.getElementById('search-filter-toggle');
  const panel        = document.getElementById('search-filter-panel');

  // 아코디언 기능
  if (toggleButton && panel) {
  	toggleButton.addEventListener('click', function() {
  		this.classList.toggle('is-active');
  		panel.classList.toggle('is-open');
  	});
  }

  // 3) 필터 로직
  const selectedContainer = document.querySelector('.search-filter__selected-tags');
  const resetButton       = document.querySelector('.search-filter__reset-button');
  const filterInputs      = Array.from(document.querySelectorAll('.search-filter__option input'));
  // 그룹 이름 집합 (region, gender, interest, maxPeople 등)
  const groupNames = [...new Set(filterInputs.map(i => i.name))];
  const regionRadios = document.querySelectorAll('.search-filter__option input[type="radio"][name="region"]');
  const genderRadios = document.querySelectorAll('.search-filter__option input[type="radio"][name="gender"]');
  const maxPeopleRadios = document.querySelectorAll('.search-filter__option input[type="radio"][name="maxPeople"]');
  const sortOrderRadios = document.querySelectorAll('.search-filter__option input[type="radio"][name="sortOrder"]');
  // helper: filterName(한글 라벨) 얻기
  function getLabel(name) {
    switch(name) {
      case 'region':    return '지역';
      case 'gender':    return '성별';
      case 'interestItems':  return '관심사';
      case 'maxPeople': return '인원제한';
      case 'sortOrder': return '정렬';
      default:          return name;
    }
  }

  // 3-1) 태그 업데이트
  function updateTags() {
	// 이전 선택값 비우기
	regionRadios.forEach(r => {
		if (!r.checked) {
			r.dataset.preChecked = '';
		}
	})
	genderRadios.forEach(r => {
		if (!r.checked) {
			r.dataset.preChecked = '';
		}
	})
	maxPeopleRadios.forEach(r => {
		if (!r.checked) {
			r.dataset.preChecked = '';
		}
	})
	sortOrderRadios.forEach(r => {
		if (!r.checked) {
			r.dataset.preChecked = '';
		}
	})
    selectedContainer.innerHTML = '';
    groupNames.forEach(group => {
      const items = filterInputs.filter(i => i.name === group);
      if (!items.length) return;

      if (items[0].type === 'radio') {
        // radio: 선택된 하나만
        const sel = items.find(i => i.checked && i.value !== '');
        if (sel){
			sel.dataset.preChecked = 'true'
			createTag(sel);
		}
      } else {
        // checkbox: 다중 선택
        items.filter(i => i.checked).forEach(sel => {
          createTag(sel);
        });
      }
    });
  }

  // 3-2) 태그 생성 함수
  function createTag(inputEl) {
    const txt    = inputEl.nextElementSibling.textContent.trim();
    const name   = inputEl.name;
    const label  = getLabel(name);
    const tag    = document.createElement('span');
    tag.className = 'search-filter__tag';
    // dataset 에 input name 보관
    tag.dataset.inputName = name;
    tag.innerHTML = `
      ${label} > ${txt}
      <button type="button" class="search-filter__tag-remove" aria-label="삭제 ${txt}">×</button>
    `;
    selectedContainer.appendChild(tag);
  }

	// 3-3) input change: radio만 단일 선택 강제
	filterInputs.forEach(input => {
		input.addEventListener('change', function() {

			if (this.type === 'radio') {
				// 같은 그룹 다른 radio 해제
				filterInputs
					.filter(other => other !== this && other.name === this.name)
					.forEach(other => other.checked = false);
			}
			// checkbox는 다중 허용 -> 해제 로직 없음
			updateTags();
		});
		input.addEventListener('click', function(e){
			if(input.type=='radio' && input.dataset.preChecked == 'true'){
				input.dataset.preChecked = '';
				input.checked = false;
				updateTags();
			}
		})

	});

  // 3-4) 태그 내 × 클릭 -> 해당 input만 해제
  selectedContainer.addEventListener('click', function(e) {
    if (e.target.classList.contains('search-filter__tag-remove')) {
      const tag     = e.target.closest('.search-filter__tag');
      const name    = tag.dataset.inputName;
      const txt     = tag.textContent.replace('×','').split('>')[1].trim();
      // 동일 name & 동일 라벨 텍스트인 input 찾기
      filterInputs.forEach(input => {
        if (input.name === name
            && input.nextElementSibling.textContent.trim() === txt) {
          input.checked = false;
        }
      });
      updateTags();
    }
  });

  // 3-5) 초기화 버튼 -> 모든 checkbox 해제, 모든 radio 기본값(all) 체크
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      filterInputs.forEach(input => {
        if (input.type === 'radio') {
          // 기본값이 '' 또는 'all'인 라디오만 체크
          input.checked = (input.value === '');
        } else {
          // checkbox 전부 해제
          input.checked = false;
        }
      });
      updateTags();
    });
  }

  // 초기 로드 시 태그 세팅
  updateTags();
});

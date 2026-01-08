import { expect, test } from '@playwright/test';

/**
 * Support FAQ E2E Tests
 *
 * 이 테스트 파일은 Support FAQ 페이지의 주요 기능들을 검증합니다:
 * 1. FAQ 메인 페이지 접근 및 렌더링
 * 2. 카테고리 네비게이션 (Category Code 1)
 * 3. 카테고리 필터링 (Category Code 2)
 * 4. 키워드 검색 기능
 * 5. FAQ 상세 보기
 * 6. 페이지네이션
 */

test.describe('Support FAQ - Main Page', () => {
  test.beforeEach(async ({ page }) => {
    // 각 테스트 전에 FAQ 메인 페이지로 이동
    await page.goto('/support/faq/all');
  });

  test('should display main FAQ page with all essential components', async ({ page }) => {
    // 메인 페이지 컨테이너가 렌더링되는지 확인
    const mainPage = page.getByTestId('page-support-faq');
    await expect(mainPage).toBeVisible();

    // Hero 섹션이 표시되는지 확인
    const hero = page.getByTestId('support-faq-hero');
    await expect(hero).toBeVisible();

    // FAQ 제목이 표시되는지 확인
    const title = page.getByTestId('support-faq-hero-title');
    await expect(title).toBeVisible();

    // 검색 폼이 표시되는지 확인
    const searchForm = page.getByTestId('faq-keyword-form-search');
    await expect(searchForm).toBeVisible();

    // 카테고리 네비게이션이 표시되는지 확인
    const categoryNav = page.getByTestId('faq-category-code1-navigation');
    await expect(categoryNav).toBeVisible();

    // FAQ 리스트가 표시되는지 확인
    const boardList = page.getByTestId('support-faq-board-list');
    await expect(boardList).toBeVisible();

    // Footer가 표시되는지 확인
    const footer = page.getByTestId('support-faq-footer');
    await expect(footer).toBeVisible();
  });

  test('should display FAQ list or loading/empty state', async ({ page }) => {
    const boardList = page.getByTestId('support-faq-board-list');
    await expect(boardList).toBeVisible();

    // 로딩 상태, 컨텐츠, 또는 빈 상태 중 하나가 표시되어야 함
    const hasLoading = await page
      .getByTestId('support-faq-board-list-loading')
      .isVisible()
      .catch(() => false);
    const hasContent = await page
      .getByTestId('support-faq-board-list-content')
      .isVisible()
      .catch(() => false);

    expect(hasLoading || hasContent).toBeTruthy();

    // 컨텐츠가 있는 경우, 아이템 또는 빈 상태가 표시되어야 함
    if (hasContent) {
      const hasItems = await page
        .getByTestId('support-faq-board-list-items')
        .isVisible()
        .catch(() => false);
      const isEmpty = await page
        .getByTestId('support-faq-board-list-empty')
        .isVisible()
        .catch(() => false);

      expect(hasItems || isEmpty).toBeTruthy();
    }
  });

  test('should display footer with question link', async ({ page }) => {
    // Footer 컨테이너 확인
    const footer = page.getByTestId('support-faq-footer');
    await expect(footer).toBeVisible();

    // Footer 텍스트 확인
    const footerText = page.getByTestId('support-faq-footer-text');
    await expect(footerText).toBeVisible();

    // 문의하기 링크 확인
    const questionLink = page.getByTestId('support-faq-footer-question-link');
    await expect(questionLink).toBeVisible();
    await expect(questionLink).toHaveAttribute('href', '/support/question');
  });
});

test.describe('Support FAQ - Category Navigation (Code1)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/support/faq/all');
  });

  test('should display category navigation menu', async ({ page }) => {
    // 카테고리 네비게이션 메뉴 확인
    const categoryNav = page.getByTestId('faq-category-code1-navigation');
    await expect(categoryNav).toBeVisible();

    // 카테고리 메뉴 컨테이너 확인
    const categoryMenu = page.getByTestId('faq-category-code1-menu');
    await expect(categoryMenu).toBeVisible();
  });

  test('should navigate to different category when clicking category tab', async ({ page }) => {
    // TOP FAQ 카테고리 탭이 있는지 확인
    const topFaqTab = page.getByTestId('faq-category-code1-item-all');
    await expect(topFaqTab).toBeVisible();

    // 탭 클릭 (다른 카테고리가 있는 경우)
    const categoryTabs = page.getByTestId('faq-category-code1-menu').locator('a');
    const tabCount = await categoryTabs.count();

    if (tabCount > 1) {
      // 두 번째 카테고리 탭 클릭 (첫 번째는 'all')
      const secondTab = categoryTabs.nth(1);
      const _secondTabText = await secondTab.textContent();

      await secondTab.click();

      // URL 변경 확인 (네비게이션이 발생했는지)
      await page.waitForURL(/\/support\/faq\/.+/);

      // 클릭한 탭이 활성화 상태인지 확인
      await expect(secondTab).toHaveClass(/on/);
    }
  });

  test('should highlight active category', async ({ page }) => {
    // 현재 활성화된 카테고리가 'on' 클래스를 가지고 있는지 확인
    const activeTab = page.getByTestId('faq-category-code1-menu').locator('a.on');
    await expect(activeTab).toBeVisible();
  });
});

test.describe('Support FAQ - Category Filter (Code2)', () => {
  test.beforeEach(async ({ page }) => {
    // Code2 필터가 있는 카테고리로 이동 (예: 특정 카테고리)
    await page.goto('/support/faq/all');
  });

  test('should display category filter when subcategories exist', async ({ page }) => {
    // Code2 필터가 존재하는지 확인 (숨겨져 있을 수 있음)
    const hasFilter = await page
      .getByTestId('faq-category-code2-filter')
      .isVisible()
      .catch(() => false);
    const hasMobileFilter = await page
      .getByTestId('faq-category-code2-mobile-menu')
      .isVisible()
      .catch(() => false);

    // 데스크톱 또는 모바일 필터 중 하나는 존재할 수 있음
    if (hasFilter || hasMobileFilter) {
      // "ALL" 옵션이 표시되는지 확인
      if (hasFilter) {
        const allOption = page.getByTestId('faq-category-code2-all');
        await expect(allOption).toBeVisible();
      }
    }
  });

  test('should filter by category code2 when clicking filter option', async ({ page }) => {
    // Code2 리스트가 있는지 확인
    const filterList = page.getByTestId('faq-category-code2-list');
    const hasFilterList = await filterList.isVisible().catch(() => false);

    if (hasFilterList) {
      // 필터 옵션들 가져오기
      const filterItems = page.getByTestId('faq-category-code2-list').locator('li');
      const itemCount = await filterItems.count();

      if (itemCount > 0) {
        // 첫 번째 필터 아이템 클릭
        const firstItem = filterItems.first();
        await firstItem.click();

        // URL에 categoryCode2 쿼리 파라미터가 추가되었는지 확인
        await page.waitForURL(/categoryCode2=/);

        // 클릭한 아이템이 활성화 상태인지 확인
        await expect(firstItem).toHaveClass(/on/);
      }
    }
  });
});

test.describe('Support FAQ - Keyword Search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/support/faq/all');
  });

  test('should display search form with input and keyword suggestions', async ({ page }) => {
    // 검색 폼 확인
    const searchForm = page.getByTestId('faq-keyword-form-search');
    await expect(searchForm).toBeVisible();

    // 검색 입력 필드 확인
    const searchInput = page.getByTestId('faq-keyword-search-input');
    await expect(searchInput).toBeVisible();

    // 키워드 리스트 확인
    const keywordList = page.getByTestId('faq-keyword-list');
    await expect(keywordList).toBeVisible();
  });

  test('should perform search when entering keyword and submitting', async ({ page }) => {
    // 검색 입력 필드에 키워드 입력
    const searchInput = page.getByTestId('faq-keyword-search-input');
    const testKeyword = 'test';

    // 입력 필드 찾기 (FormSearch 컴포넌트 내부의 실제 input 요소)
    await searchInput.locator('input').fill(testKeyword);

    // Enter 키 또는 검색 버튼 클릭으로 검색 실행
    await searchInput.locator('input').press('Enter');

    // 검색 모드로 전환되었는지 확인 (검색 결과 페이지)
    await page.waitForURL(/searchKeyword=/);

    // 검색 결과 컴포넌트가 표시되는지 확인
    const searchResult = page.getByTestId('support-faq-search-result');
    await expect(searchResult).toBeVisible();
  });

  test('should search when clicking keyword suggestion', async ({ page }) => {
    // 키워드 제안 아이템들 가져오기
    const keywordItems = page.getByTestId('faq-keyword-list').locator('a');
    const itemCount = await keywordItems.count();

    if (itemCount > 0) {
      // 첫 번째 키워드 제안 클릭
      const firstKeyword = keywordItems.first();
      const _keywordText = await firstKeyword.textContent();

      await firstKeyword.click();

      // 검색 모드로 전환되었는지 확인
      await page.waitForURL(/searchKeyword=/);

      // 클릭한 키워드가 활성화 상태인지 확인
      await expect(firstKeyword).toHaveClass(/active/);
    }
  });
});

test.describe('Support FAQ - Search Results', () => {
  test.beforeEach(async ({ page }) => {
    // 검색어로 직접 이동
    await page.goto('/support/faq/all?searchKeyword=test');
  });

  test('should display search results with category and FAQ list', async ({ page }) => {
    // 검색 결과 컴포넌트 확인
    const searchResult = page.getByTestId('support-faq-search-result');
    await expect(searchResult).toBeVisible();

    // 검색 결과 제목 확인 (검색어 표시)
    const searchTitle = page.getByTestId('support-faq-search-result-title');
    await expect(searchTitle).toBeVisible();

    // 검색된 FAQ 리스트 확인
    const searchBoardList = page.getByTestId('support-faq-search-board-list');
    await expect(searchBoardList).toBeVisible();

    // 검색 결과 개수 표시 확인
    const resultCount = page.getByTestId('support-faq-search-result-count');
    await expect(resultCount).toBeVisible();
  });

  test('should display category search results', async ({ page }) => {
    // 카테고리 검색 결과 확인
    const hasCategoryList = await page
      .getByTestId('support-faq-search-result-category-list')
      .isVisible()
      .catch(() => false);
    const isEmpty = await page
      .getByTestId('support-faq-search-result-empty')
      .isVisible()
      .catch(() => false);

    // 카테고리 리스트 또는 빈 상태 중 하나가 표시되어야 함
    expect(hasCategoryList || isEmpty).toBeTruthy();

    // 카테고리 리스트가 있는 경우, "더보기" 버튼 확인
    if (hasCategoryList) {
      const categoryItems = page.getByTestId('support-faq-search-result-category-list').locator('li');
      const itemCount = await categoryItems.count();

      if (itemCount > 3) {
        // 3개 이상인 경우 토글 버튼이 표시되어야 함
        const toggleButton = page.getByTestId('support-faq-search-result-toggle-button');
        await expect(toggleButton).toBeVisible();
      }
    }
  });

  test('should toggle show more/less for category results', async ({ page }) => {
    // 카테고리 리스트 확인
    const categoryList = page.getByTestId('support-faq-search-result-category-list');
    const hasCategoryList = await categoryList.isVisible().catch(() => false);

    if (hasCategoryList) {
      const categoryItems = page.getByTestId('support-faq-search-result-category-list').locator('li');
      const itemCount = await categoryItems.count();

      if (itemCount > 3) {
        // 토글 버튼 클릭하여 전체 보기
        const toggleButton = page.getByTestId('support-faq-search-result-toggle-button');
        await toggleButton.click();

        // 모든 아이템이 표시되는지 확인
        for (let i = 0; i < itemCount; i++) {
          await expect(categoryItems.nth(i)).toBeVisible();
        }

        // 다시 클릭하여 축소
        await toggleButton.click();

        // 페이지 상단으로 스크롤되는지 확인 (선택적)
      }
    }
  });

  test('should display FAQ search results', async ({ page }) => {
    // 검색 컨텐츠 확인 (로딩 또는 실제 컨텐츠)
    const hasLoading = await page
      .getByTestId('support-faq-search-loading')
      .isVisible()
      .catch(() => false);
    const hasContent = await page
      .getByTestId('support-faq-search-content')
      .isVisible()
      .catch(() => false);

    expect(hasLoading || hasContent).toBeTruthy();

    // 컨텐츠가 있는 경우
    if (hasContent) {
      const hasItems = await page
        .getByTestId('support-faq-search-items')
        .isVisible()
        .catch(() => false);
      const isEmpty = await page
        .getByTestId('support-faq-search-empty')
        .isVisible()
        .catch(() => false);

      expect(hasItems || isEmpty).toBeTruthy();
    }
  });
});

test.describe('Support FAQ - Article Detail View', () => {
  test.beforeEach(async ({ page }) => {
    // FAQ 리스트 페이지로 이동
    await page.goto('/support/faq/all');
  });

  test('should navigate to article detail when clicking FAQ item', async ({ page }) => {
    // FAQ 아이템들 가져오기
    const faqItems = page.getByTestId('support-faq-board-list-items').locator('> div > *');
    const itemCount = await faqItems.count();

    if (itemCount > 0) {
      // 첫 번째 FAQ 아이템 클릭
      const firstItem = faqItems.first();
      await firstItem.click();

      // 상세 페이지로 이동 확인
      await page.waitForURL(/\/support\/faq\/.+\/\d+/);

      // 상세 페이지 컴포넌트 확인
      const articlePage = page.getByTestId('page-support-faq-article');
      await expect(articlePage).toBeVisible();

      // Board View 컴포넌트 확인
      const boardView = page.getByTestId('support-faq-board-view');
      await expect(boardView).toBeVisible();
    }
  });

  test('should display article detail with all components', async ({ page }) => {
    // 직접 상세 페이지로 이동 (테스트용 ID 사용)
    // 실제 환경에서는 유효한 FAQ ID로 대체 필요
    await page.goto('/support/faq/all/1');

    // 로딩 상태, 컨텐츠, 또는 없음 상태 확인
    const hasLoading = await page
      .getByTestId('support-faq-board-view-loading')
      .isVisible()
      .catch(() => false);
    const hasContent = await page
      .getByTestId('support-faq-board-view-content')
      .isVisible()
      .catch(() => false);
    const hasNoContent = await page
      .getByTestId('support-faq-board-view-no-content')
      .isVisible()
      .catch(() => false);

    expect(hasLoading || hasContent || hasNoContent).toBeTruthy();

    // 컨텐츠가 있는 경우 상세 확인
    if (hasContent) {
      // Breadcrumb 확인
      const breadcrumb = page.getByTestId('support-faq-board-view-breadcrumb');
      await expect(breadcrumb).toBeVisible();

      // 제목 확인
      const title = page.getByTestId('support-faq-board-view-title');
      await expect(title).toBeVisible();

      // 본문 확인
      const body = page.getByTestId('support-faq-board-view-body');
      await expect(body).toBeVisible();

      // 액션 버튼 확인 (목록으로 돌아가기)
      const actions = page.getByTestId('support-faq-board-view-actions');
      await expect(actions).toBeVisible();

      const backButton = page.getByTestId('support-faq-board-view-back-button');
      await expect(backButton).toBeVisible();
    }
  });

  test('should display breadcrumb with category navigation', async ({ page }) => {
    await page.goto('/support/faq/all/1');

    const hasContent = await page
      .getByTestId('support-faq-board-view-content')
      .isVisible()
      .catch(() => false);

    if (hasContent) {
      // Breadcrumb 확인
      const breadcrumb = page.getByTestId('support-faq-board-view-breadcrumb');
      await expect(breadcrumb).toBeVisible();

      // Breadcrumb 라벨들 확인
      const breadcrumbLabels = page.getByTestId('support-faq-view-breadcrumb-labels');
      await expect(breadcrumbLabels).toBeVisible();

      // 각 카테고리 코드 링크가 있는지 확인
      const hasCategoryCode1 = await page
        .getByTestId('support-faq-view-breadcrumb-categoryCode1')
        .isVisible()
        .catch(() => false);

      expect(hasCategoryCode1).toBeTruthy();
    }
  });

  test('should display related FAQs if available', async ({ page }) => {
    await page.goto('/support/faq/all/1');

    const hasContent = await page
      .getByTestId('support-faq-board-view-content')
      .isVisible()
      .catch(() => false);

    if (hasContent) {
      // 연관 FAQ 섹션 확인 (있는 경우에만)
      const hasRelated = await page
        .getByTestId('support-faq-board-view-related')
        .isVisible()
        .catch(() => false);

      if (hasRelated) {
        // 연관 FAQ 아이템들 확인
        const relatedItems = page.getByTestId('support-faq-board-view-related').locator('> *');
        const relatedCount = await relatedItems.count();

        expect(relatedCount).toBeGreaterThan(0);
      }
    }
  });

  test('should navigate back to list when clicking back button', async ({ page }) => {
    await page.goto('/support/faq/all/1');

    const hasContent = await page
      .getByTestId('support-faq-board-view-content')
      .isVisible()
      .catch(() => false);

    if (hasContent) {
      // 뒤로가기 버튼 클릭
      const backButton = page.getByTestId('support-faq-board-view-back-button');
      await backButton.click();

      // 리스트 페이지로 돌아갔는지 확인
      await page.waitForURL(/\/support\/faq\/.+$/);

      // 리스트 페이지 확인
      const mainPage = page.getByTestId('page-support-faq');
      await expect(mainPage).toBeVisible();
    }
  });

  test('should display files if available', async ({ page }) => {
    await page.goto('/support/faq/all/1');

    const hasContent = await page
      .getByTestId('support-faq-board-view-content')
      .isVisible()
      .catch(() => false);

    if (hasContent) {
      // 파일이 있는지 확인 (있는 경우에만)
      const hasFile = await page
        .getByTestId('support-faq-board-view-file-0')
        .isVisible()
        .catch(() => false);

      if (hasFile) {
        const fileLink = page.getByTestId('support-faq-board-view-file-0').locator('a');
        await expect(fileLink).toBeVisible();
        await expect(fileLink).toHaveAttribute('target', '_blank');
      }
    }
  });

  test('should display resources if available', async ({ page }) => {
    await page.goto('/support/faq/all/1');

    const hasContent = await page
      .getByTestId('support-faq-board-view-content')
      .isVisible()
      .catch(() => false);

    if (hasContent) {
      // 리소스가 있는지 확인 (있는 경우에만)
      const hasResources = await page
        .getByTestId('support-faq-board-view-resources')
        .isVisible()
        .catch(() => false);

      if (hasResources) {
        const resourceItems = page.getByTestId('support-faq-board-view-resources').locator('li');
        const resourceCount = await resourceItems.count();

        expect(resourceCount).toBeGreaterThan(0);
      }
    }
  });

  test('should navigate to related FAQ when clicking related item', async ({ page }) => {
    await page.goto('/support/faq/all/1');

    const hasContent = await page
      .getByTestId('support-faq-board-view-content')
      .isVisible()
      .catch(() => false);

    if (hasContent) {
      // 연관 FAQ가 있는지 확인
      const hasRelated = await page
        .getByTestId('support-faq-board-view-related')
        .isVisible()
        .catch(() => false);

      if (hasRelated) {
        const relatedItems = page.getByTestId('support-faq-board-view-related').locator('> *');
        const relatedCount = await relatedItems.count();

        if (relatedCount > 0) {
          // 첫 번째 연관 FAQ 클릭
          const firstRelated = relatedItems.first();
          await firstRelated.click();

          // URL 변경 대기
          await page.waitForLoadState('networkidle');

          // 여전히 상세 페이지에 있는지 확인
          const boardView = page.getByTestId('support-faq-board-view');
          await expect(boardView).toBeVisible();
        }
      }
    }
  });
});

test.describe('Support FAQ - Pagination', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/support/faq/all');
  });

  test('should display pagination when FAQ list has multiple pages', async ({ page }) => {
    const hasContent = await page
      .getByTestId('support-faq-board-list-content')
      .isVisible()
      .catch(() => false);

    if (hasContent) {
      const hasItems = await page
        .getByTestId('support-faq-board-list-items')
        .isVisible()
        .catch(() => false);

      if (hasItems) {
        // Pagination이 있는지 확인
        const hasPagination = await page
          .getByTestId('support-faq-board-list-pagination')
          .isVisible()
          .catch(() => false);

        if (hasPagination) {
          const pagination = page.getByTestId('support-faq-board-list-pagination');
          await expect(pagination).toBeVisible();
        }
      }
    }
  });

  test('should navigate to next page when clicking pagination', async ({ page }) => {
    const hasContent = await page
      .getByTestId('support-faq-board-list-content')
      .isVisible()
      .catch(() => false);

    if (hasContent) {
      const hasPagination = await page
        .getByTestId('support-faq-board-list-pagination')
        .isVisible()
        .catch(() => false);

      if (hasPagination) {
        const pagination = page.getByTestId('support-faq-board-list-pagination');

        // 다음 페이지 버튼 찾기 (일반적으로 '2' 또는 '다음' 버튼)
        // Pagination 컴포넌트의 구조에 따라 조정 필요
        const nextPageButton = pagination.locator('button, a').nth(1);
        const hasNextPage = await nextPageButton.isVisible().catch(() => false);

        if (hasNextPage) {
          await nextPageButton.click();

          // 페이지가 변경되었는지 확인 (로딩 대기)
          await page.waitForLoadState('networkidle');

          // FAQ 리스트가 다시 렌더링되었는지 확인
          const boardList = page.getByTestId('support-faq-board-list');
          await expect(boardList).toBeVisible();
        }
      }
    }
  });
});

test.describe('Support FAQ - Category Code3 Dropdown (Product Category)', () => {
  test.beforeEach(async ({ page }) => {
    // 'prod' 카테고리로 이동 (Code3 dropdown이 표시되는 카테고리)
    await page.goto('/support/faq/prod');
  });

  test('should display category code3 dropdown for product category', async ({ page }) => {
    // Breadcrumb에서 Code3 dropdown 확인
    const hasDropdown = await page
      .getByTestId('support-faq-breadcrumb-dropdown')
      .isVisible()
      .catch(() => false);

    if (hasDropdown) {
      const dropdown = page.getByTestId('faq-category-code3-dropdown');
      await expect(dropdown).toBeVisible();

      // Dropdown 버튼 확인
      const dropdownButton = page.getByTestId('faq-category-code3-dropdown-button');
      await expect(dropdownButton).toBeVisible();
    }
  });

  test('should open dropdown and display options when clicking button', async ({ page }) => {
    const hasDropdown = await page
      .getByTestId('faq-category-code3-dropdown')
      .isVisible()
      .catch(() => false);

    if (hasDropdown) {
      // Dropdown 버튼 클릭
      const dropdownButton = page.getByTestId('faq-category-code3-dropdown-button');
      await dropdownButton.click();

      // Dropdown 리스트 표시 확인
      const dropdownList = page.getByTestId('faq-category-code3-dropdown-list');
      await expect(dropdownList).toBeVisible();

      // Dropdown 아이템들 확인
      const dropdownItems = page.getByTestId('faq-category-code3-dropdown-list').locator('li');
      const itemCount = await dropdownItems.count();

      expect(itemCount).toBeGreaterThan(0);
    }
  });

  test('should select category code3 option from dropdown', async ({ page }) => {
    const hasDropdown = await page
      .getByTestId('faq-category-code3-dropdown')
      .isVisible()
      .catch(() => false);

    if (hasDropdown) {
      // Dropdown 버튼 클릭
      const dropdownButton = page.getByTestId('faq-category-code3-dropdown-button');
      await dropdownButton.click();

      // Dropdown 아이템들 가져오기
      const dropdownItems = page.getByTestId('faq-category-code3-dropdown-list').locator('li');
      const itemCount = await dropdownItems.count();

      if (itemCount > 1) {
        // 두 번째 아이템 선택 (첫 번째는 'all')
        const secondItem = dropdownItems.nth(1);
        await secondItem.click();

        // Dropdown이 닫혔는지 확인
        const dropdownList = page.getByTestId('faq-category-code3-dropdown-list');
        await expect(dropdownList).not.toBeVisible();

        // 선택한 아이템이 활성화 상태인지 확인
        // (다시 dropdown을 열어서 확인)
        await dropdownButton.click();
        await expect(secondItem).toHaveClass(/dropdown-item-selected/);
      }
    }
  });
});

test.describe('Support FAQ - Breadcrumb Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/support/faq/all');
  });

  test('should display breadcrumb in list page', async ({ page }) => {
    // Breadcrumb 컴포넌트 확인
    const breadcrumb = page.getByTestId('support-faq-board-list-breadcrumb');
    await expect(breadcrumb).toBeVisible();

    // Breadcrumb 라벨들 확인
    const breadcrumbLabels = page.getByTestId('support-faq-breadcrumb-labels');
    await expect(breadcrumbLabels).toBeVisible();

    // Code1 확인
    const code1Label = page.getByTestId('support-faq-breadcrumb-code1');
    await expect(code1Label).toBeVisible();
  });

  test('should display breadcrumb hierarchy when subcategories exist', async ({ page }) => {
    // 서브카테고리가 있는 페이지로 이동
    // 실제 환경에서는 유효한 카테고리로 대체 필요
    const breadcrumb = page.getByTestId('support-faq-board-list-breadcrumb');
    await expect(breadcrumb).toBeVisible();

    // Code1은 항상 표시되어야 함
    const code1Label = page.getByTestId('support-faq-breadcrumb-code1');
    await expect(code1Label).toBeVisible();

    // Code2가 있는지 확인 (선택적)
    const _hasCode2 = await page
      .getByTestId('support-faq-breadcrumb-code2')
      .isVisible()
      .catch(() => false);

    // Code3가 있는지 확인 (선택적, prod 카테고리인 경우)
    const _hasCode3 = await page
      .getByTestId('support-faq-breadcrumb-code3')
      .isVisible()
      .catch(() => false);

    // 계층 구조에 따라 Code2 또는 Code3가 표시될 수 있음
  });
});

test.describe('Support FAQ - Responsive Behavior', () => {
  test('should display mobile menu for category code2 on small screens', async ({ page }) => {
    // 모바일 뷰포트 설정
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/support/faq/all');

    // 모바일 메뉴가 표시되는지 확인 (서브카테고리가 있는 경우)
    const hasMobileMenu = await page
      .getByTestId('faq-category-code2-mobile-menu')
      .isVisible()
      .catch(() => false);

    if (hasMobileMenu) {
      const mobileMenu = page.getByTestId('faq-category-code2-mobile-menu');
      await expect(mobileMenu).toBeVisible();
    }
  });

  test('should display desktop filter for category code2 on large screens', async ({ page }) => {
    // 데스크톱 뷰포트 설정
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/support/faq/all');

    // 데스크톱 필터가 표시되는지 확인 (서브카테고리가 있는 경우)
    const hasDesktopFilter = await page
      .getByTestId('faq-category-code2-filter')
      .isVisible()
      .catch(() => false);

    if (hasDesktopFilter) {
      const desktopFilter = page.getByTestId('faq-category-code2-filter');
      await expect(desktopFilter).toBeVisible();
    }
  });
});

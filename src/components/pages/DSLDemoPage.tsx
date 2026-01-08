/**
 * DSLDemoPage - DSL 시스템 데모
 *
 * Why-First 접근법을 보여주는 실제 예시
 */

import { Page, Region, Section, Group, Item } from '@/components/dsl';

export const DSLDemoPage = () => {
  return (
    <Page>
      {/* Header Region */}
      <Region role="header" className="px-6 py-4 bg-layer-2">
        <Group purpose="navigation" direction="horizontal">
          <Item as="a" href="/" prominence={1}>
            홈
          </Item>
          <Item as="a" href="/about" prominence={2}>
            소개
          </Item>
          <Item as="a" href="/docs" prominence={2}>
            문서
          </Item>
          <Item as="a" href="/contact" prominence={3}>
            연락처
          </Item>
        </Group>
      </Region>

      {/* Main Content Region */}
      <Region role="main" className="px-6">
        {/* Hero Section */}
        <Section prominence={1}>
          <Group purpose="content">
            <Item as="h1" prominence={1}>
              TSX 기반 Why-First 디자인 시스템
            </Item>
            <Item as="p" prominence={2}>
              개발자는 "왜"만 설명하면, 시스템이 "어떻게"를 자동으로 처리합니다.
            </Item>
          </Group>

          <Group purpose="action" direction="horizontal" className="mt-6">
            <Item as="button" prominence={1}>
              시작하기
            </Item>
            <Item as="button" prominence={2}>
              더 알아보기
            </Item>
            <Item as="button" prominence={3}>
              문서 보기
            </Item>
          </Group>
        </Section>

        {/* Features Section */}
        <Section prominence={2} className="mt-12">
          <Group purpose="content">
            <Item as="h2" prominence={1}>
              핵심 기능
            </Item>
          </Group>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <Section prominence={2}>
              <Group purpose="info">
                <Item as="h3" prominence={1}>
                  AI 친화적
                </Item>
                <Item as="p" prominence={2}>
                  명확한 타입과 제약으로 AI가 정확히 생성 가능
                </Item>
              </Group>
            </Section>

            <Section prominence={2}>
              <Group purpose="info">
                <Item as="h3" prominence={1}>
                  타입 안전
                </Item>
                <Item as="p" prominence={2}>
                  TypeScript로 잘못된 사용을 컴파일 타임에 방지
                </Item>
              </Group>
            </Section>

            <Section prominence={2}>
              <Group purpose="info">
                <Item as="h3" prominence={1}>
                  자동 스타일링
                </Item>
                <Item as="p" prominence={2}>
                  purpose + prominence 조합으로 스타일 자동 결정
                </Item>
              </Group>
            </Section>
          </div>
        </Section>

        {/* Form Example Section */}
        <Section prominence={2} className="mt-12">
          <Group purpose="content">
            <Item as="h2" prominence={1}>
              폼 예시
            </Item>
            <Item as="p" prominence={2}>
              purpose="form"으로 자동으로 입력 필드 스타일 적용
            </Item>
          </Group>

          <Group purpose="form" className="mt-6 max-w-md space-y-4">
            <div>
              <Item as="label" prominence={2}>
                이름
              </Item>
              <Item as="input" type="text" placeholder="이름을 입력하세요" prominence={1} />
            </div>

            <div>
              <Item as="label" prominence={2}>
                이메일
              </Item>
              <Item as="input" type="email" placeholder="email@example.com" prominence={1} />
            </div>

            <div>
              <Item as="label" prominence={2}>
                메시지
              </Item>
              <Item as="textarea" rows={4} placeholder="메시지를 입력하세요" prominence={1} />
            </div>
          </Group>

          <Group purpose="action" direction="horizontal" className="mt-6">
            <Item as="button" prominence={1}>
              제출
            </Item>
            <Item as="button" prominence={3}>
              취소
            </Item>
          </Group>
        </Section>

        {/* List Example Section */}
        <Section prominence={2} className="mt-12">
          <Group purpose="content">
            <Item as="h2" prominence={1}>
              리스트 예시
            </Item>
            <Item as="p" prominence={2}>
              purpose="list"로 자동으로 리스트 아이템 스타일 적용
            </Item>
          </Group>

          <Group purpose="list" className="mt-6 max-w-md">
            <Item as="div" prominence={1}>
              첫 번째 아이템 (Primary)
            </Item>
            <Item as="div" prominence={2}>
              두 번째 아이템 (Secondary)
            </Item>
            <Item as="div" prominence={3}>
              세 번째 아이템 (Tertiary)
            </Item>
          </Group>
        </Section>

        {/* Status Example Section */}
        <Section prominence={2} className="mt-12 mb-12">
          <Group purpose="content">
            <Item as="h2" prominence={1}>
              상태 표시 예시
            </Item>
            <Item as="p" prominence={2}>
              purpose="status"로 배지 스타일 자동 적용
            </Item>
          </Group>

          <Group purpose="status" direction="horizontal" className="mt-6">
            <Item as="span" prominence={1}>
              활성
            </Item>
            <Item as="span" prominence={2}>
              대기 중
            </Item>
            <Item as="span" prominence={3}>
              비활성
            </Item>
          </Group>
        </Section>
      </Region>

      {/* Footer Region */}
      <Region role="footer" className="px-6 py-4 bg-layer-2 mt-auto">
        <Group purpose="content">
          <Item as="p" prominence={3}>
            © 2025 DSL Design System. AI가 생성하기 좋은 TSX 기반 시스템.
          </Item>
        </Group>
      </Region>
    </Page>
  );
};

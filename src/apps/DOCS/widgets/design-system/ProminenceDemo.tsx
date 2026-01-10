/**
 * ProminenceDemo - 주목도 시스템 데모 컴포넌트
 *
 * 주목도 시스템이 어떻게 작동하는지 시각적으로 보여줍니다.
 */

import { Content, ContentGroup } from '@/components/types/Atom/Text/role/Content';
import { Section } from '@/components/types/Section/Section.tsx';

export const ProminenceDemo = () => {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">주목도 시스템 (Prominence System)</h1>
        <p className="text-text-secondary mb-8">
          depth와 prominence를 조합하여 자동으로 스타일이 결정됩니다.
        </p>
      </div>

      {/* Depth 0 */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Depth 0 (App Base)</h2>
        <Section role="Container" className="p-6">
          <ContentGroup gap={12}>
            <Content prominence="primary">
              <div>Primary - 가장 중요한 내용 (배경 2%)</div>
            </Content>
            <Content prominence="secondary">
              <div>Secondary - 보조 내용 (배경 1%)</div>
            </Content>
            <Content prominence="tertiary">
              <div>Tertiary - 덜 중요한 내용 (배경 없음)</div>
            </Content>
          </ContentGroup>
        </Section>
      </div>

      {/* Depth 2 */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Depth 2 (Base Surface)</h2>
        <Section role="Container" prominence="Standard" className="p-6">
          <ContentGroup gap={12}>
            <Content prominence="primary">
              <div>Primary - 가장 중요한 내용 (배경 5%)</div>
            </Content>
            <Content prominence="secondary">
              <div>Secondary - 보조 내용 (배경 2.6%)</div>
            </Content>
            <Content prominence="tertiary">
              <div>Tertiary - 덜 중요한 내용 (배경 없음)</div>
            </Content>
          </ContentGroup>
        </Section>
      </div>

      {/* Depth 4 */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Depth 4 (Elevated)</h2>
        <Section role="Container" prominence="Hero" className="p-6">
          <ContentGroup gap={12}>
            <Content prominence="primary">
              <div>Primary - 가장 중요한 내용 (배경 8%)</div>
            </Content>
            <Content prominence="secondary">
              <div>Secondary - 보조 내용 (배경 4.2%)</div>
            </Content>
            <Content prominence="tertiary">
              <div>Tertiary - 덜 중요한 내용 (배경 없음)</div>
            </Content>
          </ContentGroup>
        </Section>
      </div>

      {/* 실제 사용 예시 */}
      <div>
        <h2 className="text-lg font-semibold mb-4">실제 사용 예시 - 파일 목록</h2>
        <Section role="Container" prominence="Standard" className="p-6">
          <ContentGroup gap={16}>
            {/* 파일 1 */}
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <Content prominence="primary">
                  <div className="font-medium">App.tsx</div>
                </Content>
                <Content prominence="secondary">
                  <div className="mt-1">메인 애플리케이션 컴포넌트</div>
                </Content>
                <Content prominence="tertiary">
                  <div className="mt-1">마지막 수정: 2025-01-08</div>
                </Content>
              </div>
            </div>

            {/* 파일 2 */}
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <Content prominence="primary">
                  <div className="font-medium">Layout.tsx</div>
                </Content>
                <Content prominence="secondary">
                  <div className="mt-1">레이아웃 시스템 컴포넌트</div>
                </Content>
                <Content prominence="tertiary">
                  <div className="mt-1">마지막 수정: 2025-01-07</div>
                </Content>
              </div>
            </div>

            {/* 파일 3 */}
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <Content prominence="primary">
                  <div className="font-medium">Content.tsx</div>
                </Content>
                <Content prominence="secondary">
                  <div className="mt-1">주목도 시스템 컴포넌트</div>
                </Content>
                <Content prominence="tertiary">
                  <div className="mt-1">마지막 수정: 2025-01-08</div>
                </Content>
              </div>
            </div>
          </ContentGroup>
        </Section>
      </div>

      {/* 중첩 예시 */}
      <div>
        <h2 className="text-lg font-semibold mb-4">중첩 예시 - 카드 안의 카드</h2>
        <Section role="Container" prominence="Standard" className="p-6">
          <Content prominence="primary">
            <h3>외부 카드 제목</h3>
          </Content>
          <Content prominence="secondary">
            <p className="mt-2">외부 카드 설명</p>
          </Content>

          <Section role="Container" prominence="Standard" className="p-4 mt-4">
            <Content prominence="primary">
              <h4>내부 카드 제목</h4>
            </Content>
            <Content prominence="secondary">
              <p className="mt-2">내부 카드 설명 (depth가 증가하여 배경이 더 진함)</p>
            </Content>
            <Content prominence="tertiary">
              <span className="mt-2 block">내부 카드 메타 정보</span>
            </Content>
          </Section>
        </Section>
      </div>

      {/* 수평 배치 예시 */}
      <div>
        <h2 className="text-lg font-semibold mb-4">수평 배치 - 버튼 그룹</h2>
        <Section role="Container" prominence="Standard" className="p-6">
          <ContentGroup direction="horizontal" gap={12}>
            <Content prominence="primary">
              <button className="px-4 py-2 rounded bg-accent text-white">Primary Action</button>
            </Content>
            <Content prominence="secondary">
              <button className="px-4 py-2 rounded">Secondary Action</button>
            </Content>
            <Content prominence="tertiary">
              <button className="px-4 py-2 rounded">Cancel</button>
            </Content>
          </ContentGroup>
        </Section>
      </div>
    </div>
  );
};

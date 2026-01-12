import { Frame } from '@/components/dsl/shared/Frame';
/**
 * ProminenceDemo - 주목도 시스템 데모 컴포넌트
 *
 * 주목도 시스템이 어떻게 작동하는지 시각적으로 보여줍니다.
 */

import { Block } from '@/components/dsl/Block/Block';
import { Action } from '@/components/dsl/Element/Action/Action';
import { Text } from '@/components/dsl/Element/Text/Text';
import { Section } from '@/components/dsl/Section/Section.tsx';

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
      <Frame.Stack>
        <Text role="Title">Depth 0 (App Base)</Text>
        <Section role="Container">
          <Frame.Stack>
            <Text role="Body" prominence="Standard" content="Primary - 가장 중요한 내용" />
            <Text role="Body" prominence="Standard" content="Secondary - 보조 내용" />
            <Text role="Body" prominence="Subtle" content="Tertiary - 덜 중요한 내용" />
          </Frame.Stack>
        </Section>
      </Frame.Stack>

      {/* Depth 2 */}
      <Frame.Stack>
        <Text role="Title">Depth 2 (Base Surface)</Text>
        <Section role="Container" prominence="Standard">
          <Frame.Stack>
            <Text role="Body" prominence="Standard" content="Primary - 가장 중요한 내용" />
            <Text role="Body" prominence="Standard" content="Secondary - 보조 내용" />
            <Text role="Body" prominence="Subtle" content="Tertiary - 덜 중요한 내용" />
          </Frame.Stack>
        </Section>
      </Frame.Stack>

      {/* Depth 4 */}
      <Frame.Stack>
        <Text role="Title">Depth 4 (Elevated)</Text>
        <Section role="Container" prominence="Hero">
          <Frame.Stack>
            <Text role="Body" prominence="Standard" content="Primary - 가장 중요한 내용" />
            <Text role="Body" prominence="Standard" content="Secondary - 보조 내용" />
            <Text role="Body" prominence="Subtle" content="Tertiary - 덜 중요한 내용" />
          </Frame.Stack>
        </Section>
      </Frame.Stack>

      {/* 실제 사용 예시 */}
      <Frame.Stack>
        <Text role="Title">실제 사용 예시 - 파일 목록</Text>
        <Section role="Container" prominence="Standard">
          <Frame.Stack>
            {/* 파일 1 */}
            <Frame.Stack>
              <Text role="Body" prominence="Standard" content="App.tsx" />
              <Text role="Caption" prominence="Standard" content="메인 애플리케이션 컴포넌트" />
              <Text role="Caption" prominence="Subtle" content="마지막 수정: 2025-01-08" />
            </Frame.Stack>

            {/* 파일 2 */}
            <Frame.Stack>
              <Text role="Body" prominence="Standard" content="Layout.tsx" />
              <Text role="Caption" prominence="Standard" content="레이아웃 시스템 컴포넌트" />
              <Text role="Caption" prominence="Subtle" content="마지막 수정: 2025-01-07" />
            </Frame.Stack>

            {/* 파일 3 */}
            <Frame.Stack>
              <Text role="Body" prominence="Standard" content="Block.tsx" />
              <Text role="Caption" prominence="Standard" content="IDDL 블록 시스템 컴포넌트" />
              <Text role="Caption" prominence="Subtle" content="마지막 수정: 2025-01-08" />
            </Frame.Stack>
          </Frame.Stack>
        </Section>
      </Frame.Stack>

      {/* 중첩 예시 */}
      <Frame.Stack>
        <Text role="Title">중첩 예시 - 카드 안의 카드</Text>
        <Section role="Container" prominence="Standard">
          <Frame.Stack>
            <Text role="Title" content="외부 카드 제목" />
            <Text role="Body" content="외부 카드 설명" />
          </Frame.Stack>

          <Section role="Container" prominence="Standard">
            <Frame.Stack>
              <Text role="Title" content="내부 카드 제목" />
              <Text role="Body" content="내부 카드 설명 (depth가 증가하여 배경이 더 진함)" />
              <Text role="Caption" prominence="Subtle" content="내부 카드 메타 정보" />
            </Frame.Stack>
          </Section>
        </Section>
      </Frame.Stack>

      <Frame.Stack>
        <Text role="Title" content="Horizontal Layout - Button Group" />
        <Section role="Container" prominence="Standard">
          <Block role="Toolbar">
            <Action role="Button" prominence="Standard" label="Primary Action" intent="Brand" />
            <Action role="Button" prominence="Subtle" label="Secondary Action" />
            <Action role="Button" prominence="Subtle" label="Cancel" />
          </Block>
        </Section>
      </Frame.Stack>
    </div>
  );
};

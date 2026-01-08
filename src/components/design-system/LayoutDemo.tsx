/**
 * LayoutDemo - 인터랙티브 Layout 시스템 데모
 */

import { useState } from 'react';
import { Layout, LayoutIsland } from '@/components/ui/Layout';
import { ResizeHandle } from '@/components/ui/ResizeHandle';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import {
  FileText,
  Code,
  Terminal,
  MessageSquare,
  LayoutGrid,
  Columns2,
  Layers,
  BarChart3,
} from 'lucide-react';

export const LayoutDemo = () => {
  const [activeDemo, setActiveDemo] = useState<'grid' | 'flex' | 'stack' | 'scroll' | 'bento'>('bento');

  return (
    <div className="space-y-8">
      {/* Demo Selector */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={activeDemo === 'bento' ? 'accent' : 'ghost'}
          onClick={() => setActiveDemo('bento')}
        >
          <LayoutGrid size={16} />
          Bento Grid
        </Button>
        <Button
          variant={activeDemo === 'grid' ? 'accent' : 'ghost'}
          onClick={() => setActiveDemo('grid')}
        >
          <Columns2 size={16} />
          Grid Layout
        </Button>
        <Button
          variant={activeDemo === 'flex' ? 'accent' : 'ghost'}
          onClick={() => setActiveDemo('flex')}
        >
          <Layers size={16} />
          Flex Layout
        </Button>
        <Button
          variant={activeDemo === 'stack' ? 'accent' : 'ghost'}
          onClick={() => setActiveDemo('stack')}
        >
          <FileText size={16} />
          Stack (Scroll)
        </Button>
        <Button
          variant={activeDemo === 'scroll' ? 'accent' : 'ghost'}
          onClick={() => setActiveDemo('scroll')}
        >
          <BarChart3 size={16} />
          Pure Scroll
        </Button>
      </div>

      {/* Demo Content */}
      <Layout depth={2} rounded="lg" className="p-4 min-h-[500px]">
        {activeDemo === 'bento' && <BentoGridDemo />}
        {activeDemo === 'grid' && <GridLayoutDemo />}
        {activeDemo === 'flex' && <FlexLayoutDemo />}
        {activeDemo === 'stack' && <StackLayoutDemo />}
        {activeDemo === 'scroll' && <ScrollLayoutDemo />}
      </Layout>

      {/* Code Example */}
      <Layout depth={1} rounded="lg" className="p-4">
        <h3 className="text-sm font-semibold mb-2 text-text-secondary">Code Example</h3>
        <pre className="text-xs text-text-tertiary overflow-x-auto">
          {getCodeExample(activeDemo)}
        </pre>
      </Layout>
    </div>
  );
};

/**
 * Bento Grid Demo
 */
const BentoGridDemo = () => {
  return (
    <Layout
      variant="grid"
      template="dashboard"
      gap={3}
      className="h-full"
    >
      {/* Large card - 2x2 */}
      <LayoutIsland
        depth={3}
        rounded="lg"
        className="col-span-2 row-span-2 p-4 flex flex-col"
      >
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 size={20} className="text-accent" />
          <h3 className="font-semibold">Analytics</h3>
        </div>
        <div className="flex-1 flex items-center justify-center text-text-tertiary">
          Chart Area (2x2)
        </div>
      </LayoutIsland>

      {/* Small cards */}
      <LayoutIsland depth={3} rounded="lg" className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <FileText size={16} className="text-accent" />
          <h4 className="text-sm font-medium">Files</h4>
        </div>
        <div className="text-2xl font-bold">1,234</div>
      </LayoutIsland>

      <LayoutIsland depth={3} rounded="lg" className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <Code size={16} className="text-accent" />
          <h4 className="text-sm font-medium">Lines</h4>
        </div>
        <div className="text-2xl font-bold">45.6K</div>
      </LayoutIsland>

      {/* Wide card */}
      <LayoutIsland depth={3} rounded="lg" className="col-span-2 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Terminal size={18} className="text-accent" />
          <h4 className="font-medium">Recent Activity</h4>
        </div>
        <div className="space-y-1 text-sm text-text-secondary">
          <div>• Updated layout system</div>
          <div>• Added Bento Grid support</div>
          <div>• Improved documentation</div>
        </div>
      </LayoutIsland>
    </Layout>
  );
};

/**
 * Grid Layout Demo (Sidebar-Content)
 */
const GridLayoutDemo = () => {
  return (
    <Layout variant="grid" template="sidebar-content" gap={3} className="h-full">
      {/* Sidebar */}
      <LayoutIsland area="sidebar" variant="scroll" depth={2} rounded="lg" className="p-3">
        <h3 className="text-sm font-semibold mb-3">Navigation</h3>
        <div className="space-y-1">
          {['Home', 'Projects', 'Team', 'Settings'].map((item) => (
            <div
              key={item}
              className="px-3 py-2 rounded-md text-sm text-text-secondary hover:bg-layer-3 cursor-pointer"
            >
              {item}
            </div>
          ))}
        </div>
      </LayoutIsland>

      {/* Content */}
      <LayoutIsland area="content" variant="flex" direction="vertical" depth={3} rounded="lg" className="p-4">
        <h2 className="text-lg font-bold mb-2">Main Content</h2>
        <p className="text-text-secondary">
          Grid 레이아웃은 명확한 영역 구분이 필요한 경우에 사용합니다.
          Sidebar-Content 패턴은 가장 일반적인 앱 레이아웃입니다.
        </p>
      </LayoutIsland>
    </Layout>
  );
};

/**
 * Flex Layout Demo
 */
const FlexLayoutDemo = () => {
  return (
    <Layout variant="flex" direction="vertical" gap={3} className="h-full">
      {/* Header */}
      <Layout variant="flex" depth={3} rounded="lg" className="px-4 py-3 items-center justify-between">
        <h2 className="font-semibold">Flex Header</h2>
        <div className="flex gap-2">
          <Button variant="ghost">Cancel</Button>
          <Button variant="accent">Save</Button>
        </div>
      </Layout>

      {/* Content */}
      <Layout variant="flex" depth={2} rounded="lg" className="flex-1 p-4 items-center justify-center">
        <div className="text-center text-text-secondary">
          <p>Flexbox는 동적 배치와 정렬이 필요한 경우에 사용합니다.</p>
          <p className="text-sm mt-2">Header와 Footer가 있는 레이아웃에 적합합니다.</p>
        </div>
      </Layout>

      {/* Footer */}
      <Layout variant="flex" depth={3} rounded="lg" className="px-4 py-2 items-center justify-between text-sm text-text-tertiary">
        <span>© 2026 Layout System</span>
        <span>v1.0.0</span>
      </Layout>
    </Layout>
  );
};

/**
 * Stack Layout Demo (Scrollable)
 */
const StackLayoutDemo = () => {
  const items = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: `Item ${i + 1}`,
    desc: `Description for item ${i + 1}`,
  }));

  return (
    <Layout variant="stack" direction="vertical" depth={1} rounded="lg" className="h-[500px] p-2 gap-1">
      {items.map((item) => (
        <Layout
          key={item.id}
          depth={2}
          rounded="md"
          clickable
          className="px-3 py-2 flex-shrink-0"
        >
          <div className="font-medium text-sm">{item.title}</div>
          <div className="text-xs text-text-tertiary">{item.desc}</div>
        </Layout>
      ))}
    </Layout>
  );
};

/**
 * Scroll Layout Demo
 */
const ScrollLayoutDemo = () => {
  return (
    <Layout variant="scroll" depth={1} rounded="lg" className="h-[500px] p-4">
      <div className="space-y-4">
        <h2 className="text-lg font-bold">Scroll Container</h2>

        {Array.from({ length: 10 }, (_, i) => (
          <Layout key={i} depth={3} rounded="lg" className="p-4">
            <h3 className="font-semibold mb-2">Section {i + 1}</h3>
            <p className="text-text-secondary text-sm">
              순수 스크롤 컨테이너는 긴 컨텐츠를 담을 때 사용합니다.
              별도의 레이아웃 구조 없이 오직 스크롤만 지원합니다.
            </p>
          </Layout>
        ))}
      </div>
    </Layout>
  );
};

/**
 * Get code example for each demo
 */
function getCodeExample(demo: string): string {
  switch (demo) {
    case 'bento':
      return `<Layout variant="grid" template="dashboard" gap={3}>
  <Layout.Island className="col-span-2 row-span-2">
    <Analytics />
  </Layout.Island>
  <Layout.Island>
    <StatsCard />
  </Layout.Island>
</Layout>`;

    case 'grid':
      return `<Layout variant="grid" template="sidebar-content">
  <Layout.Island area="sidebar" variant="scroll">
    <Navigation />
  </Layout.Island>
  <Layout.Island area="content">
    <MainContent />
  </Layout.Island>
</Layout>`;

    case 'flex':
      return `<Layout variant="flex" direction="vertical">
  <Layout depth={3}>
    <Header />
  </Layout>
  <Layout className="flex-1">
    <Content />
  </Layout>
  <Layout depth={3}>
    <Footer />
  </Layout>
</Layout>`;

    case 'stack':
      return `<Layout variant="stack" direction="vertical" className="h-96">
  {items.map(item => (
    <Layout key={item.id} clickable>
      {item.title}
    </Layout>
  ))}
</Layout>`;

    case 'scroll':
      return `<Layout variant="scroll" className="h-96">
  <LongContent />
</Layout>`;

    default:
      return '';
  }
}

/**
 * ShadowVsBorderGuide - Shadow와 Border를 언제 사용해야 하는지 보여주는 가이드
 */

import { Layer } from '@/components/ui/Layer';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

interface ComparisonCardProps {
  title: string;
  good: {
    label: string;
    description: string;
    example: React.ReactNode;
  };
  bad: {
    label: string;
    description: string;
    example: React.ReactNode;
  };
}

const ComparisonCard = ({ title, good, bad }: ComparisonCardProps) => {
  return (
    <Layer level={2} rounded="lg" className="p-6">
      <h3 className="text-lg font-semibold text-text mb-4">{title}</h3>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Good Example */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center w-6 h-6 bg-success/10 rounded-full">
              <Check size={16} className="text-success" />
            </div>
            <span className="font-semibold text-success">{good.label}</span>
          </div>
          <p className="text-sm text-text-secondary mb-4">{good.description}</p>
          <div className="bg-layer-0 p-4 rounded-lg">
            {good.example}
          </div>
        </div>

        {/* Bad Example */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center w-6 h-6 bg-error/10 rounded-full">
              <X size={16} className="text-error" />
            </div>
            <span className="font-semibold text-error">{bad.label}</span>
          </div>
          <p className="text-sm text-text-secondary mb-4">{bad.description}</p>
          <div className="bg-layer-0 p-4 rounded-lg">
            {bad.example}
          </div>
        </div>
      </div>
    </Layer>
  );
};

export const ShadowVsBorderGuide = () => {
  return (
    <div className="space-y-8">
      {/* 1. Elevation (떠있는 요소) */}
      <ComparisonCard
        title="1. Elevation - 떠있는 요소"
        good={{
          label: "Use Shadow",
          description: "Dropdown, Modal, Popover는 shadow로 깊이를 표현합니다.",
          example: (
            <Layer level={5} rounded="md" className="p-4">
              <div className="text-sm text-text font-medium mb-2">Dropdown Menu</div>
              <div className="space-y-1">
                <div className="text-sm text-text-secondary hover:bg-layer-4 px-2 py-1 rounded cursor-pointer">
                  Option 1
                </div>
                <div className="text-sm text-text-secondary hover:bg-layer-4 px-2 py-1 rounded cursor-pointer">
                  Option 2
                </div>
              </div>
            </Layer>
          )
        }}
        bad={{
          label: "Don't Use Border",
          description: "Border를 사용하면 평면적으로 보이고 깊이감이 없습니다.",
          example: (
            <div className="bg-layer-2 border border-border rounded-md p-4">
              <div className="text-sm text-text font-medium mb-2">Dropdown Menu</div>
              <div className="space-y-1">
                <div className="text-sm text-text-secondary hover:bg-layer-3 px-2 py-1 rounded cursor-pointer">
                  Option 1
                </div>
                <div className="text-sm text-text-secondary hover:bg-layer-3 px-2 py-1 rounded cursor-pointer">
                  Option 2
                </div>
              </div>
            </div>
          )
        }}
      />

      {/* 2. Panel Separation (패널 구분) */}
      <ComparisonCard
        title="2. Panel Separation - 같은 레벨의 인접한 패널"
        good={{
          label: "Use Layer Colors",
          description: "같은 레벨에서는 tone variation으로 구분합니다.",
          example: (
            <div className="flex gap-0.5">
              <Layer level={2} rounded="md" className="bg-layer-2-warm flex-1 p-3">
                <div className="text-xs text-text-secondary">Workspace Nav</div>
                <div className="text-xs text-text-tertiary mt-1">Layer 2 Warm</div>
              </Layer>
              <Layer level={2} rounded="md" className="bg-layer-2-cool flex-1 p-3">
                <div className="text-xs text-text-secondary">File Tree</div>
                <div className="text-xs text-text-tertiary mt-1">Layer 2 Cool</div>
              </Layer>
            </div>
          )
        }}
        bad={{
          label: "Don't Use Border",
          description: "Border는 면의 흐름을 끊어버립니다.",
          example: (
            <div className="flex gap-0.5">
              <div className="bg-layer-2 border border-border rounded-md flex-1 p-3">
                <div className="text-xs text-text-secondary">Workspace Nav</div>
                <div className="text-xs text-text-tertiary mt-1">With Border</div>
              </div>
              <div className="bg-layer-2 border border-border rounded-md flex-1 p-3">
                <div className="text-xs text-text-secondary">File Tree</div>
                <div className="text-xs text-text-tertiary mt-1">With Border</div>
              </div>
            </div>
          )
        }}
      />

      {/* 3. Input Fields (인풋 필드) */}
      <ComparisonCard
        title="3. Input Fields - 함몰된 영역"
        good={{
          label: "Use Inset Shadow",
          description: "Layer 1 + inset shadow로 눌린 느낌을 표현합니다.",
          example: (
            <Layer level={1} rounded="md" className="px-3 py-2">
              <input
                type="text"
                placeholder="Enter text..."
                className="w-full bg-transparent border-none outline-none text-text"
                style={{ boxShadow: 'none' }}
              />
            </Layer>
          )
        }}
        bad={{
          label: "Don't Use Border",
          description: "Border는 input이 튀어나온 것처럼 보입니다.",
          example: (
            <div className="bg-layer-2 border border-border rounded-md px-3 py-2">
              <input
                type="text"
                placeholder="Enter text..."
                className="w-full bg-transparent border-none outline-none text-text"
                style={{ boxShadow: 'none' }}
              />
            </div>
          )
        }}
      />

      {/* 4. Cards & Containers */}
      <ComparisonCard
        title="4. Cards & Containers - 콘텐츠 영역"
        good={{
          label: "Use Layer System",
          description: "Layer 레벨로만 깊이를 표현합니다.",
          example: (
            <Layer level={3} rounded="lg" className="p-4">
              <div className="text-sm font-semibold text-text mb-2">Card Title</div>
              <div className="text-xs text-text-secondary">
                Clean and minimal design with layer-based depth.
              </div>
            </Layer>
          )
        }}
        bad={{
          label: "Don't Use Border",
          description: "Border는 디자인을 복잡하게 만들고 시각적 노이즈를 추가합니다.",
          example: (
            <div className="bg-layer-3 border border-border rounded-lg p-4">
              <div className="text-sm font-semibold text-text mb-2">Card Title</div>
              <div className="text-xs text-text-secondary">
                Border adds visual noise and complexity.
              </div>
            </div>
          )
        }}
      />

      {/* 5. When to Use Border */}
      <Layer level={2} rounded="lg" className="p-6">
        <h3 className="text-lg font-semibold text-text mb-4">
          ✅ When to Use Border (예외적인 경우)
        </h3>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Check size={20} className="text-accent flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-text mb-1">Focus State (포커스 상태)</div>
              <div className="text-sm text-text-secondary mb-3">
                Input field가 활성화되었을 때 accent border로 표시
              </div>
              <Layer level={1} rounded="md" className="px-3 py-2 border-2 border-accent">
                <input
                  type="text"
                  placeholder="Focused input..."
                  className="w-full bg-transparent border-none outline-none text-text"
                  style={{ boxShadow: 'none' }}
                />
              </Layer>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Check size={20} className="text-accent flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-text mb-1">State Indication (상태 표시)</div>
              <div className="text-sm text-text-secondary mb-3">
                Success, Error, Warning 상태를 명확히 표시할 때
              </div>
              <div className="flex gap-2">
                <Layer level={2} rounded="md" className="px-3 py-2 border border-success flex-1">
                  <div className="text-xs text-success">Success</div>
                </Layer>
                <Layer level={2} rounded="md" className="px-3 py-2 border border-error flex-1">
                  <div className="text-xs text-error">Error</div>
                </Layer>
                <Layer level={2} rounded="md" className="px-3 py-2 border border-warning flex-1">
                  <div className="text-xs text-warning">Warning</div>
                </Layer>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Check size={20} className="text-accent flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-text mb-1">Dividers (구분선)</div>
              <div className="text-sm text-text-secondary mb-3">
                같은 레벨 내에서 콘텐츠를 구분할 때
              </div>
              <Layer level={2} rounded="md" className="p-4">
                <div className="text-sm text-text mb-2">Section 1</div>
                <hr className="border-border my-3" />
                <div className="text-sm text-text mt-2">Section 2</div>
              </Layer>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Check size={20} className="text-accent flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-text mb-1">Data Visualization (데이터 시각화)</div>
              <div className="text-sm text-text-secondary mb-3">
                차트, 그래프 등에서 경계를 명확히 해야 할 때
              </div>
              <div className="flex gap-2">
                <div className="w-16 h-16 border-2 border-accent rounded-md flex items-center justify-center text-xs text-accent">
                  Chart
                </div>
                <div className="w-16 h-16 border-2 border-info rounded-md flex items-center justify-center text-xs text-info">
                  Graph
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layer>

      {/* Design Principles Summary */}
      <Layer level={2} rounded="lg" className="p-6 bg-accent/5">
        <h3 className="text-lg font-semibold text-text mb-4">
          📐 Design Principles Summary
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-text mb-3">Use Shadow For:</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>• Floating elements (Dropdown, Modal, Tooltip)</li>
              <li>• Elevated surfaces (Toolbar, Active Tab)</li>
              <li>• Inset areas (Input fields, Terminal)</li>
              <li>• Creating depth without lines</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-text mb-3">Use Border For:</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>• Focus states (Interactive elements)</li>
              <li>• State indication (Success, Error, Warning)</li>
              <li>• Content dividers (hr, separators)</li>
              <li>• Data visualization (Charts, graphs)</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 p-4 bg-layer-3 rounded-lg">
          <p className="text-sm text-text font-semibold mb-2">
            Golden Rule:
          </p>
          <p className="text-sm text-text-secondary">
            기본적으로 <span className="text-accent font-semibold">Layer + Shadow</span>를 사용하고,
            명확한 이유가 있을 때만 <span className="text-accent-secondary font-semibold">Border</span>를 추가합니다.
          </p>
        </div>
      </Layer>
    </div>
  );
};

import { Layer } from '@/components/ui/Layer';

interface FormatSidebarProps {
  isOpen: boolean;
}

export const FormatSidebar = ({ isOpen }: FormatSidebarProps) => {
  if (!isOpen) return null;

  return (
    <Layer
      level={2}
      rounded="md"
      className="flex w-56 flex-col overflow-hidden"
    >
      {/* Format Options */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-3">
          {/* Text Section */}
          <div>
            <h3 className="mb-1.5 text-xs font-medium text-text-secondary">텍스트</h3>
            <div className="space-y-1.5">
              {/* Font Family */}
              <div>
                <label className="mb-0.5 block text-[10px] text-text-tertiary">
                  글꼴
                </label>
                <select className="w-full rounded bg-layer-1 px-2 py-1 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-accent">
                  <option>San Francisco</option>
                  <option>Helvetica</option>
                  <option>Arial</option>
                  <option>Times New Roman</option>
                </select>
              </div>

              {/* Font Size */}
              <div>
                <label className="mb-0.5 block text-[10px] text-text-tertiary">
                  크기
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="number"
                    defaultValue={16}
                    className="w-full rounded bg-layer-1 px-2 py-1 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                  <span className="flex items-center text-[10px] text-text-tertiary">
                    pt
                  </span>
                </div>
              </div>

              {/* Text Color */}
              <div>
                <label className="mb-0.5 block text-[10px] text-text-tertiary">
                  색상
                </label>
                <input
                  type="color"
                  defaultValue="#000000"
                  className="h-7 w-full cursor-pointer rounded bg-layer-1"
                />
              </div>
            </div>
          </div>

          {/* Background Section */}
          <div>
            <h3 className="mb-1.5 text-xs font-medium text-text-secondary">배경</h3>
            <div className="space-y-1.5">
              {/* Background Color */}
              <div>
                <label className="mb-0.5 block text-[10px] text-text-tertiary">
                  배경색
                </label>
                <input
                  type="color"
                  defaultValue="#ffffff"
                  className="h-7 w-full cursor-pointer rounded bg-layer-1"
                />
              </div>

              {/* Preset Colors */}
              <div>
                <label className="mb-0.5 block text-[10px] text-text-tertiary">
                  프리셋
                </label>
                <div className="grid grid-cols-5 gap-1">
                  {[
                    '#ffffff',
                    '#f0f0f0',
                    '#e3f2fd',
                    '#fff3e0',
                    '#f3e5f5',
                    '#e8f5e9',
                    '#fce4ec',
                    '#fff9c4',
                    '#cfd8dc',
                    '#000000',
                  ].map((color) => (
                    <button
                      key={color}
                      className="h-6 rounded border border-border transition-transform hover:scale-110 focus:outline-none focus:ring-1 focus:ring-accent"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layer>
  );
};

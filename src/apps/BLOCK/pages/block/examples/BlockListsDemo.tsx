import { Block } from '@/components/dsl/Block/Block';
import { Text } from '@/components/dsl/Element/Text/Text';

export function BlockListsDemo() {
  return (
    <Block role="Container" density="Comfortable">
      <div className="flex flex-col gap-1">
        <Text role="Title" prominence="Strong" content="2. Lists & Grids" />
        <Text role="Body" prominence="Subtle" content="Layouts for collections of items." />
      </div>

      {/* Grid */}
      <Block role="Card">
        <Text role="Label" content="Grid Layout (role='Grid')" />
        <Block role="Grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-surface-sunken p-4 rounded text-center">
              Item {i}
            </div>
          ))}
        </Block>
      </Block>

      {/* List */}
      <Block role="Card">
        <Text role="Label" content="List Layout (role='List')" />
        <Block role="List">
          {['First Item', 'Second Item', 'Third Item'].map((item) => (
            <Block
              key={item}
              role="Inline"
              clickable
            >
              <Text role="Body" content={item} />
            </Block>
          ))}
        </Block>
      </Block>
    </Block>
  );
}

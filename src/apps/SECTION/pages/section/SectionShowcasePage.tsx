import { Block } from '@/components/types/Block/Block';
import { Text } from '@/components/types/Element/Text/Text';
import { ShowcasePage } from '@/components/showcase/ShowcasePage';

export function SectionShowcasePage() {
  const categories = [
    { id: 'universal', label: '1. Universal Sections' },
    { id: 'ide', label: '2. IDE Context (Studio)' },
    { id: 'web', label: '3. Web Context' },
    { id: 'dialog', label: '4. Dialog Context' },
  ];

  const handleCategoryChange = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <ShowcasePage
      title="Sections"
      subtitle="Semantic Layout Regions v2.1"
      description="Semantic areas that define the page structure."
      categories={categories}
      activeCategoryId="universal"
      onCategoryChange={handleCategoryChange}
    >
      {/* 1. Universal */}
      <Block role="Container" layout="stack" density="Comfortable" className="gap-6" id="universal">
        <div className="flex flex-col gap-1">
          <Text role="Title" prominence="Strong" content="1. Universal Sections" />
          <Text role="Body" prominence="Subtle" content="Available in almost all layouts." />
        </div>

        <Block role="Grid" layout="grid" density="Comfortable" className="grid-cols-2 gap-8">
          <Block role="Card" className="p-4 gap-2 border-b-4 border-b-brand-primary">
            <Text role="Title" content="Header" />
            <Text role="Caption" content="<header> tag. Typically fixed height." />
          </Block>
          <Block role="Card" className="p-4 gap-2 border-t-4 border-t-brand-primary">
            <Text role="Title" content="Footer" />
            <Text role="Caption" content="<footer> tag. Bottom region." />
          </Block>
          <Block role="Card" className="p-4 gap-2 border-4 border-brand-primary">
            <Text role="Title" content="Container" />
            <Text role="Caption" content="<section> tag. Generic container." />
          </Block>
          <Block role="Card" className="p-4 gap-2 bg-surface-sunken">
            <Text role="Title" content="Main" />
            <Text role="Caption" content="<main> tag. Primary content area." />
          </Block>
        </Block>
      </Block>

      <Block role="Divider" layout="stack">
        <></>
      </Block>

      {/* 2. IDE Context */}
      <Block role="Container" layout="stack" density="Comfortable" className="gap-6" id="ide">
        <div className="flex flex-col gap-1">
          <Text role="Title" prominence="Strong" content="2. IDE Context (Studio)" />
          <Text
            role="Body"
            prominence="Subtle"
            content="Specialized sections for development environments."
          />
        </div>

        <Block role="Grid" layout="grid" density="Comfortable" className="grid-cols-3 gap-6">
          <Block role="Card" className="p-4 border border-l-4 border-l-accent">
            <Text role="Label" content="ActivityBar" />
            <Text role="Caption" content="Narrow icon sidebar." />
          </Block>
          <Block role="Card" className="p-4 border border-l-4 border-l-accent">
            <Text role="Label" content="PrimarySidebar" />
            <Text role="Caption" content="File explorer tree." />
          </Block>
          <Block role="Card" className="p-4 border border-t-4 border-t-accent">
            <Text role="Label" content="Panel" />
            <Text role="Caption" content="Terminal/Output area." />
          </Block>
          <Block role="Card" className="p-4 bg-surface-sunken col-span-2">
            <Text role="Label" content="Editor" />
            <Text role="Caption" content="Code editing area. Often has tabs." />
          </Block>
          <Block role="Card" className="p-4 border border-r-4 border-r-accent">
            <Text role="Label" content="SecondarySidebar" />
            <Text role="Caption" content="Outline or Properties." />
          </Block>
        </Block>
      </Block>

      <Block role="Divider" layout="stack">
        <></>
      </Block>

      {/* 3. Web Context */}
      <Block role="Container" layout="stack" density="Comfortable" className="gap-6" id="web">
        <div className="flex flex-col gap-1">
          <Text role="Title" prominence="Strong" content="3. Web Context" />
          <Text role="Body" prominence="Subtle" content="Standard web page regions." />
        </div>

        <Block role="Grid" layout="grid" density="Comfortable" className="grid-cols-3 gap-6">
          <Block role="Card" className="p-4 border border-l-4 border-l-brand-primary">
            <Text role="Label" content="Navigator" />
            <Text role="Caption" content="Table of Contents / Menu." />
          </Block>
          <Block role="Card" className="p-4 bg-surface-sunken">
            <Text role="Label" content="Main" />
            <Text role="Caption" content="Article content." />
          </Block>
          <Block role="Card" className="p-4 border border-r-4 border-r-brand-primary">
            <Text role="Label" content="Aside" />
            <Text role="Caption" content="Related info / Ad." />
          </Block>
        </Block>
      </Block>

      <Block role="Divider" layout="stack">
        <></>
      </Block>

      {/* 4. Dialog Context */}
      <Block role="Container" layout="stack" density="Comfortable" className="gap-6" id="dialog">
        <div className="flex flex-col gap-1">
          <Text role="Title" prominence="Strong" content="4. Dialog Context" />
          <Text role="Body" prominence="Subtle" content="Regions within a modal dialog." />
        </div>

        <Block role="Card" className="p-0 border border-border-default max-w-md">
          <Block
            role="Container"
            className="p-4 border-b border-border-default bg-surface-raised"
          >
            <Text role="Label" content="DialogHeader" />
          </Block>
          <Block role="Container" className="p-8 bg-surface">
            <Text role="Label" content="DialogContent" />
          </Block>
          <Block
            role="Container"
            className="p-4 border-t border-border-default bg-surface-raised"
          >
            <Text role="Label" content="DialogFooter" />
          </Block>
        </Block>
      </Block>
    </ShowcasePage>
  );
}

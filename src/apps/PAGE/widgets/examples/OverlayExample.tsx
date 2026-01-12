/**
 * OverlayExample - Modal-style overlay layout
 *
 * Use cases: Dialogs, Modals, Lightboxes, Confirmation screens
 */

import { Section } from '@/components/dsl/Section/Section';
import { Block } from '@/components/dsl/Block/Block';
import { Text } from '@/components/dsl/Element/Text/Text';
import { Action } from '@/components/dsl/Element/Action/Action';
import { Field } from '@/components/dsl/Element/Field/Field';
import { AlertTriangle, X, Plus } from 'lucide-react';

export function OverlayExample() {
  return (
    <Section role="Main" className="flex items-center justify-center p-6 min-h-screen">
      <Block role="Card" prominence="Strong" className="w-full max-w-xl overflow-hidden shadow-soft-xl rounded-[2.5rem]">
        {/* Dialog Header */}
        <Section role="DialogHeader" variant="Plain" className="border-b border-border/50">
          <Block role="Toolbar" className="px-10 py-8 bg-transparent">
            <Block role="Stack" className="flex-row items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-primary shadow-soft-lg flex items-center justify-center">
                <Plus size={32} className="text-white" />
              </div>
              <Block role="Stack" density="Compact">
                <Text role="Heading" content="Create Workspace" prominence="Strong" className="text-2xl font-black tracking-tight" />
                <Text role="Caption" content="V6.5 INTENT ENGINE • PROJECT SETUP" prominence="Subtle" className="text-[10px] tracking-[0.2em] font-black text-primary" />
              </Block>
            </Block>
            <Action role="IconButton" prominence="Subtle" className="h-10 w-10">
              <X size={20} />
            </Action>
          </Block>
        </Section>

        {/* Dialog Content */}
        <Section role="DialogContent" variant="Plain" scrollable className="bg-transparent">
          <Block role="Stack" density="Comfortable" className="px-10 py-10">
            <Block role="Grid" className="grid-cols-2 gap-8">
              <Field
                role="Textbox"
                label="PROJECT NAME"
                placeholder="e.g. stratus-core"
                prominence="Standard"
                className="col-span-1"
              />
              <Field
                role="Combobox"
                label=" ENGINE TEMPLATE"
                placeholder="Select base..."
                prominence="Standard"
                className="col-span-1"
                spec={{ options: ['React + IDDL', 'Next.js Studio', 'Vite Workbench'] }}
              />
            </Block>

            <Field
              role="Textarea"
              label="DESCRIPTION"
              placeholder="Describe the intent of this workspace..."
              prominence="Standard"
            />

            <Block role="Stack" density="Standard">
              <Text role="Label" content="AVAILABILITY MODALITY" prominence="Strong" className="text-[10px] tracking-widest font-black opacity-30" />
              <Block role="Grid" className="grid-cols-2 gap-4">
                <Block role="Card" prominence="Strong" intent="Brand" className="p-5 rounded-2xl cursor-pointer relative overflow-hidden">
                  <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-white animate-pulse" />
                  <Text role="Label" content="Open Source" prominence="Strong" className="text-sm text-white" />
                  <Text role="Caption" content="Publicly accessible via IDDL Registry" prominence="Subtle" className="text-[11px] text-white/60 leading-tight mt-1" />
                </Block>
                <Block role="Card" prominence="Subtle" className="p-5 border border-border/50 rounded-2xl cursor-pointer hover:bg-slate-50">
                  <Text role="Label" content="Encapsulated" prominence="Strong" className="text-sm" />
                  <Text role="Caption" content="Restricted to authorized designers" prominence="Subtle" className="text-[11px] opacity-60 leading-tight mt-1" />
                </Block>
              </Block>
            </Block>

            <Block role="Alert" prominence="Subtle" intent="Caution" className="p-5 rounded-2xl flex gap-4 items-center">
              <AlertTriangle size={24} className="shrink-0" />
              <Block role="Stack" density="Compact">
                <Text role="Label" content="Storage Capacity Warning" prominence="Strong" className="text-xs" />
                <Text role="Caption" content="Current workspace utilization is at 94%. Performance may be throttled." prominence="Standard" className="text-[11px] opacity-70" />
              </Block>
            </Block>
          </Block>
        </Section>

        {/* Dialog Footer */}
        <Section role="DialogFooter" variant="Plain">
          <Block role="Toolbar" className="px-10 py-8 border-t border-border/50 justify-end gap-4 bg-surface-sunken/30">
            <Action role="Button" label="Cancel" prominence="Standard" className="px-6 h-12" />
            <Action role="Button" label="Initialize Engine" prominence="Strong" intent="Brand" className="px-8 h-12 rounded-xl font-black uppercase tracking-wider shadow-soft-lg" />
          </Block>
        </Section>
      </Block>
    </Section>
  );
}

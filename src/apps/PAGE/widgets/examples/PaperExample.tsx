/**
 * PaperExample - Fixed-dimension printable layout
 *
 * Use cases: Invoices, Receipts, Resumes, Certificates, Reports
 */

import { Section } from '@/components/dsl/Section/Section';
import { Block } from '@/components/dsl/Block/Block';
import { Text } from '@/components/dsl/Element/Text/Text';
import { FileText, Mail, Phone, MapPin, Printer, Download } from 'lucide-react';
import { Action } from '@/components/dsl/Element/Action/Action';

export function PaperExample() {
  return (
    <>
      {/* Header - Print Actions */}
      <Section role="Header" variant="Plain" className="print:hidden">
        <Block role="Toolbar" className="px-6 py-3">
          <Text role="Label" content="Invoice Preview" prominence="Strong" />
          <Block role="Stack" className="flex-row gap-2">
            <Action role="Button" prominence="Standard" className="gap-2">
              <Download size={16} />
              Download PDF
            </Action>
            <Action role="Button" prominence="Strong" intent="Brand" className="gap-2">
              <Printer size={16} />
              Print
            </Action>
          </Block>
        </Block>
      </Section>

      {/* Main - Paper Content */}
      <Section role="Main" className="flex items-center justify-center py-24 bg-[#f8fafc] min-h-screen relative overflow-hidden">
        {/* Decorative Watermark */}
        <div className="absolute top-[20%] left-[-5%] rotate-[-15deg] select-none pointer-events-none opacity-[0.03] text-[20rem] font-black tracking-tighter">
          STRATA
        </div>

        <Block
          role="Card"
          prominence="Strong"
          className="w-full max-w-[850px] mx-4 p-24 bg-white border-none shadow-[0_50px_100px_-20px_rgba(0,0,0,0.05)] rounded-none relative z-10"
          style={{ aspectRatio: '1 / 1.414' }}
        >
          {/* Invoice Header */}
          <Block role="Stack" className="space-y-20">
            <Block role="Toolbar" className="items-start">
              <Block role="Stack" density="Compact">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-14 h-14 bg-primary text-white flex items-center justify-center rounded-2xl shadow-lg shadow-primary/20">
                    <FileText size={32} />
                  </div>
                  <div>
                    <Text role="Title" content="STRATA" prominence="Hero" className="text-4xl font-black tracking-[-0.05em] leading-none" />
                    <Text role="Caption" content="DESIGN SYSTEMS LAB" prominence="Strong" className="text-[10px] tracking-[0.2em] opacity-40 uppercase font-black" />
                  </div>
                </div>
              </Block>

              <Block role="Stack" density="Compact" className="text-right">
                <Text role="Heading" content="INVOICE" prominence="Strong" className="text-5xl font-black tracking-tighter opacity-[0.05] leading-none mb-1" />
                <div className="flex flex-col gap-1 items-end">
                  <Text role="Caption" content="#INV-2026-0842" prominence="Strong" className="text-xs font-black tracking-wider" />
                  <Text role="Caption" content="ISSUE DATE: JAN 12, 2026" prominence="Subtle" className="text-[9px] font-bold opacity-30" />
                </div>
              </Block>
            </Block>

            {/* Bill To / From */}
            <div className="grid grid-cols-2 gap-24">
              <Block role="Stack" density="Compact" className="space-y-6">
                <Text role="Label" content="RECIPIENT" prominence="Strong" className="text-[10px] uppercase tracking-widest font-black opacity-20" />
                <Block role="Stack" density="Compact">
                  <Text role="Body" content="Sarah Jenkins" prominence="Strong" className="text-xl font-black tracking-tight" />
                  <Text role="Body" content="Chief Design Officer" prominence="Standard" className="text-sm font-bold opacity-40 italic" />
                  <Text role="Body" content="Framer Inc." prominence="Standard" className="text-sm font-bold opacity-40" />
                  <div className="mt-4 pt-4 border-t border-slate-100 max-w-[150px]">
                    <Text role="Body" content="242 Mission St, SF, CA" prominence="Standard" className="text-[11px] font-bold opacity-30 leading-relaxed" />
                  </div>
                </Block>
              </Block>

              <Block role="Stack" density="Compact" className="space-y-6">
                <Text role="Label" content="ISSUER" prominence="Strong" className="text-[10px] uppercase tracking-widest font-black opacity-20" />
                <Block role="Stack" density="Compact">
                  <Text role="Body" content="Strata Core Team" prominence="Strong" className="text-xl font-black tracking-tight" />
                  <Text role="Body" content="billing@strata.design" prominence="Standard" className="text-sm font-bold opacity-40" />
                  <Text role="Body" content="+1 (415) 555-0192" prominence="Standard" className="text-sm font-bold opacity-40" />
                </Block>
              </Block>
            </div>

            {/* Line Items Table */}
            <div className="mt-12">
              <table className="w-full">
                <thead>
                  <tr className="border-b-4 border-slate-900/5">
                    <th className="text-left py-6 text-[11px] uppercase tracking-[0.2em] opacity-30 font-black">Description of Intent</th>
                    <th className="text-center py-6 text-[11px] uppercase tracking-[0.2em] opacity-30 font-black">Quantity</th>
                    <th className="text-right py-6 text-[11px] uppercase tracking-[0.2em] opacity-30 font-black">Unit Rate</th>
                    <th className="text-right py-6 text-[11px] uppercase tracking-[0.2em] opacity-30 font-black">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { desc: "Core Engine Orchestration & Strategy", hours: 24, rate: 180 },
                    { desc: "High-Intent Component Architecture", hours: 56, rate: 150 },
                    { desc: "Multi-Modality Documentation Layer", hours: 12, rate: 150 },
                  ].map((item, idx) => (
                    <tr key={idx} className="group">
                      <td className="py-8">
                        <Text role="Body" content={item.desc} prominence="Strong" className="text-base font-black tracking-tight" />
                        <Text role="Caption" content="Professional Services • V6.5 Core Integration" prominence="Subtle" className="text-[10px] opacity-30 font-bold uppercase tracking-wider mt-1" />
                      </td>
                      <td className="py-8 text-center">
                        <Text role="Body" content={item.hours.toString()} prominence="Standard" className="text-sm font-bold opacity-40" />
                      </td>
                      <td className="py-8 text-right font-mono text-sm opacity-30 font-bold">
                        ${item.rate.toFixed(2)}
                      </td>
                      <td className="py-8 text-right font-mono text-base font-black text-slate-800">
                        ${(item.hours * item.rate).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end pt-16 border-t-4 border-slate-900/5">
              <Block role="Stack" density="Compact" className="w-72 space-y-4">
                <div className="flex justify-between items-center opacity-40">
                  <Text role="Body" content="NET AMOUNT" prominence="Standard" className="text-[10px] font-black tracking-widest" />
                  <Text role="Body" content="$14,520.00" prominence="Standard" className="text-sm font-mono font-bold" />
                </div>
                <div className="flex justify-between items-center opacity-40">
                  <Text role="Body" content="TAXATION (12%)" prominence="Standard" className="text-[10px] font-black tracking-widest" />
                  <Text role="Body" content="$1,742.40" prominence="Standard" className="text-sm font-mono font-bold" />
                </div>
                <div className="flex justify-between items-center pt-8 border-t-2 border-slate-100">
                  <Text role="Heading" content="TOTAL PAYABLE" prominence="Strong" className="text-lg font-black tracking-tighter" />
                  <Text role="Heading" content="$16,262.40" prominence="Strong" intent="Brand" className="text-4xl font-black font-mono tracking-tighter" />
                </div>
              </Block>
            </div>

            {/* Terms Footer */}
            <div className="pt-24 opacity-30 text-[10px] leading-relaxed max-w-lg">
              <Text role="Caption" content="Please pay within 15 days of receiving this invoice. Late payments are subject to a 5% monthly interest fee. Thank you for choosing Strata for your design needs." prominence="Standard" />
            </div>
          </Block>
        </Block>
      </Section>

      {/* Footer - Company Info */}
      <Section role="Footer" variant="Plain" className="print:hidden">
        <Block role="Stack" density="Comfortable" className="px-6 py-8 bg-surface-base">
          <div className="max-w-3xl mx-auto w-full">
            <Block role="Toolbar">
              <Block role="Stack" density="Compact">
                <Text role="Label" content="ACME Corp" prominence="Strong" />
                <Text role="Caption" content="Professional Services" prominence="Subtle" />
              </Block>
              <Block role="Stack" className="flex-row gap-4">
                <Action role="Link" label="Contact" prominence="Subtle" />
                <Action role="Link" label="Privacy" prominence="Subtle" />
                <Action role="Link" label="Terms" prominence="Subtle" />
              </Block>
            </Block>

            <div className="h-px bg-border my-4" />

            <Text
              role="Caption"
              content="© 2026 ACME Corp. All rights reserved. This invoice is computer-generated and valid without signature."
              prominence="Subtle"
            />
          </div>
        </Block>
      </Section>
    </>
  );
}

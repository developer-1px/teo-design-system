import { useMemo } from 'react';
import { useBlockLayoutContext, useIDDLContext } from '@/components/context/IDDLContext';
import { TokenEngine } from '../TokenEngine';
import type { TokenInput, TokenOutput } from '../types';

/**
 * useIDDLToken
 *
 * React hook that bridges the IDDL Context (Ambient) with Component Props (Local).
 * It resolves the final Design Tokens using the TokenEngine.
 */
export function useIDDLToken(localInput: Partial<TokenInput>): TokenOutput {
  // 1. Get Ambient Context
  const context = useIDDLContext();
  const blockContext = useBlockLayoutContext();

  // 2. Merge Inputs
  // Local props override context, but Context provides defaults.
  // SectionType comes from LayoutContext (mapped to 'type' in IDDLContext)
  const mergedInput: TokenInput = useMemo(
    () => ({
      role: localInput.role || 'Box',

      // Contextual derivations
      sectionRole: localInput.sectionRole || blockContext.sectionRole,
      sectionType: localInput.sectionType || context.type,
      pageRole: localInput.pageRole || context.pageRole, // v6.3: Consume Page Context

      // Inheritable props (Local overrides Context)
      prominence: localInput.prominence ?? context.prominence ?? 'Standard',
      intent: localInput.intent ?? context.intent ?? 'Neutral',
      density: localInput.density ?? context.density ?? 'Standard',

      // Local-only state
      state: localInput.state || {},
    }),
    [localInput, context, blockContext]
  );

  // 3. Resolve Tokens (Memoized)
  return useMemo(() => TokenEngine.resolve(mergedInput), [mergedInput]);
}

// Helper to ensure strict type matching if Context types differ slightly
function densityMap(d: any): any {
  return d;
}

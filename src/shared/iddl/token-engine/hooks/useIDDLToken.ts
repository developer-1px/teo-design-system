import { useMemo } from 'react';
import { useIDDLContext, useBlockLayoutContext } from '@/components/context/IDDLContext';
import { TokenEngine } from '../TokenEngine';
import { TokenInput, TokenOutput } from '../types';

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
    const mergedInput: TokenInput = useMemo(() => ({
        role: localInput.role || 'Box', // Fallback role

        // Contextual derivations
        sectionRole: blockContext.sectionRole, // Provided by Block Context
        sectionType: context.type,             // Provided by Section (Layout) Context

        // Inheritable props
        prominence: localInput.prominence ?? context.prominence,
        intent: localInput.intent ?? context.intent,
        density: densityMap(context.density), // Ensure string match if needed

        // Local-only state
        state: localInput.state,
    }), [localInput, context, blockContext]);

    // 3. Resolve Tokens (Memoized)
    return useMemo(() => TokenEngine.resolve(mergedInput), [mergedInput]);
}

// Helper to ensure strict type matching if Context types differ slightly
function densityMap(d: any): any {
    return d;
}

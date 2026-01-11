/**
 * role-config.ts - Section Role Configuration (Modular)
 * 
 * v5.1: Refactored to a granular, directory-based structure.
 * This file acts as a stable re-export layer for the modular configuration system.
 */

export * from './configs/types';
export * from './configs/constants';
export * from './configs/registry';

// Backward compatibility for ROLE_CONFIGS if needed
import { ROLE_REGISTRY } from './configs/registry';
export const ROLE_CONFIGS = ROLE_REGISTRY;

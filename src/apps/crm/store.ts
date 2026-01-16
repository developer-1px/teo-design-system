import { atom } from "jotai";
import { getDatasetsMeta } from "./dataLoader";
import type { DataRow, DatasetMeta } from "./types";

// Dynamically get available datasets from /data/crm/*.json
const availableDatasets = getDatasetsMeta();

// Available datasets metadata (dynamically loaded from import.meta.glob)
export const datasetsAtom = atom<DatasetMeta[]>(availableDatasets);

// Selected dataset name (default to first available dataset)
export const selectedDatasetAtom = atom<string>(
  availableDatasets[0]?.name || "deals",
);

// Current data loaded from selected dataset
export const currentDataAtom = atom<DataRow[]>([]);

// Loading state
export const isLoadingAtom = atom<boolean>(false);

// Selected row ID (for drawer/detail view)
export const selectedRowIdAtom = atom<string | null>(null);

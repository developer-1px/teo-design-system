/**
 * Mail Client State Management (Jotai)
 */

import { atom } from "jotai";
import { mockThreads } from "./mockData";
import type { MailFolder, MailThread } from "./types";

// Base atoms
export const selectedFolderAtom = atom<MailFolder>("inbox");
export const selectedThreadIdAtom = atom<string | null>(null);
export const searchQueryAtom = atom<string>("");

// All threads (mock data)
const allThreadsAtom = atom<MailThread[]>(mockThreads);

// Filtered threads based on selected folder
export const filteredThreadsAtom = atom((get) => {
  const selectedFolder = get(selectedFolderAtom);
  const allThreads = get(allThreadsAtom);
  const searchQuery = get(searchQueryAtom).toLowerCase();

  let filtered = allThreads.filter((thread) => {
    // Filter by folder
    const firstMail = thread.mails[0];
    if (selectedFolder === "starred") {
      return thread.isStarred;
    }
    return firstMail.folder === selectedFolder;
  });

  // Filter by search query
  if (searchQuery) {
    filtered = filtered.filter(
      (thread) =>
        thread.subject.toLowerCase().includes(searchQuery) ||
        thread.participants.some((p) => p.toLowerCase().includes(searchQuery)) ||
        thread.mails.some((mail) => mail.snippet.toLowerCase().includes(searchQuery))
    );
  }

  return filtered;
});

// Selected thread (derived)
export const selectedThreadAtom = atom((get) => {
  const selectedId = get(selectedThreadIdAtom);
  const allThreads = get(allThreadsAtom);

  if (!selectedId) return null;
  return allThreads.find((thread) => thread.id === selectedId) || null;
});

// Folder counts
export const folderCountsAtom = atom((get) => {
  const allThreads = get(allThreadsAtom);

  return {
    inbox: allThreads.filter((t) => t.mails[0].folder === "inbox").length,
    starred: allThreads.filter((t) => t.isStarred).length,
    sent: allThreads.filter((t) => t.mails[0].folder === "sent").length,
    drafts: allThreads.filter((t) => t.mails[0].folder === "drafts").length,
    trash: allThreads.filter((t) => t.mails[0].folder === "trash").length,
    spam: allThreads.filter((t) => t.mails[0].folder === "spam").length,
    archive: allThreads.filter((t) => t.mails[0].folder === "archive").length,
  };
});

/**
 * Centralized Command Definitions
 * Using objects with 'as const' to provide type-safe command IDs
 * while maintaining string-based compatibility with the CommandManager.
 */

export const ListCommand = {
    Up: "list.up",
    Down: "list.down",
    Select: "list.select",
} as const;

export const TableCommand = {
    NavMove: "nav.move",
    ActionEdit: "action.edit",
    ActionDelete: "action.delete",
    ActionSelectAll: "action.selectAll",
    ActionSelectRow: "action.selectRow",
    ActionSelectColumn: "action.selectColumn",
    ActionUndo: "action.undo",
    ActionRedo: "action.redo",
    ActionCopy: "action.copy",
    ActionCancel: "action.cancel",
    ActionInsertRow: "action.insertRow",
    ActionDeleteRow: "action.deleteRow",
    ActionInsertColumn: "action.insertColumn",
    ActionDeleteColumn: "action.deleteColumn",
    ActionFind: "action.find",
    NavFindNext: "nav.findNext",
    NavFindPrev: "nav.findPrev",
    Type: "type", // Special fallback for character typing
} as const;

export const SystemCommand = {
    OpenPalette: "system.openPalette",
    ToggleTheme: "system.toggleTheme",
    Navigate: "system.navigate",
} as const;

export const OSCommand = {
    Copy: "os.copy",
    Paste: "os.paste",
    Cut: "os.cut",
    Undo: "os.undo",
    Redo: "os.redo",
    SelectAll: "os.selectAll",
    Delete: "os.delete",
    Escape: "os.escape",
    MoveUp: "os.moveUp",
    MoveDown: "os.moveDown",
    MoveLeft: "os.moveLeft",
    MoveRight: "os.moveRight",
} as const;

/**
 * Global Command Registry Type Helper
 */
export type AppCommand =
    | typeof ListCommand[keyof typeof ListCommand]
    | typeof TableCommand[keyof typeof TableCommand]
    | typeof SystemCommand[keyof typeof SystemCommand]
    | typeof OSCommand[keyof typeof OSCommand];

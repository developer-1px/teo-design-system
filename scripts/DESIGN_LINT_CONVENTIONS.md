# Design Lint Conventions

## 🚨 CRITICAL RULE: NO REGEX IN LINT

**ABSOLUTE PROHIBITION**: Design lint MUST use TypeScript AST analysis only.

### Why No Regex?

1. **Accuracy**: Regex cannot correctly parse nested JSX, complex expressions, or edge cases
2. **Safety**: Text-based manipulation can corrupt code structure
3. **Maintainability**: AST provides type-safe, predictable transformations
4. **Reliability**: TypeScript Compiler guarantees valid syntax

### Required Approach

✅ **ALWAYS USE:**
- ts-morph AST manipulation
- `element.getInitializer()`
- `node.getProperty()`
- `sourceFile.transform()`

❌ **NEVER USE:**
- Regular expressions for parsing
- String matching for code structure
- Text replacement for AST nodes
- `match()`, `replace()`, `split()` on code

### Example: Correct vs Wrong

**❌ WRONG (Regex):**
```typescript
const match = text.match(/\{\s*\{([^}]+)\}\s*\}/);
const properties = match[1].split(",");
```

**✅ CORRECT (AST):**
```typescript
const initializer = styleAttr.getInitializer();
const objectLiteral = initializer.asKind(SyntaxKind.JsxExpression)
  ?.getExpression()
  ?.asKind(SyntaxKind.ObjectLiteralExpression);
const properties = objectLiteral?.getProperties();
```

## Implementation Guidelines

1. **Parse with AST**: Use ts-morph's type-safe APIs
2. **Transform with AST**: Use node manipulation methods
3. **Validate with TypeScript**: Let compiler verify correctness
4. **Test edge cases**: Complex expressions, nested objects, ternaries

## Consequences of Violation

Regex-based parsing will:
- Corrupt files with complex expressions
- Fail on edge cases
- Create syntax errors
- Break production code

**If you need to parse code, use the AST. No exceptions.**

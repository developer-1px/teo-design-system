/**
 * AST parsing utilities for extracting Frame props and style objects
 */

import type {
  FrameProps,
  JsxAttribute,
  JsxOpeningElement,
  JsxSelfClosingElement,
} from "./types";
import { Node, SyntaxKind } from "./types";

/**
 * Extract all Frame props from JSX element using AST
 * ⚠️ CRITICAL: NO REGEX ALLOWED - Use AST only!
 *
 * @param element - JSX opening or self-closing element
 * @returns Frame props object
 */
export function extractFrameProps(
  element: JsxOpeningElement | JsxSelfClosingElement,
): FrameProps {
  const props: FrameProps = {};

  for (const attr of element.getAttributes()) {
    if (attr.getKind() !== SyntaxKind.JsxAttribute) continue;

    const jsxAttr = attr.asKind(SyntaxKind.JsxAttribute);
    if (!jsxAttr) continue;

    const nameNode = jsxAttr.getNameNode();
    const name = nameNode.getText();
    const initializer = jsxAttr.getInitializer();

    if (!initializer) {
      // Boolean prop (e.g., border, fill)
      props[name] = true;
      continue;
    }

    // Get value from different node types
    if (Node.isStringLiteral(initializer)) {
      props[name] = initializer.getLiteralValue();
    } else if (Node.isJsxExpression(initializer)) {
      const expression = initializer.getExpression();
      if (!expression) continue;

      if (Node.isStringLiteral(expression)) {
        props[name] = expression.getLiteralValue();
      } else if (Node.isNumericLiteral(expression)) {
        props[name] = expression.getLiteralValue();
      } else if (Node.isTrueLiteral(expression)) {
        props[name] = true;
      } else if (Node.isFalseLiteral(expression)) {
        props[name] = false;
      } else if (Node.isPropertyAccessExpression(expression)) {
        // e.g., Layout.Stack.Content or Space.n12
        props[name] = expression.getText();
      } else if (
        name === "override" &&
        Node.isObjectLiteralExpression(expression)
      ) {
        // Parse override object literal
        props[name] = parseObjectLiteral(expression);
      } else {
        // Complex expression, store as text
        props[name] = expression.getText();
      }
    }
  }

  return props;
}

/**
 * Parse object literal expression to extract property values
 * Used for parsing override prop
 *
 * @param objectLiteral - Object literal AST node
 * @returns Parsed object with property values
 */
function parseObjectLiteral(objectLiteral: any): Record<string, any> {
  const result: Record<string, any> = {};

  for (const prop of objectLiteral.getProperties()) {
    if (prop.getKind() !== SyntaxKind.PropertyAssignment) continue;

    const propertyAssignment = prop.asKind(SyntaxKind.PropertyAssignment);
    if (!propertyAssignment) continue;

    const name = propertyAssignment.getName();
    const initializer = propertyAssignment.getInitializer();

    if (!initializer) continue;

    // Get the value
    if (Node.isStringLiteral(initializer)) {
      result[name] = initializer.getLiteralValue();
    } else if (Node.isNumericLiteral(initializer)) {
      result[name] = initializer.getLiteralValue();
    } else if (Node.isTrueLiteral(initializer)) {
      result[name] = true;
    } else if (Node.isFalseLiteral(initializer)) {
      result[name] = false;
    } else if (Node.isPropertyAccessExpression(initializer)) {
      // e.g., Space.n12, Size.fill
      result[name] = initializer.getText();
    } else {
      // Complex expression, store as text
      result[name] = initializer.getText();
    }
  }

  return result;
}

/**
 * Parse style attribute value to extract CSS properties
 * ⚠️ CRITICAL: NO REGEX ALLOWED - Use AST only!
 *
 * @param styleAttr - JSX style attribute
 * @returns CSS properties object or null if not parseable
 */
export function parseStyleObject(
  styleAttr: JsxAttribute,
): Record<string, string> | null {
  const initializer = styleAttr.getInitializer();
  if (!initializer) return null;

  // Get the JsxExpression node
  const jsxExpression = initializer.asKind(SyntaxKind.JsxExpression);
  if (!jsxExpression) return null;

  // Get the inner expression (the object literal)
  const expression = jsxExpression.getExpression();
  if (!expression) return null;

  // Check if it's an ObjectLiteralExpression
  const objectLiteral = expression.asKind(SyntaxKind.ObjectLiteralExpression);
  if (!objectLiteral) return null;

  const styleObj: Record<string, string> = {};

  // Iterate through properties using AST
  for (const prop of objectLiteral.getProperties()) {
    // Only handle PropertyAssignment (e.g., border: "...")
    if (prop.getKind() !== SyntaxKind.PropertyAssignment) continue;

    const propertyAssignment = prop.asKindOrThrow(
      SyntaxKind.PropertyAssignment,
    );
    const name = propertyAssignment.getName();
    const initializer = propertyAssignment.getInitializer();

    if (!initializer) continue;

    // Get the literal value (string, number, etc.)
    let value: string | null = null;

    if (Node.isStringLiteral(initializer)) {
      value = initializer.getLiteralValue();
    } else if (Node.isNumericLiteral(initializer)) {
      value = initializer.getLiteralValue().toString();
    } else if (Node.isNoSubstitutionTemplateLiteral(initializer)) {
      value = initializer.getLiteralValue();
    } else {
      // For complex expressions (ternary, function calls, etc.), get the text representation
      value = initializer.getText();
    }

    if (value !== null) {
      styleObj[name] = value;
    }
  }

  return styleObj;
}

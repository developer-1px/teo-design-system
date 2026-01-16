import { SyntaxKind } from "./types";
import type { JsxOpeningElement, JsxSelfClosingElement, JsxAttribute, TokenConversion } from "./types";
export function fixStyleToOverride(
  element: JsxOpeningElement | JsxSelfClosingElement,
  styleAttr: JsxAttribute,
  conversions: Array<{ cssProp: string; cssValue: string; overrideProp: string; tokenValue: string }>,
): void {
  // Step 1: Get or create override attribute
  let overrideAttr = element.getAttribute("override");

  // Step 2: Remove converted properties from style
  const initializer = styleAttr.getInitializer();
  const jsxExpression = initializer?.asKind(SyntaxKind.JsxExpression);
  const objectLiteral = jsxExpression?.getExpression()?.asKind(SyntaxKind.ObjectLiteralExpression);

  if (objectLiteral) {
    // Find and remove converted properties from style AST
    const properties = objectLiteral.getProperties();
    for (const prop of properties) {
      if (prop.getKind() === SyntaxKind.PropertyAssignment) {
        const assignment = prop.asKind(SyntaxKind.PropertyAssignment);
        const propName = assignment?.getName();

        // Check if this property is being converted
        const isConverted = conversions.some(c => c.cssProp === propName);
        if (isConverted && assignment) {
          assignment.remove();
        }
      }
    }

    // If style object is now empty, remove the entire style attribute
    if (objectLiteral.getProperties().length === 0) {
      styleAttr.remove();
    }
  }

  // Step 3: Add or update override attribute
  if (!overrideAttr) {
    // Create new override={{ ... }}
    const overrideProps = conversions.map(c => `${c.overrideProp}: ${c.tokenValue}`).join(", ");
    const insertIndex = element.getAttributes().length;
    element.insertAttribute(insertIndex, {
      name: "override",
      initializer: `{{ ${overrideProps} }}`,
    });
  } else {
    // Merge with existing override
    const overrideInit = overrideAttr.getInitializer();
    const overrideExpr = overrideInit?.asKind(SyntaxKind.JsxExpression);
    const overrideObj = overrideExpr?.getExpression()?.asKind(SyntaxKind.ObjectLiteralExpression);

    if (overrideObj) {
      // Add new properties to existing override object
      for (const { overrideProp, tokenValue } of conversions) {
        overrideObj.addPropertyAssignment({
          name: overrideProp,
          initializer: tokenValue,
        });
      }
    }
  }
}

/**
 * Apply auto-fix: convert style={{ border: "..." }} to border prop
 * ⚠️ CRITICAL: NO STRING TEMPLATES - Use AST node manipulation only!
 */
export function fixBorderStyle(
  element: JsxOpeningElement | JsxSelfClosingElement,
  styleAttr: JsxAttribute,
  styleObj: Record<string, string>,
  borderType: string,
): void {
  // Step 1: Remove the border property from style object
  delete styleObj[borderType];

  // Step 2: Update or remove style attribute using AST
  if (Object.keys(styleObj).length === 0) {
    // No remaining styles - remove the entire style attribute
    styleAttr.remove();
  } else {
    // Get the existing object literal expression
    const initializer = styleAttr.getInitializer();
    const jsxExpression = initializer?.asKind(SyntaxKind.JsxExpression);
    const objectLiteral = jsxExpression?.getExpression()?.asKind(SyntaxKind.ObjectLiteralExpression);

    if (objectLiteral) {
      // Find and remove the border property from AST
      const properties = objectLiteral.getProperties();
      for (const prop of properties) {
        if (prop.getKind() === SyntaxKind.PropertyAssignment) {
          const assignment = prop.asKind(SyntaxKind.PropertyAssignment);
          if (assignment && assignment.getName() === borderType) {
            assignment.remove();
            break;
          }
        }
      }
    }
  }

  // Step 3: Add border prop using ts-morph's insertAttribute
  const insertIndex = element.getAttributes().length;

  if (borderType === "border") {
    // Boolean prop: <Frame border>
    element.insertAttribute(insertIndex, {
      name: "border",
    });
  } else {
    // String prop: <Frame border="top">
    const direction = borderType.replace("border", "").toLowerCase();
    element.insertAttribute(insertIndex, {
      name: "border",
      initializer: `"${direction}"`,
    });
  }
}

/**
 * Apply auto-fix: convert style={{ alignItems: "center", justifyContent: "center" }} to pack prop
 * ⚠️ CRITICAL: NO STRING TEMPLATES - Use AST node manipulation only!
 */
export function fixCenterToPack(
  element: JsxOpeningElement | JsxSelfClosingElement,
  styleAttr: JsxAttribute,
  styleObj: Record<string, string>,
): void {
  // Step 1: Remove alignItems and justifyContent from style object
  delete styleObj.alignItems;
  delete styleObj.justifyContent;

  // Step 2: Update or remove style attribute using AST
  if (Object.keys(styleObj).length === 0) {
    // No remaining styles - remove the entire style attribute
    styleAttr.remove();
  } else {
    // Get the existing object literal expression
    const initializer = styleAttr.getInitializer();
    const jsxExpression = initializer?.asKind(SyntaxKind.JsxExpression);
    const objectLiteral = jsxExpression?.getExpression()?.asKind(SyntaxKind.ObjectLiteralExpression);

    if (objectLiteral) {
      // Find and remove alignItems and justifyContent properties from AST
      const properties = objectLiteral.getProperties();
      for (const prop of properties) {
        if (prop.getKind() === SyntaxKind.PropertyAssignment) {
          const assignment = prop.asKind(SyntaxKind.PropertyAssignment);
          const propName = assignment?.getName();

          if (propName === "alignItems" || propName === "justifyContent") {
            assignment?.remove();
          }
        }
      }
    }
  }

  // Step 3: Add pack prop (boolean) using ts-morph's insertAttribute
  const insertIndex = element.getAttributes().length;
  element.insertAttribute(insertIndex, {
    name: "pack",
  });
}

/**
 * Check design system rules on Frame component
 */

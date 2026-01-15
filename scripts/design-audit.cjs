const fs = require("node:fs");
const path = require("node:path");

// Configuration
const TARGET_DIRS = [
  path.join(process.cwd(), "src/apps"),
  path.join(process.cwd(), "src/inspector"),
];
const IGNORE_FILES = [".DS_Store"];

// Threshold for tiny actions
const MIN_ACTION_SIZE = 20;

// Regex Patterns
const HARDCODED_PIXEL_REGEX =
  /:\s*["']\d+px["']|width={["']\d+px["']}|height={["']\d+px["']}|w={["']\d+px["']}|h={["']\d+px["']}/g;

const SIZE_VALUE_REGEX = /(?<!icon)(?:width|height|w|h|min-width|min-height|minWidth|minHeight|size)[=:]\s*[{'"]?(\d+)(?:px)?['"}]?/i;
const SIZE_TOKEN_REGEX = /(?<!icon)(?:width|height|w|h|min-width|min-height|minWidth|minHeight|size)[=:]\s*[{'"]?var\(--size-n?(\d+)\)['"}]?/i;

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach((f) => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      if (
        !IGNORE_FILES.includes(f) &&
        (f.endsWith(".tsx") || f.endsWith(".ts"))
      ) {
        callback(dirPath);
      }
    }
  });
}

function auditFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");
  const issues = [];
  const componentStack = []; // Stack of { node, children: [] }

  let currentComponent = null;

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("{/*"))
      return;

    // Detect tag start
    const tagMatch = trimmed.match(/^<(\w+)/);
    if (tagMatch) {
      const tagName = tagMatch[1];
      const isAuditable = ["Frame", "Action", "button"].includes(tagName);
      const isSelfClosing = trimmed.endsWith("/>") || line.includes("/>");

      const node = {
        line: lineNum,
        tag: tagName,
        hasSurface: false,
        hasRadius: false,
        hasCentering: false,
        hasFlex: false,
        isRow: false,
        content: trimmed,
        children: [],
        sizes: [], // Store detected size values/tokens
      };

      if (isAuditable) {
        collectProps(line, node);
        currentComponent = node;
      }

      // Add as child to parent
      if (componentStack.length > 0) {
        componentStack[componentStack.length - 1].children.push(node);
      }

      if (!isSelfClosing) {
        componentStack.push(node);
      } else if (isAuditable) {
        runComponentChecks(node, issues);
      }
    } else if (currentComponent) {
      // Continuation of props
      collectProps(line, currentComponent);

      if (trimmed.endsWith(">") || trimmed.includes("/>")) {
        if (trimmed.includes("/>")) {
          const node = componentStack.pop();
          if (node) runComponentChecks(node, issues);
        }
        currentComponent = null;
      }
    }

    // Detect tag close
    if (trimmed.startsWith("</")) {
      const closingTag = trimmed.match(/^<\/(\w+)/)?.[1];
      const closedNode = componentStack.pop();
      if (closedNode && closedNode.tag === closingTag) {
        if (["Frame", "Action", "button"].includes(closedNode.tag)) {
          runComponentChecks(closedNode, issues);
        }
      }
    }

    // Original Hardcoded Pixel Check
    const pixelMatches = line.match(HARDCODED_PIXEL_REGEX);
    if (pixelMatches) {
      pixelMatches.forEach((match) => {
        if (!match.includes("1px") && !match.includes("0px")) {
          issues.push({
            line: lineNum,
            type: "Hardcoded Pixel",
            value: match.trim(),
            content: trimmed,
          });
        }
      });
    }
  });

  return issues;
}

function collectProps(line, node) {
  const l = line.toLowerCase();
  if (node.tag === "Frame") {
    if (l.includes("surface=")) node.hasSurface = true;
    if (l.includes("rounded=") || l.includes(" r=")) node.hasRadius = true;
    if (/\b(?:max-?width|margin|width)\b\s*[=:]/i.test(l) && !l.includes("scrollbarwidth"))
      node.hasCentering = true;
    if (l.includes("flex") || l.includes("fill")) node.hasFlex = true;
    if (l.includes("layout") && l.includes("row")) node.isRow = true;
  }

  // Detect size values
  const sizeMatch = line.match(SIZE_VALUE_REGEX);
  if (sizeMatch) node.sizes.push(parseInt(sizeMatch[1]));

  const tokenMatch = line.match(SIZE_TOKEN_REGEX);
  if (tokenMatch) node.sizes.push(parseInt(tokenMatch[1]));
}

function runComponentChecks(node, issues) {
  // Rule: Rigid Row
  // Applying only to fixed-width rows (centering or explicit width)
  if (node.tag === "Frame" && node.isRow && node.hasCentering && node.children.length > 1) {
    const hasFlexibleChild = node.children.some((c) => c.hasFlex);
    if (!hasFlexibleChild) {
      issues.push({
        line: node.line,
        type: "Rigid Row",
        value: "Fixed-width Row must have at least one flexible child",
        content: node.content,
      });
    }
  }

  // Rule: Floating Flat Surface
  if (node.tag === "Frame" && node.hasSurface && !node.hasRadius && node.hasCentering) {
    issues.push({
      line: node.line,
      type: "Floating Flat Surface",
      value: "Surface with no radius must touch container edges",
      content: node.content,
    });
  }

  // Rule: Tiny Action
  if (node.tag === "Action" || node.tag === "button") {
    const tinySize = node.sizes.find((s) => s > 0 && s < MIN_ACTION_SIZE);
    if (tinySize !== undefined) {
      issues.push({
        line: node.line,
        type: "Tiny Action",
        value: `Interactive element too small (${tinySize}px). Minimum safe size is ${MIN_ACTION_SIZE}px.`,
        content: node.content,
      });
    }
  }
}

console.log("🔍 Starting Design System Audit...\n");

let totalIssues = 0;
TARGET_DIRS.forEach((dir) => {
  walkDir(dir, (filePath) => {
    const issues = auditFile(filePath);
    if (issues.length > 0) {
      console.log(`📄 ${path.relative(process.cwd(), filePath)}`);
      issues.forEach((issue) => {
        console.log(`   L${issue.line} [${issue.type}]: ${issue.value}`);
        console.log(`      Code: ${issue.content}`);
      });
      console.log("");
      totalIssues += issues.length;
    }
  });
});

console.log(`✅ Audit Complete. Found ${totalIssues} potential anomalies.`);

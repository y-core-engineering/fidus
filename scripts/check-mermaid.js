#!/usr/bin/env node

/**
 * Comprehensive Mermaid diagram checker
 * Combines syntax validation, PIPE error detection, and contrast checks
 *
 * Usage: node scripts/check-mermaid.js [options] <files...>
 *
 * Options:
 *   --syntax-only     Only check syntax errors
 *   --contrast-only   Only check color contrast
 *   --fix-colors      Automatically fix light colors (use with caution)
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// COLOR UTILITIES (from check-mermaid-contrast.js)
// ============================================================================

function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(rgb1, rgb2) {
  const l1 = getLuminance(...rgb1);
  const l2 = getLuminance(...rgb2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function hexToRgb(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  return [r, g, b];
}

const colorNames = {
  'white': '#ffffff', 'black': '#000000', 'red': '#ff0000',
  'green': '#00ff00', 'blue': '#0000ff', 'yellow': '#ffff00',
  'cyan': '#00ffff', 'magenta': '#ff00ff', 'gray': '#808080',
  'grey': '#808080', 'orange': '#ffa500', 'purple': '#800080',
  'pink': '#ffc0cb', 'brown': '#a52a2a',
};

// ============================================================================
// PIPE ERROR DETECTION (NEW!)
// ============================================================================

function checkPipeErrors(diagram, filename, lineNumber) {
  const errors = [];
  const lines = diagram.split('\n');

  lines.forEach((line, idx) => {
    const actualLine = lineNumber + idx;

    // Check for PIPE character in UNQUOTED node labels
    // Pattern: NodeName[text with | character]  ← ERROR
    // OK: NodeName["text with | character"]     ← QUOTED
    // OK: -->|text|                              ← ARROW LABEL

    if (line.includes('|') && !line.trim().startsWith('style') && !line.includes('%%')) {
      // Check if it's in an UNQUOTED node label
      const unquotedPipeMatch = line.match(/(\w+)\[([^"\]]*\|[^"\]]*)\]/);

      if (unquotedPipeMatch) {
        // Ignore if it's an arrow label (pattern: -->|label|)
        // Ignore if it's a database cylinder shape (pattern: [(DatabaseName)])
        if (!line.match(/--[->]\|.*?\|/) && !line.match(/\[\(/)) {
          errors.push({
            line: actualLine,
            content: line.trim(),
            issue: `PIPE character in unquoted node label`,
            suggestion: `Use quotes: ["${unquotedPipeMatch[2]}"] or replace '|' with 'or' or ','`,
            severity: 'error'
          });
        }
      }
    }

    // Check for parentheses in UNQUOTED node labels
    // Pattern: NodeName[text (with parens)]  ← ERROR
    // OK: NodeName["text (with parens)"]     ← QUOTED
    // OK: [(DatabaseName)]                   ← CYLINDER SHAPE

    // Look for pattern: Word followed by [ without quote, containing parentheses
    if (line.match(/\w+\[[^"]*\(/) && !line.match(/\w+\["/) && !line.includes('%%')) {
      // Ignore cylinder shapes: [(DatabaseName)]
      if (!line.match(/\[\([^)]+\)\]/)) {
        const match = line.match(/(\w+)\[([^\]]+)\]/);
        if (match && match[2].includes('(')) {
          errors.push({
            line: actualLine,
            content: line.trim(),
            issue: `Parentheses in unquoted node label`,
            suggestion: `Use quotes: ["${match[2]}"]`,
            severity: 'error'
          });
        }
      }
    }

    // Check for nested brackets (another common error)
    // Pattern: NodeName[text [nested]]  ← ERROR
    if (line.match(/\[[^\]"]*\[[^\]]*\]/)) {
      errors.push({
        line: actualLine,
        content: line.trim(),
        issue: `Nested brackets in node label`,
        suggestion: `Remove inner brackets, use quotes ["..."], or use • or → instead`,
        severity: 'error'
      });
    }
  });

  return errors;
}

// ============================================================================
// SYNTAX VALIDATION (from validate-mermaid.js)
// ============================================================================

function validateMermaidSyntax(diagram, filename, lineNumber) {
  const errors = [];
  const lines = diagram.split('\n');

  // Extract diagram type
  const firstLine = diagram.trim().split('\n')[0];
  const type = firstLine.trim();

  // Check for common syntax issues
  if (type.startsWith('graph') || type.startsWith('flowchart')) {
    // Check for unmatched brackets
    const openBrackets = (diagram.match(/\[/g) || []).length;
    const closeBrackets = (diagram.match(/\]/g) || []).length;
    if (openBrackets !== closeBrackets) {
      errors.push({
        line: lineNumber,
        issue: `Unmatched brackets: ${openBrackets} open, ${closeBrackets} close`,
        severity: 'error'
      });
    }

    // Check for unmatched parentheses
    const openParens = (diagram.match(/\(/g) || []).length;
    const closeParens = (diagram.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      errors.push({
        line: lineNumber,
        issue: `Unmatched parentheses: ${openParens} open, ${closeParens} close`,
        severity: 'error'
      });
    }

    // Check for unmatched braces
    const openBraces = (diagram.match(/\{/g) || []).length;
    const closeBraces = (diagram.match(/\}/g) || []).length;
    if (openBraces !== closeBraces) {
      errors.push({
        line: lineNumber,
        issue: `Unmatched braces: ${openBraces} open, ${closeBraces} close`,
        severity: 'error'
      });
    }
  }

  // Check for lines that are too long
  lines.forEach((line, idx) => {
    if (line.length > 300) {
      errors.push({
        line: lineNumber + idx,
        issue: `Line is very long (${line.length} chars) - may cause rendering issues`,
        severity: 'warning'
      });
    }
  });

  // Check for too many nodes
  const nodes = diagram.match(/\w+\[/g) || [];
  if (nodes.length > 50) {
    errors.push({
      line: lineNumber,
      issue: `Diagram has ${nodes.length} nodes - may be too complex to render`,
      severity: 'warning'
    });
  }

  return {
    type,
    errors,
    lineCount: lines.length,
    nodeCount: nodes.length
  };
}

// ============================================================================
// CONTRAST CHECKING (from check-mermaid-contrast.js)
// ============================================================================

function checkColorContrast(diagram, lineNumber) {
  const issues = [];
  const lines = diagram.split('\n');

  lines.forEach((line, idx) => {
    // Look for style declarations with fill color
    const styleMatch = line.match(/style\s+(\w+)\s+fill:(#[0-9a-fA-F]{3,6}|[a-z]+)/i);

    if (styleMatch) {
      const nodeName = styleMatch[1];
      let fillColor = styleMatch[2];

      // Check if explicit text color is specified
      const hasExplicitColor = line.match(/,\s*color:\s*(#[0-9a-fA-F]{3,6}|#fff|#ffffff|white)/i);

      if (hasExplicitColor) {
        // Explicit color specified, assume it's correct
        return;
      }

      // Convert color name to hex
      if (!fillColor.startsWith('#')) {
        fillColor = colorNames[fillColor.toLowerCase()] || '#ffffff';
      }

      try {
        const bgColor = hexToRgb(fillColor);
        const textColor = hexToRgb('#000000'); // Default Mermaid text color
        const contrast = getContrastRatio(textColor, bgColor);

        // WCAG AA: 4.5:1 for normal text
        if (contrast < 4.5) {
          // Check if white text would work
          const whiteContrast = getContrastRatio(hexToRgb('#ffffff'), bgColor);

          issues.push({
            line: lineNumber + idx,
            nodeName,
            fillColor,
            currentContrast: contrast.toFixed(2),
            required: 4.5,
            suggestion: whiteContrast >= 4.5
              ? `Add ,color:#ffffff to style (contrast: ${whiteContrast.toFixed(2)}:1)`
              : `Choose lighter background color`,
            severity: 'warning'
          });
        }
      } catch (e) {
        // Skip invalid colors
      }
    }
  });

  return issues;
}

// ============================================================================
// DIAGRAM EXTRACTION
// ============================================================================

function extractMermaidDiagrams(content, filename) {
  const diagrams = [];
  const lines = content.split('\n');

  let inDiagram = false;
  let currentDiagram = [];
  let startLine = 0;

  lines.forEach((line, idx) => {
    if (line.trim() === '```mermaid') {
      inDiagram = true;
      startLine = idx + 1;
      currentDiagram = [];
    } else if (line.trim() === '```' && inDiagram) {
      inDiagram = false;
      diagrams.push({
        content: currentDiagram.join('\n'),
        lineNumber: startLine,
        filename
      });
    } else if (inDiagram) {
      currentDiagram.push(line);
    }
  });

  return diagrams;
}

// ============================================================================
// MAIN CHECK FUNCTION
// ============================================================================

function checkDiagram(diagram, filename, options) {
  const results = {
    filename,
    lineNumber: diagram.lineNumber,
    errors: [],
    warnings: [],
    info: {}
  };

  // 1. Check for PIPE errors (CRITICAL!)
  const pipeErrors = checkPipeErrors(diagram.content, filename, diagram.lineNumber);
  results.errors.push(...pipeErrors);

  // 2. Syntax validation
  if (!options.contrastOnly) {
    const syntaxResult = validateMermaidSyntax(diagram.content, filename, diagram.lineNumber);
    results.info.type = syntaxResult.type;
    results.info.lineCount = syntaxResult.lineCount;
    results.info.nodeCount = syntaxResult.nodeCount;

    syntaxResult.errors.forEach(err => {
      if (err.severity === 'error') {
        results.errors.push(err);
      } else {
        results.warnings.push(err);
      }
    });
  }

  // 3. Contrast checking
  if (!options.syntaxOnly) {
    const contrastIssues = checkColorContrast(diagram.content, diagram.lineNumber);
    results.warnings.push(...contrastIssues);
  }

  return results;
}

// ============================================================================
// REPORTING
// ============================================================================

function printResults(fileResults, options) {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║       Comprehensive Mermaid Diagram Check Report          ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  let totalDiagrams = 0;
  let totalErrors = 0;
  let totalWarnings = 0;
  let filesWithErrors = 0;

  fileResults.forEach(file => {
    totalDiagrams += file.diagrams.length;

    const fileErrors = file.diagrams.reduce((sum, d) => sum + d.errors.length, 0);
    const fileWarnings = file.diagrams.reduce((sum, d) => sum + d.warnings.length, 0);

    totalErrors += fileErrors;
    totalWarnings += fileWarnings;

    if (fileErrors > 0) {
      filesWithErrors++;
      console.log(`\n❌ ${file.filename}`);
      console.log(`   ${file.diagrams.length} diagrams, ${fileErrors} errors, ${fileWarnings} warnings\n`);

      file.diagrams.forEach((diagram, idx) => {
        if (diagram.errors.length > 0) {
          console.log(`   📊 Diagram #${idx + 1} (line ${diagram.lineNumber})${diagram.info.type ? ' - ' + diagram.info.type : ''}`);

          diagram.errors.forEach(err => {
            console.log(`      🔴 ERROR (line ${err.line}): ${err.issue}`);
            if (err.content) {
              console.log(`         Code: ${err.content}`);
            }
            if (err.suggestion) {
              console.log(`         Fix:  ${err.suggestion}`);
            }
          });
          console.log();
        }
      });
    } else if (fileWarnings > 0 && !options.syntaxOnly) {
      console.log(`\n⚠️  ${file.filename}`);
      console.log(`   ${file.diagrams.length} diagrams, ${fileWarnings} warnings\n`);

      file.diagrams.forEach((diagram, idx) => {
        if (diagram.warnings.length > 0) {
          console.log(`   📊 Diagram #${idx + 1} (line ${diagram.lineNumber})`);

          diagram.warnings.forEach(warn => {
            console.log(`      ⚠️  WARNING (line ${warn.line}): ${warn.issue}`);
            if (warn.suggestion) {
              console.log(`         Suggestion: ${warn.suggestion}`);
            }
          });
          console.log();
        }
      });
    } else {
      console.log(`✅ ${file.filename} - ${file.diagrams.length} diagrams, all clean`);
    }
  });

  // Summary
  console.log('\n' + '─'.repeat(60));
  console.log('SUMMARY:');
  console.log(`  📁 Files checked: ${fileResults.length}`);
  console.log(`  📊 Total diagrams: ${totalDiagrams}`);
  console.log(`  🔴 Total errors: ${totalErrors}`);
  console.log(`  ⚠️  Total warnings: ${totalWarnings}`);
  console.log('─'.repeat(60));

  if (totalErrors > 0) {
    console.log(`\n❌ Found ${totalErrors} critical errors in ${filesWithErrors} files`);
    console.log('   Please fix these before committing!\n');
    return 1;
  } else if (totalWarnings > 0) {
    console.log(`\n⚠️  Found ${totalWarnings} warnings (non-critical)`);
    console.log('   Consider addressing these for better quality\n');
    return 0;
  } else {
    console.log('\n✅ All diagrams are valid! Great work!\n');
    return 0;
  }
}

// ============================================================================
// MAIN
// ============================================================================

function main() {
  const args = process.argv.slice(2);

  const options = {
    syntaxOnly: args.includes('--syntax-only'),
    contrastOnly: args.includes('--contrast-only'),
    fixColors: args.includes('--fix-colors')
  };

  const files = args.filter(arg => !arg.startsWith('--'));

  if (files.length === 0) {
    console.error('Usage: node check-mermaid.js [options] <files...>');
    console.error('');
    console.error('Options:');
    console.error('  --syntax-only     Only check syntax errors');
    console.error('  --contrast-only   Only check color contrast');
    console.error('  --fix-colors      Automatically fix light colors (use with caution)');
    console.error('');
    console.error('Examples:');
    console.error('  node scripts/check-mermaid.js docs/**/*.md');
    console.error('  node scripts/check-mermaid.js --syntax-only docs/ux-ui-design/*.md');
    process.exit(1);
  }

  const fileResults = [];

  files.forEach(filepath => {
    if (!fs.existsSync(filepath)) {
      console.error(`File not found: ${filepath}`);
      return;
    }

    const content = fs.readFileSync(filepath, 'utf-8');
    const filename = path.basename(filepath);
    const diagrams = extractMermaidDiagrams(content, filename);

    const diagramResults = diagrams.map(diagram =>
      checkDiagram(diagram, filename, options)
    );

    fileResults.push({
      filename,
      filepath,
      diagrams: diagramResults
    });
  });

  const exitCode = printResults(fileResults, options);
  process.exit(exitCode);
}

main();

/**
 * Convert Playwright code to natural language descriptions
 */

export const convertToNaturalLanguage = (codeLine: string): string => {
  // Remove 'await' and trailing semicolons
  let line = codeLine.replace('await ', '').replace(/;$/, '').trim();

  // Handle page.goto()
  if (line.includes('.goto(')) {
    const urlMatch = line.match(/\.goto\(['"]([^'"]+)['"]/);
    if (urlMatch) {
      return `Go to ${urlMatch[1]}`;
    }
    return 'Navigate to page';
  }

  // Handle clicks
  if (line.includes('.click(')) {
    // Extract selector for context
    const selectorMatch = line.match(/getByRole\(['"]([^'"]+)['"],\s*\{[^}]*name:\s*['"]([^'"]+)['"]/);
    if (selectorMatch) {
      return `Click on "${selectorMatch[2]}"`;
    }

    const roleMatch = line.match(/getByRole\(['"]([^'"]+)['"]/);
    if (roleMatch) {
      return `Click on ${roleMatch[1]}`;
    }

    const testIdMatch = line.match(/getByTestId\(['"]([^'"]+)['"]/);
    if (testIdMatch) {
      return `Click on ${testIdMatch[1].replace(/-/g, ' ')}`;
    }

    const textMatch = line.match(/getByText\(['"]([^'"]+)['"]/);
    if (textMatch) {
      return `Click on "${textMatch[1]}"`;
    }

    return 'Click element';
  }

  // Handle fill
  if (line.includes('.fill(')) {
    const fillMatch = line.match(/\.fill\(['"]([^'"]+)['"]/);
    const testIdMatch = line.match(/getByTestId\(['"]([^'"]+)['"]/);

    if (fillMatch && testIdMatch) {
      const fieldName = testIdMatch[1].replace(/-/g, ' ');
      return `Fill "${fillMatch[1]}" in ${fieldName}`;
    }

    if (fillMatch) {
      return `Fill "${fillMatch[1]}"`;
    }

    return 'Fill input field';
  }

  // Handle press (keyboard)
  if (line.includes('.press(')) {
    const keyMatch = line.match(/\.press\(['"]([^'"]+)['"]/);
    if (keyMatch) {
      return `Press ${keyMatch[1]} key`;
    }
    return 'Press key';
  }

  // Handle check/uncheck
  if (line.includes('.check(')) {
    return 'Check checkbox';
  }
  if (line.includes('.uncheck(')) {
    return 'Uncheck checkbox';
  }

  // Handle select
  if (line.includes('.selectOption(')) {
    const optionMatch = line.match(/\.selectOption\(['"]([^'"]+)['"]/);
    if (optionMatch) {
      return `Select "${optionMatch[1]}"`;
    }
    return 'Select option';
  }

  // Handle hover
  if (line.includes('.hover(')) {
    return 'Hover over element';
  }

  // Fallback: return cleaned up code
  return line;
};

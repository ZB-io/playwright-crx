import { InjectedScript } from './playwright/packages/injected/src/injectedScript.ts';

// Expose it to the window
(window as any).PlaywrightGenerator = new InjectedScript(
  globalThis as any,
  {
    isUnderTest: false,                   // Required by interface
    sdkLanguage: "javascript",            // maps to your "javascript" arg
    testIdAttributeName: "data-testid",   // maps to your "testId" arg
    stableRafCount: 1,                    // maps to your "1" arg
    browserName: "chromium",              // maps to your "chromium" arg
    inputFileRoleTextbox: false,          // Required by interface (default behavior)
    customEngines: []                     // maps to your { engines: [] } arg
  }
);
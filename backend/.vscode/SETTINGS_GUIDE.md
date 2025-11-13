# VSCode Settings Guide

This document explains all the VSCode settings configured for this project and how they enhance your development workflow.

## 📋 Table of Contents

- [Overview](#overview)
- [Editor Settings](#editor-settings)
- [File Management](#file-management)
- [TypeScript Configuration](#typescript-configuration)
- [Linting & Formatting](#linting--formatting)
- [Import Management](#import-management)
- [Performance Optimizations](#performance-optimizations)
- [Recommended Extensions](#recommended-extensions)
- [Troubleshooting](#troubleshooting)

---

## Overview

The VSCode configuration for this project is designed to:

✅ **Automatically format code** on save using Prettier  
✅ **Fix linting errors** automatically with ESLint  
✅ **Organize and optimize imports** on save  
✅ **Auto-save files** after 1 second delay  
✅ **Enhance code navigation** with IntelliSense and type hints  
✅ **Improve code quality** with consistent formatting rules  
✅ **Boost productivity** with smart suggestions and auto-completion  

---

## Editor Settings

### Format on Save

```json
"editor.formatOnSave": true
"editor.formatOnPaste": true
```

**What it does:** Automatically formats your code using Prettier whenever you save or paste code.

**Benefits:**
- Ensures consistent code style across the team
- Eliminates manual formatting
- Reduces code review comments about formatting

### Code Actions on Save

```json
"editor.codeActionsOnSave": {
  "source.fixAll.eslint": "explicit",
  "source.organizeImports": "explicit",
  "source.removeUnusedImports": "explicit"
}
```

**What it does:** Performs three actions automatically when you save:
1. **Fix ESLint errors** - Automatically fixes all auto-fixable ESLint issues
2. **Organize imports** - Sorts and groups imports logically
3. **Remove unused imports** - Cleans up imports that aren't being used

**Benefits:**
- Keeps code clean and organized
- Prevents unused import warnings
- Fixes common linting issues automatically

### Bracket Pair Colorization

```json
"editor.bracketPairColorization.enabled": true
"editor.guides.bracketPairs": "active"
```

**What it does:** Colors matching brackets with the same color and highlights the active bracket pair.

**Benefits:**
- Easier to identify matching brackets
- Reduces syntax errors
- Improves code readability in nested structures

### Code Rulers

```json
"editor.rulers": [80, 120]
```

**What it does:** Shows vertical lines at 80 and 120 characters.

**Benefits:**
- Helps maintain readable line lengths
- Follows common code style guidelines
- Prevents horizontal scrolling

### IntelliSense & Suggestions

```json
"editor.suggestSelection": "first"
"editor.quickSuggestions": {
  "other": true,
  "comments": false,
  "strings": true
}
"editor.snippetSuggestions": "top"
```

**What it does:** Configures auto-completion behavior to show suggestions as you type.

**Benefits:**
- Faster coding with smart suggestions
- Reduces typos and errors
- Shows relevant completions first

---

## File Management

### Auto-Save

```json
"files.autoSave": "afterDelay"
"files.autoSaveDelay": 1000
```

**What it does:** Automatically saves files 1 second after you stop typing.

**Benefits:**
- Never lose work due to forgotten saves
- Seamless workflow without manual saving
- Triggers format-on-save automatically

### File Cleanup

```json
"files.trimTrailingWhitespace": true
"files.insertFinalNewline": true
"files.eol": "\n"
```

**What it does:** 
- Removes trailing spaces at the end of lines
- Adds a newline at the end of files
- Uses Unix-style line endings (LF)

**Benefits:**
- Cleaner git diffs
- Follows POSIX standards
- Prevents whitespace-related issues

### File Exclusions

```json
"files.exclude": {
  "**/node_modules": true,
  "**/dist": true,
  "**/*.js.map": true
}
```

**What it does:** Hides specified files and folders from the file explorer.

**Benefits:**
- Cleaner workspace view
- Faster file searches
- Focus on source code only

### File Nesting

```json
"explorer.fileNesting.enabled": true
"explorer.fileNesting.patterns": {
  "*.ts": "${capture}.js, ${capture}.d.ts, ${capture}.js.map",
  "package.json": "package-lock.json, yarn.lock, pnpm-lock.yaml"
}
```

**What it does:** Groups related files together in the file explorer.

**Benefits:**
- Cleaner file tree
- Related files stay together
- Easier to find configuration files

---

## TypeScript Configuration

### Import Management

```json
"typescript.updateImportsOnFileMove.enabled": "always"
"typescript.suggest.autoImports": true
"typescript.preferences.importModuleSpecifier": "relative"
"typescript.preferences.quoteStyle": "single"
```

**What it does:**
- Automatically updates imports when you move/rename files
- Suggests imports as you type
- Uses relative paths for imports
- Uses single quotes (matching Prettier config)

**Benefits:**
- No broken imports after refactoring
- Faster coding with auto-import suggestions
- Consistent import style

### Type Hints (Inlay Hints)

```json
"typescript.inlayHints.parameterNames.enabled": "all"
"typescript.inlayHints.parameterTypes.enabled": true
"typescript.inlayHints.variableTypes.enabled": true
"typescript.inlayHints.functionLikeReturnTypes.enabled": true
```

**What it does:** Shows inline type information in your code editor.

**Benefits:**
- Better understanding of function parameters
- See types without hovering
- Easier to work with complex types
- Great for learning TypeScript

**Example:**
```typescript
// Without inlay hints
const result = calculateTotal(items);

// With inlay hints
const result: number = calculateTotal(items: Item[]);
```

---

## Linting & Formatting

### ESLint Integration

```json
"eslint.enable": true
"eslint.validate": ["javascript", "typescript"]
"eslint.run": "onType"
"eslint.format.enable": false
```

**What it does:**
- Enables ESLint for JavaScript and TypeScript
- Runs linting as you type
- Uses Prettier for formatting (not ESLint)

**Benefits:**
- Immediate feedback on code issues
- Catches errors before runtime
- Enforces code quality standards

### Prettier Integration

```json
"prettier.enable": true
"prettier.requireConfig": true
"prettier.useEditorConfig": true
```

**What it does:**
- Enables Prettier formatting
- Requires a Prettier config file (`.prettierrc`)
- Respects EditorConfig settings

**Benefits:**
- Consistent code formatting
- Works with your existing Prettier config
- Integrates with EditorConfig

### Language-Specific Settings

```json
"[typescript]": {
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  }
}
```

**What it does:** Applies specific settings for TypeScript files.

**Benefits:**
- Different languages can have different formatters
- TypeScript gets ESLint + Prettier + import organization
- JSON gets only Prettier formatting

---

## Import Management

### Automatic Import Organization

The configuration automatically organizes imports on save:

**Before:**
```typescript
import { UserService } from './user.service';
import * as express from 'express';
import { Logger } from '../logger/logger.service';
import { Request, Response } from 'express';
```

**After:**
```typescript
import * as express from 'express';
import { Request, Response } from 'express';

import { Logger } from '../logger/logger.service';
import { UserService } from './user.service';
```

**Rules:**
1. External packages first (node_modules)
2. Internal imports second (your code)
3. Alphabetically sorted within each group
4. Blank line between groups

### Unused Import Removal

```json
"source.removeUnusedImports": "explicit"
```

**What it does:** Automatically removes imports that aren't used in the file.

**Benefits:**
- Cleaner code
- Smaller bundle size
- No unused import warnings

---

## Performance Optimizations

### Search Exclusions

```json
"search.exclude": {
  "**/node_modules": true,
  "**/dist": true,
  "**/*.log": true
}
```

**What it does:** Excludes specified folders from search results.

**Benefits:**
- Faster search performance
- More relevant search results
- Reduced memory usage

### File Watcher Exclusions

```json
"files.watcherExclude": {
  "**/node_modules/**": true,
  "**/dist/**": true
}
```

**What it does:** Prevents VSCode from watching changes in these folders.

**Benefits:**
- Reduced CPU usage
- Faster file operations
- Better performance on large projects

---

## Recommended Extensions

### Essential Extensions (Must Install)

1. **ESLint** (`dbaeumer.vscode-eslint`)
   - Integrates ESLint into VSCode
   - Shows linting errors inline
   - Auto-fixes issues on save

2. **Prettier** (`esbenp.prettier-vscode`)
   - Code formatter
   - Formats on save
   - Consistent code style

3. **TypeScript** (`ms-vscode.vscode-typescript-next`)
   - Enhanced TypeScript support
   - Better IntelliSense
   - Latest TypeScript features

### Highly Recommended Extensions

4. **GitLens** (`eamodio.gitlens`)
   - Git blame annotations
   - Commit history
   - Code authorship

5. **Path IntelliSense** (`christian-kohler.path-intellisense`)
   - Auto-completes file paths
   - Works with imports
   - Reduces typos

6. **Import Cost** (`wix.vscode-import-cost`)
   - Shows size of imported packages
   - Helps optimize bundle size
   - Inline size display

7. **Error Lens** (`usernamehw.errorlens`)
   - Shows errors inline
   - Highlights entire line
   - Immediate error visibility

### Optional Extensions

8. **REST Client** (`humao.rest-client`)
   - Test APIs directly in VSCode
   - No need for Postman
   - Save requests in `.http` files

9. **Thunder Client** (`rangav.vscode-thunder-client`)
   - Alternative API testing tool
   - GUI-based
   - Collections support

10. **Material Icon Theme** (`pkief.material-icon-theme`)
    - Better file icons
    - Easier file identification
    - Visual appeal

---

## Troubleshooting

### ESLint Not Working

**Problem:** ESLint errors not showing or auto-fix not working.

**Solutions:**
1. Install ESLint extension: `dbaeumer.vscode-eslint`
2. Reload VSCode: `Cmd+Shift+P` → "Reload Window"
3. Check ESLint output: View → Output → Select "ESLint"
4. Verify `.eslintrc.js` exists in project root

### Prettier Not Formatting

**Problem:** Code not formatting on save.

**Solutions:**
1. Install Prettier extension: `esbenp.prettier-vscode`
2. Check default formatter: `Cmd+Shift+P` → "Format Document With..." → Select Prettier
3. Verify `.prettierrc` exists in project root
4. Check file is not in `.prettierignore`

### Imports Not Organizing

**Problem:** Imports not organizing on save.

**Solutions:**
1. Ensure TypeScript extension is active
2. Check `editor.codeActionsOnSave` in settings
3. Verify file is saved (auto-save or manual)
4. Try manual organize: `Cmd+Shift+P` → "Organize Imports"

### Auto-Save Not Working

**Problem:** Files not auto-saving.

**Solutions:**
1. Check `files.autoSave` setting is "afterDelay"
2. Verify `files.autoSaveDelay` is set (1000ms)
3. Check if file is in a read-only location
4. Restart VSCode

### Performance Issues

**Problem:** VSCode running slowly.

**Solutions:**
1. Exclude large folders from file watcher
2. Disable unused extensions
3. Increase file watcher limit (macOS):
   ```bash
   echo kern.maxfiles=65536 | sudo tee -a /etc/sysctl.conf
   echo kern.maxfilesperproc=65536 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -w kern.maxfiles=65536
   sudo sysctl -w kern.maxfilesperproc=65536
   ```
4. Close unused tabs and windows

---

## Configuration Files Reference

### Project Structure

```
.vscode/
├── settings.json          # Workspace settings
├── extensions.json        # Recommended extensions
└── SETTINGS_GUIDE.md      # This file

.eslintrc.js              # ESLint configuration
.prettierrc               # Prettier configuration
.editorconfig             # EditorConfig settings
tsconfig.json             # TypeScript configuration
```

### Settings Hierarchy

VSCode applies settings in this order (later overrides earlier):

1. **Default Settings** - VSCode built-in defaults
2. **User Settings** - Your global VSCode settings
3. **Workspace Settings** - `.vscode/settings.json` (this file)
4. **Folder Settings** - Multi-root workspace settings

---

## Best Practices

### 1. Keep Extensions Updated

Regularly update your extensions to get:
- Bug fixes
- New features
- Performance improvements
- Security patches

### 2. Review Settings Periodically

As your project evolves:
- Add new file exclusions
- Update linting rules
- Adjust performance settings
- Remove unused configurations

### 3. Share Configuration

Commit `.vscode/` folder to git so:
- Team uses same settings
- New developers get instant setup
- Consistent development environment
- Reduced onboarding time

### 4. Customize for Your Workflow

These settings are a starting point. Feel free to:
- Adjust auto-save delay
- Change ruler positions
- Enable/disable inlay hints
- Modify file nesting patterns

---

## Additional Resources

- [VSCode Settings Documentation](https://code.visualstudio.com/docs/getstarted/settings)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)
- [TypeScript Compiler Options](https://www.typescriptlang.org/tsconfig)
- [EditorConfig Properties](https://editorconfig.org/)

---

## Support

If you encounter issues or have questions:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review VSCode Output panel for errors
3. Consult extension documentation
4. Ask your team for help

---

**Last Updated:** 2025-10-02  
**VSCode Version:** 1.80+  
**Node Version:** 18+  
**TypeScript Version:** 5.9+

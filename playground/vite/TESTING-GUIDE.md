# Motion Svelte Playground Testing Guide

## Overview

The playground uses a modern router-based navigation system with a beautiful UI that makes testing all examples effortless.

## What Changed

### Before
- Had to manually comment/uncomment examples in `entry.svelte`
- Could only view one example at a time
- Easy to miss breaking changes in other examples
- No proper scrolling support

### After
- **Modern sidebar navigation** with all examples organized by category
- **URL-based routing** for easy bookmarking and sharing
- **All examples always loaded** - breaking changes are caught immediately
- **Collapsible sidebar** for more screen space
- **Proper scrolling** - critical for examples like "In View"
- **Tailwind CSS styling** - clean, modern design
- **Layout component** using router's nested route capabilities

## File Structure

```
src/vue-based/
├── entry.svelte           # Main router setup with nested routes
├── layout.svelte          # Layout wrapper with sidebar and main content
├── navigation.svelte      # Sidebar navigation component
├── home.svelte           # Home page
├── example-view.svelte   # Example viewer with proper scrolling
├── example-registry.ts   # Central registry of all examples
└── examples/             # All example components
```

## How to Use

1. **Navigate between examples**: Click any example in the sidebar
2. **Collapse sidebar**: Click the chevron button in the header for more screen space
3. **Scroll examples**: Each example has its own scrollable container
4. **Direct URL access**: Navigate to `/example/{example-id}` directly

## Adding New Examples

When you create a new example component:

1. Add the import in `example-registry.ts`:
   ```ts
   import MyNewExample from "./examples/my-new-example.svelte";
   ```

2. Add it to the `examples` array:
   ```ts
   { 
     id: "my-new-example", 
     name: "My New Example", 
     component: MyNewExample, 
     category: "Category Name" 
   }
   ```

That's it! The example will automatically appear in the sidebar.

## Categories

Current categories:
- **Animate Presence** - Enter/exit animations
- **Layout** - Layout animations and transitions
- **Variants** - Animation variants
- **From Docs** - Examples from documentation
- **Other** - Miscellaneous examples

## Benefits

- ✅ Test all examples without commenting/uncommenting code
- ✅ Catch breaking changes across all examples immediately
- ✅ Better organized and easier to navigate
- ✅ Shareable URLs for specific examples
- ✅ Cleaner codebase

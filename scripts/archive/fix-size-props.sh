#!/bin/bash

# Fix size constraint props by moving them to override

# Pattern 1: minHeight without override
# Before: minHeight={Size.n40}
# After: override={{ minHeight: Size.n40 }}
perl -i -pe 's/minHeight=\{([^}]+)\}(\s*)$/override={{ minHeight: $1 }}$2/g' src/apps/crm/drawer/*.tsx src/inspector/components/*.tsx

# Pattern 2: minHeight with existing override on same line
# Before: minHeight={Size.n40} override={{ px: Space.n16 }}
# After: override={{ px: Space.n16, minHeight: Size.n40 }}
perl -i -pe 's/minHeight=\{([^}]+)\}\s+override=\{\{\s*([^}]+)\s*\}\}/override={{ $2, minHeight: $1 }}/g' src/apps/crm/drawer/*.tsx src/inspector/components/*.tsx

# Pattern 3: maxWidth without override
perl -i -pe 's/maxWidth=\{([^}]+)\}(\s*)$/override={{ maxWidth: $1 }}$2/g' src/apps/crm/drawer/*.tsx src/inspector/components/*.tsx

# Pattern 4: maxWidth with existing override
perl -i -pe 's/maxWidth=\{([^}]+)\}\s+override=\{\{\s*([^}]+)\s*\}\}/override={{ $2, maxWidth: $1 }}/g' src/apps/crm/drawer/*.tsx src/inspector/components/*.tsx

# Pattern 5: maxHeight (if any)
perl -i -pe 's/maxHeight=\{([^}]+)\}(\s*)$/override={{ maxHeight: $1 }}$2/g' src/apps/crm/drawer/*.tsx src/inspector/components/*.tsx
perl -i -pe 's/maxHeight=\{([^}]+)\}\s+override=\{\{\s*([^}]+)\s*\}\}/override={{ $2, maxHeight: $1 }}/g' src/apps/crm/drawer/*.tsx src/inspector/components/*.tsx

# Pattern 6: minWidth (if any)
perl -i -pe 's/minWidth=\{([^}]+)\}(\s*)$/override={{ minWidth: $1 }}$2/g' src/apps/crm/drawer/*.tsx src/inspector/components/*.tsx
perl -i -pe 's/minWidth=\{([^}]+)\}\s+override=\{\{\s*([^}]+)\s*\}\}/override={{ $2, minWidth: $1 }}/g' src/apps/crm/drawer/*.tsx src/inspector/components/*.tsx

echo "✅ Size constraint props fixed"

# Code Quality

## TypeScript

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

## ESLint

```json
{
  "extends": ["eslint:recommended", "plugin:react/recommended"],
  "rules": {
    "no-unused-vars": "warn",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

## Prettier

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

## Import Order

```typescript
// 1. React
import { useState } from 'react';

// 2. External
import { useQuery } from '@tanstack/react-query';

// 3. Internal
import { PageHeader } from '@/components/shared/PageHeader';

// 4. Types
import type { Aluno } from '@/types';

// 5. Utils
import { cn } from '@/lib/utils';
```

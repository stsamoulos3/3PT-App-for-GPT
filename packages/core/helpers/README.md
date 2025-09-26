# Date Handling in the Health App

This document outlines the approach to handling dates in the Health App, particularly focusing on timezone issues.

## Core Principles

1. **Store in UTC**: All dates are stored in UTC format in the database.
2. **Convert to Local**: Dates are converted to the user's local timezone only for display purposes.

## Utility Functions

The `dateUtils.ts` file provides several utility functions to ensure consistent date handling:

- `toUTCForStorage(date)`: Converts a Date object or ISO string to UTC ISO string for storage
- `fromUTCToLocal(utcDate, format)`: Converts a UTC ISO string to local timezone for display
- `fromUTCToLocalDate(utcDate)`: Converts a UTC ISO string to local timezone Date object
- `getCurrentUTCDate()`: Gets the current date and time in UTC ISO format
- `getUTCDateRange(startDate, endDate)`: Creates a date range with UTC ISO strings

## Usage Guidelines

### When Sending Data to the Backend

Always use `toUTCForStorage()` to convert dates to UTC before sending to the backend:

```typescript
import { toUTCForStorage } from "@repo/core/helpers/dateUtils";

// When creating a new record
const data = {
  timestamp: toUTCForStorage(new Date()),
  // other fields...
};

// When updating a record
if (values.timestamp) {
  values.timestamp = toUTCForStorage(values.timestamp);
}
```

### When Displaying Dates to Users

Always use `fromUTCToLocal()` or `formatDate()` to convert UTC dates to the user's local timezone:

```typescript
import { fromUTCToLocal } from "@repo/core/helpers/dateUtils";
import { formatDate } from "@repo/core/helpers/dateFormatters";

// Using fromUTCToLocal directly
const displayDate = fromUTCToLocal(utcDateString, "LLL d, yyyy");

// Using formatDate (which uses fromUTCToLocal internally)
const displayDate = formatDate(utcDateString);
```

### In Forms and Date Pickers

When handling date inputs from users, ensure the date is converted to UTC before storing:

```typescript
<DatePicker
  onConfirm={(date) => {
    setShowDatePicker(false);
    onChange(toUTCForStorage(date));
  }}
/>
```

## Troubleshooting

If you encounter timezone issues:

1. Check that dates are being converted to UTC before storage
2. Verify that dates are being converted to local timezone for display
3. Ensure all service methods are using the utility functions consistently

# Spreadsheet

I... I don't know why I made this exactly. One day, I thought, "Would I be able to build spreadsheet software?" And then I did it.

You can find the application: https://spreadsheet.robinmalfait.com

## Features

### General

- You can write normal text in a cell
- You can write a number in a cell
   - This is actual text, but will be coerced to a number
- You can write a formula in a cell
   - Formulas are prefixed with `=`

Once you write a formula, you will get some syntax highlighting.

### Operators


**Mathematical Operators**

| Operator    | Description    |
|-------------|----------------|
| `+`         | Addition       |
| `-`         | Subtraction    |
| `*`         | Multiplication |
| `/`         | Division       |
| `^`         | Exponentiation |
| `(` and `)` | Parentheses    |

**Comparison Operators**

| Operator | Description           |
|----------|-----------------------|
| `==`     | Equal                 |
| `!=`     | Not equal             |
| `>`      | Greater than          |
| `<`      | Less than             |
| `>=`     | Greater than or equal |
| `<=`     | Less than or equal    |

### Functions

<!-- start:functions -->

## Date functions (13)

### 1. `ADD_DAYS(date: DATETIME, days: NUMBER)`

> Add days to a date

- `date`: The date to add days to
- `days`: The number of days to add

### 2. `ADD_HOURS(date: DATETIME, hours: NUMBER)`

> Add hours to a date

- `date`: The date to add hours to
- `hours`: The number of hours to add

### 3. `DAY(date: DATETIME)`

> The day of the month

- `date`: The date to extract the day from

### 4. `HOUR(date: DATETIME)`

> The hour

- `date`: The date to extract the hour from

### 5. `MINUTE(date: DATETIME)`

> The minute

- `date`: The date to extract the minute from

### 6. `MONTH(date: DATETIME)`

> The month of the year

- `date`: The date to extract the month from

### 7. `NOW()`

> The current date and time


### 8. `SECOND(date: DATETIME)`

> The second

- `date`: The date to extract the second from

### 9. `SUB_DAYS(date: DATETIME, days: NUMBER)`

> Subtract days from a date

- `date`: The date to subtract days from
- `days`: The number of days to subtract

### 10. `SUB_HOURS(date: DATETIME, hours: NUMBER)`

> Subtract hours from a date

- `date`: The date to subtract hours from
- `hours`: The number of hours to subtract

### 11. `TIME()`

> The current time


### 12. `TODAY()`

> The current date


### 13. `YEAR(date: DATETIME)`

> The year

- `date`: The date to extract the year from

## Logic functions (6)

### 1. `AND(...expressions: T)`

> Returns true if all conditions are true

- `expressions`: The conditions to evaluate

### 2. `FALSE()`

> The boolean value false


### 3. `IF(test: BOOLEAN, consequent: T, alternate: T)`

> Returns one value if a condition is true and another value if it is false

- `test`: The condition to evaluate
- `consequent`: The value to return if the condition is true
- `alternate`: The value to return if the condition is false

### 4. `NOT(value: BOOLEAN)`

> Returns true if the condition is false

- `value`: The condition to negate

### 5. `OR(...expressions: T)`

> Returns true if any condition is true

- `expressions`: The conditions to evaluate

### 6. `TRUE()`

> The boolean value true


## Math functions (35)

### 1. `ABS(x: NUMBER)`

> The ABS function

- `x`: A numeric expression

### 2. `ACOS(x: NUMBER)`

> The ACOS function

- `x`: A numeric expression

### 3. `ACOSH(x: NUMBER)`

> The ACOSH function

- `x`: A numeric expression

### 4. `ADD(lhs: NUMBER, rhs: NUMBER)`

> Add two numbers


### 5. `ASIN(x: NUMBER)`

> The ASIN function

- `x`: A numeric expression

### 6. `ASINH(x: NUMBER)`

> The ASINH function

- `x`: A numeric expression

### 7. `ATAN(x: NUMBER)`

> The ATAN function

- `x`: A numeric expression

### 8. `ATAN2(y: NUMBER, x: NUMBER)`

> The angle (in radians) from the X axis to a point.

- `y`: A numeric expression representing the cartesian y-coordinate.
- `x`: A numeric expression representing the cartesian x-coordinate.

### 9. `ATANH(x: NUMBER)`

> The ATANH function

- `x`: A numeric expression

### 10. `CBRT(x: NUMBER)`

> The CBRT function

- `x`: A numeric expression

### 11. `CEIL(value: NUMBER)`

> Ceil the number


### 12. `CLZ32(x: NUMBER)`

> The CLZ32 function

- `x`: A numeric expression

### 13. `COS(x: NUMBER)`

> The COS function

- `x`: A numeric expression

### 14. `COSH(x: NUMBER)`

> The COSH function

- `x`: A numeric expression

### 15. `DIVIDE(lhs: NUMBER, rhs: NUMBER)`

> Divide the lhs by the rhs


### 16. `EXP(x: NUMBER)`

> The EXP function

- `x`: A numeric expression

### 17. `FLOOR(value: NUMBER)`

> Floor the number


### 18. `IMUL(x: NUMBER, y: NUMBER)`

> The result of 32-bit multiplication of two numbers.

- `x`: First number
- `y`: Second number

### 19. `LOG(x: NUMBER)`

> The LOG function

- `x`: A numeric expression

### 20. `LOG10(x: NUMBER)`

> The LOG10 function

- `x`: A numeric expression

### 21. `MOD(lhs: NUMBER, rhs: NUMBER)`

> Mod the lhs by the rhs


### 22. `MULTIPLY(lhs: NUMBER, rhs: NUMBER)`

> Multiply two numbers


### 23. `PI()`

> The number π


### 24. `POWER(lhs: NUMBER, rhs: NUMBER)`

> Power the lhs by the rhs


### 25. `PRODUCT(...args: T)`

> Returns the product of all arguments


### 26. `ROUND(value: NUMBER, places?: NUMBER)`

> Round the number


### 27. `SIN(x: NUMBER)`

> The SIN function

- `x`: A numeric expression

### 28. `SINH(x: NUMBER)`

> The SINH function

- `x`: A numeric expression

### 29. `SQRT(x: NUMBER)`

> The SQRT function

- `x`: A numeric expression

### 30. `SUBTRACT(lhs: NUMBER, rhs: NUMBER)`

> Subtract two numbers


### 31. `SUM(...args: T)`

> Returns the sum of all arguments


### 32. `TAN(x: NUMBER)`

> The TAN function

- `x`: A numeric expression

### 33. `TANH(x: NUMBER)`

> The TANH function

- `x`: A numeric expression

### 34. `TAU()`

> The number τ


### 35. `TRUNC(x: NUMBER)`

> The TRUNC function

- `x`: A numeric expression

## Sequence functions (1)

### 1. `DIGITS()`

> A sequence of the digits from 0 through 9


## Statistical functions (6)

### 1. `AVERAGE(...values: T)`

> Returns the average of NUMBER arguments


### 2. `COUNT(...values: T)`

> Count the number of NUMBER arguments


### 3. `MAX(...values: T)`

> Returns the largest NUMBER argument


### 4. `MEDIAN(...values: T)`

> Returns the median of NUMBER arguments


### 5. `MIN(...values: T)`

> Returns the smallest NUMBER argument


### 6. `MODE(...values: T)`

> Returns the mode of NUMBER arguments


## Text functions (10)

### 1. `CONCAT(...args: T)`

> Concatenates multiple strings together


### 2. `FIND_FIRST(haystack: STRING, ...needles: STRING)`

> Returns the first needle found in the haystack


### 3. `FIND_LAST(haystack: STRING, ...needles: STRING)`

> Returns the last needle found in the haystack


### 4. `JOIN(delimiter: STRING, ...args: T)`

> Joins multiple strings together with a delimiter


### 5. `LEN(arg: STRING)`

> Returns the length of a string


### 6. `LOWER(arg: T)`

> Converts a string to lowercase


### 7. `REPLACE_ALL(haystack: STRING, ...zip?: STRING | NUMBER)`

> Replaces all occurrences of the needles with their replacements


### 8. `TEXT_SLICE(value: STRING, startIdx: NUMBER, endIdx?: NUMBER)`

> Returns a slice of the string from startIdx to endIdx


### 9. `TRIM(arg: STRING)`

> Removes leading and trailing whitespace from a string


### 10. `UPPER(arg: T)`

> Converts a string to uppercase


## Type functions (4)

### 1. `AS_BOOLEAN(value: T)`

> Converts a value to a boolean


### 2. `AS_NUMBER(value: T)`

> Converts a value to a number


### 3. `AS_STRING(value: T)`

> Converts a value to a string


### 4. `TYPE(value: T)`

> Returns the type of a value

<!-- end:functions -->


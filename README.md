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

## Date functions

### `ADD_DAYS(date: DATETIME, days: NUMBER)`

> Add days to a date

- `date`: The date to add days to
- `days`: The number of days to add

### `ADD_HOURS(date: DATETIME, hours: NUMBER)`

> Add hours to a date

- `date`: The date to add hours to
- `hours`: The number of hours to add

### `DAY(date: DATETIME)`

> The day of the month

- `date`: The date to extract the day from

### `HOUR(date: DATETIME)`

> The hour

- `date`: The date to extract the hour from

### `MINUTE(date: DATETIME)`

> The minute

- `date`: The date to extract the minute from

### `MONTH(date: DATETIME)`

> The month of the year

- `date`: The date to extract the month from

### `NOW()`

> The current date and time


### `SECOND(date: DATETIME)`

> The second

- `date`: The date to extract the second from

### `SUB_DAYS(date: DATETIME, days: NUMBER)`

> Subtract days from a date

- `date`: The date to subtract days from
- `days`: The number of days to subtract

### `SUB_HOURS(date: DATETIME, hours: NUMBER)`

> Subtract hours from a date

- `date`: The date to subtract hours from
- `hours`: The number of hours to subtract

### `TIME()`

> The current time


### `TODAY()`

> The current date


### `YEAR(date: DATETIME)`

> The year

- `date`: The date to extract the year from

## Logic functions

### `AND(...expressions: T)`

> Returns true if all conditions are true

- `expressions`: The conditions to evaluate

### `FALSE()`

> The boolean value false


### `IF(test: BOOLEAN, consequent: T, alternate: T)`

> Returns one value if a condition is true and another value if it is false

- `test`: The condition to evaluate
- `consequent`: The value to return if the condition is true
- `alternate`: The value to return if the condition is false

### `NOT(value: BOOLEAN)`

> Returns true if the condition is false

- `value`: The condition to negate

### `OR(...expressions: T)`

> Returns true if any condition is true

- `expressions`: The conditions to evaluate

### `TRUE()`

> The boolean value true


## Math functions

### `ABS(x: NUMBER)`

> The ABS function

- `x`: A numeric expression

### `ACOS(x: NUMBER)`

> The ACOS function

- `x`: A numeric expression

### `ACOSH(x: NUMBER)`

> The ACOSH function

- `x`: A numeric expression

### `ADD(lhs: NUMBER, rhs: NUMBER)`

> Add two numbers


### `ASIN(x: NUMBER)`

> The ASIN function

- `x`: A numeric expression

### `ASINH(x: NUMBER)`

> The ASINH function

- `x`: A numeric expression

### `ATAN(x: NUMBER)`

> The ATAN function

- `x`: A numeric expression

### `ATAN2(y: NUMBER, x: NUMBER)`

> The angle (in radians) from the X axis to a point.

- `y`: A numeric expression representing the cartesian y-coordinate.
- `x`: A numeric expression representing the cartesian x-coordinate.

### `ATANH(x: NUMBER)`

> The ATANH function

- `x`: A numeric expression

### `CBRT(x: NUMBER)`

> The CBRT function

- `x`: A numeric expression

### `CEIL(value: NUMBER)`

> Ceil the number


### `CLZ32(x: NUMBER)`

> The CLZ32 function

- `x`: A numeric expression

### `COS(x: NUMBER)`

> The COS function

- `x`: A numeric expression

### `COSH(x: NUMBER)`

> The COSH function

- `x`: A numeric expression

### `DIVIDE(lhs: NUMBER, rhs: NUMBER)`

> Divide the lhs by the rhs


### `EXP(x: NUMBER)`

> The EXP function

- `x`: A numeric expression

### `FLOOR(value: NUMBER)`

> Floor the number


### `IMUL(x: NUMBER, y: NUMBER)`

> The result of 32-bit multiplication of two numbers.

- `x`: First number
- `y`: Second number

### `LOG(x: NUMBER)`

> The LOG function

- `x`: A numeric expression

### `LOG10(x: NUMBER)`

> The LOG10 function

- `x`: A numeric expression

### `MOD(lhs: NUMBER, rhs: NUMBER)`

> Mod the lhs by the rhs


### `MULTIPLY(lhs: NUMBER, rhs: NUMBER)`

> Multiply two numbers


### `PI()`

> The number π


### `POWER(lhs: NUMBER, rhs: NUMBER)`

> Power the lhs by the rhs


### `PRODUCT(...args: T)`

> Returns the product of all arguments


### `ROUND(value: NUMBER, places?: NUMBER)`

> Round the number


### `SIN(x: NUMBER)`

> The SIN function

- `x`: A numeric expression

### `SINH(x: NUMBER)`

> The SINH function

- `x`: A numeric expression

### `SQRT(x: NUMBER)`

> The SQRT function

- `x`: A numeric expression

### `SUBTRACT(lhs: NUMBER, rhs: NUMBER)`

> Subtract two numbers


### `SUM(...args: T)`

> Returns the sum of all arguments


### `TAN(x: NUMBER)`

> The TAN function

- `x`: A numeric expression

### `TANH(x: NUMBER)`

> The TANH function

- `x`: A numeric expression

### `TAU()`

> The number τ


### `TRUNC(x: NUMBER)`

> The TRUNC function

- `x`: A numeric expression

## Sequence functions

### `DIGITS()`

> A sequence of the digits from 0 through 9


## Statistical functions

### `AVERAGE(...values: T)`

> Returns the average of NUMBER arguments


### `COUNT(...values: T)`

> Count the number of NUMBER arguments


### `MAX(...values: T)`

> Returns the largest NUMBER argument


### `MEDIAN(...values: T)`

> Returns the median of NUMBER arguments


### `MIN(...values: T)`

> Returns the smallest NUMBER argument


### `MODE(...values: T)`

> Returns the mode of NUMBER arguments


## Text functions

### `CONCAT(...args: T)`

> Concatenates multiple strings together


### `FIND_FIRST(haystack: STRING, ...needles: STRING)`

> Returns the first needle found in the haystack


### `FIND_LAST(haystack: STRING, ...needles: STRING)`

> Returns the last needle found in the haystack


### `JOIN(delimiter: STRING, ...args: T)`

> Joins multiple strings together with a delimiter


### `LEN(arg: STRING)`

> Returns the length of a string


### `LOWER(arg: T)`

> Converts a string to lowercase


### `REPLACE_ALL(haystack: STRING, ...zip?: STRING | NUMBER)`

> Replaces all occurrences of the needles with their replacements


### `TEXT_SLICE(value: STRING, startIdx: NUMBER, endIdx?: NUMBER)`

> Returns a slice of the string from startIdx to endIdx


### `TRIM(arg: STRING)`

> Removes leading and trailing whitespace from a string


### `UPPER(arg: T)`

> Converts a string to uppercase


## Type functions

### `AS_BOOLEAN(value: T)`

> Converts a value to a boolean


### `AS_NUMBER(value: T)`

> Converts a value to a number


### `AS_STRING(value: T)`

> Converts a value to a string


### `TYPE(value: T)`

> Returns the type of a value

<!-- end:functions -->


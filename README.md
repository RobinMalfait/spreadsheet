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

- [Date functions](#date-functions)
   - [`ADD_DAYS(date: DATETIME, days: NUMBER)`](#add_days)
   - [`ADD_HOURS(date: DATETIME, hours: NUMBER)`](#add_hours)
   - [`DAY(date: DATETIME)`](#day)
   - [`HOUR(date: DATETIME)`](#hour)
   - [`MINUTE(date: DATETIME)`](#minute)
   - [`MONTH(date: DATETIME)`](#month)
   - [`NOW()`](#now)
   - [`SECOND(date: DATETIME)`](#second)
   - [`SUB_DAYS(date: DATETIME, days: NUMBER)`](#sub_days)
   - [`SUB_HOURS(date: DATETIME, hours: NUMBER)`](#sub_hours)
   - [`TIME()`](#time)
   - [`TODAY()`](#today)
   - [`YEAR(date: DATETIME)`](#year)
- [Logic functions](#logic-functions)
   - [`AND(...expressions: T)`](#and)
   - [`FALSE()`](#false)
   - [`IF(test: BOOLEAN, consequent: T, alternate: T)`](#if)
   - [`NOT(value: BOOLEAN)`](#not)
   - [`OR(...expressions: T)`](#or)
   - [`TRUE()`](#true)
- [Math functions](#math-functions)
   - [`ABS(x: NUMBER)`](#abs)
   - [`ACOS(x: NUMBER)`](#acos)
   - [`ACOSH(x: NUMBER)`](#acosh)
   - [`ADD(lhs: NUMBER, rhs: NUMBER)`](#add)
   - [`ASIN(x: NUMBER)`](#asin)
   - [`ASINH(x: NUMBER)`](#asinh)
   - [`ATAN(x: NUMBER)`](#atan)
   - [`ATAN2(y: NUMBER, x: NUMBER)`](#atan2)
   - [`ATANH(x: NUMBER)`](#atanh)
   - [`CBRT(x: NUMBER)`](#cbrt)
   - [`CEIL(value: NUMBER)`](#ceil)
   - [`CLZ32(x: NUMBER)`](#clz32)
   - [`COS(x: NUMBER)`](#cos)
   - [`COSH(x: NUMBER)`](#cosh)
   - [`DIVIDE(lhs: NUMBER, rhs: NUMBER)`](#divide)
   - [`EXP(x: NUMBER)`](#exp)
   - [`FLOOR(value: NUMBER)`](#floor)
   - [`IMUL(x: NUMBER, y: NUMBER)`](#imul)
   - [`LOG(x: NUMBER)`](#log)
   - [`LOG10(x: NUMBER)`](#log10)
   - [`MOD(lhs: NUMBER, rhs: NUMBER)`](#mod)
   - [`MULTIPLY(lhs: NUMBER, rhs: NUMBER)`](#multiply)
   - [`PI()`](#pi)
   - [`POWER(lhs: NUMBER, rhs: NUMBER)`](#power)
   - [`PRODUCT(...args: T)`](#product)
   - [`ROUND(value: NUMBER, places?: NUMBER)`](#round)
   - [`SIN(x: NUMBER)`](#sin)
   - [`SINH(x: NUMBER)`](#sinh)
   - [`SQRT(x: NUMBER)`](#sqrt)
   - [`SUBTRACT(lhs: NUMBER, rhs: NUMBER)`](#subtract)
   - [`SUM(...args: T)`](#sum)
   - [`TAN(x: NUMBER)`](#tan)
   - [`TANH(x: NUMBER)`](#tanh)
   - [`TAU()`](#tau)
   - [`TRUNC(x: NUMBER)`](#trunc)
- [Sequence functions](#sequence-functions)
   - [`DIGITS()`](#digits)
- [Statistical functions](#statistical-functions)
   - [`AVERAGE(...values: T)`](#average)
   - [`COUNT(...values: T)`](#count)
   - [`MAX(...values: T)`](#max)
   - [`MEDIAN(...values: T)`](#median)
   - [`MIN(...values: T)`](#min)
   - [`MODE(...values: T)`](#mode)
- [Text functions](#text-functions)
   - [`CONCAT(...args: T)`](#concat)
   - [`FIND_FIRST(haystack: STRING, ...needles: STRING)`](#find_first)
   - [`FIND_LAST(haystack: STRING, ...needles: STRING)`](#find_last)
   - [`JOIN(delimiter: STRING, ...args: T)`](#join)
   - [`LEN(arg: STRING)`](#len)
   - [`LOWER(arg: T)`](#lower)
   - [`REPLACE_ALL(haystack: STRING, ...zip?: STRING | NUMBER)`](#replace_all)
   - [`TEXT_SLICE(value: STRING, startIdx: NUMBER, endIdx?: NUMBER)`](#text_slice)
   - [`TRIM(arg: STRING)`](#trim)
   - [`UPPER(arg: T)`](#upper)
- [Type functions](#type-functions)
   - [`AS_BOOLEAN(value: T)`](#as_boolean)
   - [`AS_NUMBER(value: T)`](#as_number)
   - [`AS_STRING(value: T)`](#as_string)
   - [`TYPE(value: T)`](#type)

### Date functions (13)

<a name="add_days"></a>
#### 1. `ADD_DAYS(date: DATETIME, days: NUMBER)`

[Back to top](#functions)

Add days to a date

- `date`: The date to add days to
- `days`: The number of days to add

---

<a name="add_hours"></a>
#### 2. `ADD_HOURS(date: DATETIME, hours: NUMBER)`

[Back to top](#functions)

Add hours to a date

- `date`: The date to add hours to
- `hours`: The number of hours to add

---

<a name="day"></a>
#### 3. `DAY(date: DATETIME)`

[Back to top](#functions)

The day of the month

- `date`: The date to extract the day from

---

<a name="hour"></a>
#### 4. `HOUR(date: DATETIME)`

[Back to top](#functions)

The hour

- `date`: The date to extract the hour from

---

<a name="minute"></a>
#### 5. `MINUTE(date: DATETIME)`

[Back to top](#functions)

The minute

- `date`: The date to extract the minute from

---

<a name="month"></a>
#### 6. `MONTH(date: DATETIME)`

[Back to top](#functions)

The month of the year

- `date`: The date to extract the month from

---

<a name="now"></a>
#### 7. `NOW()`

[Back to top](#functions)

The current date and time

---

<a name="second"></a>
#### 8. `SECOND(date: DATETIME)`

[Back to top](#functions)

The second

- `date`: The date to extract the second from

---

<a name="sub_days"></a>
#### 9. `SUB_DAYS(date: DATETIME, days: NUMBER)`

[Back to top](#functions)

Subtract days from a date

- `date`: The date to subtract days from
- `days`: The number of days to subtract

---

<a name="sub_hours"></a>
#### 10. `SUB_HOURS(date: DATETIME, hours: NUMBER)`

[Back to top](#functions)

Subtract hours from a date

- `date`: The date to subtract hours from
- `hours`: The number of hours to subtract

---

<a name="time"></a>
#### 11. `TIME()`

[Back to top](#functions)

The current time

---

<a name="today"></a>
#### 12. `TODAY()`

[Back to top](#functions)

The current date

---

<a name="year"></a>
#### 13. `YEAR(date: DATETIME)`

[Back to top](#functions)

The year

- `date`: The date to extract the year from

### Logic functions (6)

<a name="and"></a>
#### 1. `AND(...expressions: T)`

[Back to top](#functions)

Returns true if all conditions are true

- `expressions`: The conditions to evaluate

---

<a name="false"></a>
#### 2. `FALSE()`

[Back to top](#functions)

The boolean value false

---

<a name="if"></a>
#### 3. `IF(test: BOOLEAN, consequent: T, alternate: T)`

[Back to top](#functions)

Returns one value if a condition is true and another value if it is false

- `test`: The condition to evaluate
- `consequent`: The value to return if the condition is true
- `alternate`: The value to return if the condition is false

---

<a name="not"></a>
#### 4. `NOT(value: BOOLEAN)`

[Back to top](#functions)

Returns true if the condition is false

- `value`: The condition to negate

---

<a name="or"></a>
#### 5. `OR(...expressions: T)`

[Back to top](#functions)

Returns true if any condition is true

- `expressions`: The conditions to evaluate

---

<a name="true"></a>
#### 6. `TRUE()`

[Back to top](#functions)

The boolean value true

### Math functions (35)

<a name="abs"></a>
#### 1. `ABS(x: NUMBER)`

[Back to top](#functions)

The ABS function

- `x`: A numeric expression

---

<a name="acos"></a>
#### 2. `ACOS(x: NUMBER)`

[Back to top](#functions)

The ACOS function

- `x`: A numeric expression

---

<a name="acosh"></a>
#### 3. `ACOSH(x: NUMBER)`

[Back to top](#functions)

The ACOSH function

- `x`: A numeric expression

---

<a name="add"></a>
#### 4. `ADD(lhs: NUMBER, rhs: NUMBER)`

[Back to top](#functions)

Add two numbers

---

<a name="asin"></a>
#### 5. `ASIN(x: NUMBER)`

[Back to top](#functions)

The ASIN function

- `x`: A numeric expression

---

<a name="asinh"></a>
#### 6. `ASINH(x: NUMBER)`

[Back to top](#functions)

The ASINH function

- `x`: A numeric expression

---

<a name="atan"></a>
#### 7. `ATAN(x: NUMBER)`

[Back to top](#functions)

The ATAN function

- `x`: A numeric expression

---

<a name="atan2"></a>
#### 8. `ATAN2(y: NUMBER, x: NUMBER)`

[Back to top](#functions)

The angle (in radians) from the X axis to a point.

- `y`: A numeric expression representing the cartesian y-coordinate.
- `x`: A numeric expression representing the cartesian x-coordinate.

---

<a name="atanh"></a>
#### 9. `ATANH(x: NUMBER)`

[Back to top](#functions)

The ATANH function

- `x`: A numeric expression

---

<a name="cbrt"></a>
#### 10. `CBRT(x: NUMBER)`

[Back to top](#functions)

The CBRT function

- `x`: A numeric expression

---

<a name="ceil"></a>
#### 11. `CEIL(value: NUMBER)`

[Back to top](#functions)

Ceil the number

---

<a name="clz32"></a>
#### 12. `CLZ32(x: NUMBER)`

[Back to top](#functions)

The CLZ32 function

- `x`: A numeric expression

---

<a name="cos"></a>
#### 13. `COS(x: NUMBER)`

[Back to top](#functions)

The COS function

- `x`: A numeric expression

---

<a name="cosh"></a>
#### 14. `COSH(x: NUMBER)`

[Back to top](#functions)

The COSH function

- `x`: A numeric expression

---

<a name="divide"></a>
#### 15. `DIVIDE(lhs: NUMBER, rhs: NUMBER)`

[Back to top](#functions)

Divide the lhs by the rhs

---

<a name="exp"></a>
#### 16. `EXP(x: NUMBER)`

[Back to top](#functions)

The EXP function

- `x`: A numeric expression

---

<a name="floor"></a>
#### 17. `FLOOR(value: NUMBER)`

[Back to top](#functions)

Floor the number

---

<a name="imul"></a>
#### 18. `IMUL(x: NUMBER, y: NUMBER)`

[Back to top](#functions)

The result of 32-bit multiplication of two numbers.

- `x`: First number
- `y`: Second number

---

<a name="log"></a>
#### 19. `LOG(x: NUMBER)`

[Back to top](#functions)

The LOG function

- `x`: A numeric expression

---

<a name="log10"></a>
#### 20. `LOG10(x: NUMBER)`

[Back to top](#functions)

The LOG10 function

- `x`: A numeric expression

---

<a name="mod"></a>
#### 21. `MOD(lhs: NUMBER, rhs: NUMBER)`

[Back to top](#functions)

Mod the lhs by the rhs

---

<a name="multiply"></a>
#### 22. `MULTIPLY(lhs: NUMBER, rhs: NUMBER)`

[Back to top](#functions)

Multiply two numbers

---

<a name="pi"></a>
#### 23. `PI()`

[Back to top](#functions)

The number π

---

<a name="power"></a>
#### 24. `POWER(lhs: NUMBER, rhs: NUMBER)`

[Back to top](#functions)

Power the lhs by the rhs

---

<a name="product"></a>
#### 25. `PRODUCT(...args: T)`

[Back to top](#functions)

Returns the product of all arguments

---

<a name="round"></a>
#### 26. `ROUND(value: NUMBER, places?: NUMBER)`

[Back to top](#functions)

Round the number

---

<a name="sin"></a>
#### 27. `SIN(x: NUMBER)`

[Back to top](#functions)

The SIN function

- `x`: A numeric expression

---

<a name="sinh"></a>
#### 28. `SINH(x: NUMBER)`

[Back to top](#functions)

The SINH function

- `x`: A numeric expression

---

<a name="sqrt"></a>
#### 29. `SQRT(x: NUMBER)`

[Back to top](#functions)

The SQRT function

- `x`: A numeric expression

---

<a name="subtract"></a>
#### 30. `SUBTRACT(lhs: NUMBER, rhs: NUMBER)`

[Back to top](#functions)

Subtract two numbers

---

<a name="sum"></a>
#### 31. `SUM(...args: T)`

[Back to top](#functions)

Returns the sum of all arguments

---

<a name="tan"></a>
#### 32. `TAN(x: NUMBER)`

[Back to top](#functions)

The TAN function

- `x`: A numeric expression

---

<a name="tanh"></a>
#### 33. `TANH(x: NUMBER)`

[Back to top](#functions)

The TANH function

- `x`: A numeric expression

---

<a name="tau"></a>
#### 34. `TAU()`

[Back to top](#functions)

The number τ

---

<a name="trunc"></a>
#### 35. `TRUNC(x: NUMBER)`

[Back to top](#functions)

The TRUNC function

- `x`: A numeric expression

### Sequence functions (1)

<a name="digits"></a>
#### 1. `DIGITS()`

[Back to top](#functions)

A sequence of the digits from 0 through 9

### Statistical functions (6)

<a name="average"></a>
#### 1. `AVERAGE(...values: T)`

[Back to top](#functions)

Returns the average of NUMBER arguments

---

<a name="count"></a>
#### 2. `COUNT(...values: T)`

[Back to top](#functions)

Count the number of NUMBER arguments

---

<a name="max"></a>
#### 3. `MAX(...values: T)`

[Back to top](#functions)

Returns the largest NUMBER argument

---

<a name="median"></a>
#### 4. `MEDIAN(...values: T)`

[Back to top](#functions)

Returns the median of NUMBER arguments

---

<a name="min"></a>
#### 5. `MIN(...values: T)`

[Back to top](#functions)

Returns the smallest NUMBER argument

---

<a name="mode"></a>
#### 6. `MODE(...values: T)`

[Back to top](#functions)

Returns the mode of NUMBER arguments

### Text functions (10)

<a name="concat"></a>
#### 1. `CONCAT(...args: T)`

[Back to top](#functions)

Concatenates multiple strings together

---

<a name="find_first"></a>
#### 2. `FIND_FIRST(haystack: STRING, ...needles: STRING)`

[Back to top](#functions)

Returns the first needle found in the haystack

---

<a name="find_last"></a>
#### 3. `FIND_LAST(haystack: STRING, ...needles: STRING)`

[Back to top](#functions)

Returns the last needle found in the haystack

---

<a name="join"></a>
#### 4. `JOIN(delimiter: STRING, ...args: T)`

[Back to top](#functions)

Joins multiple strings together with a delimiter

---

<a name="len"></a>
#### 5. `LEN(arg: STRING)`

[Back to top](#functions)

Returns the length of a string

---

<a name="lower"></a>
#### 6. `LOWER(arg: T)`

[Back to top](#functions)

Converts a string to lowercase

---

<a name="replace_all"></a>
#### 7. `REPLACE_ALL(haystack: STRING, ...zip?: STRING | NUMBER)`

[Back to top](#functions)

Replaces all occurrences of the needles with their replacements

---

<a name="text_slice"></a>
#### 8. `TEXT_SLICE(value: STRING, startIdx: NUMBER, endIdx?: NUMBER)`

[Back to top](#functions)

Returns a slice of the string from startIdx to endIdx

---

<a name="trim"></a>
#### 9. `TRIM(arg: STRING)`

[Back to top](#functions)

Removes leading and trailing whitespace from a string

---

<a name="upper"></a>
#### 10. `UPPER(arg: T)`

[Back to top](#functions)

Converts a string to uppercase

### Type functions (4)

<a name="as_boolean"></a>
#### 1. `AS_BOOLEAN(value: T)`

[Back to top](#functions)

Converts a value to a boolean

---

<a name="as_number"></a>
#### 2. `AS_NUMBER(value: T)`

[Back to top](#functions)

Converts a value to a number

---

<a name="as_string"></a>
#### 3. `AS_STRING(value: T)`

[Back to top](#functions)

Converts a value to a string

---

<a name="type"></a>
#### 4. `TYPE(value: T)`

[Back to top](#functions)

Returns the type of a value

<!-- end:functions -->


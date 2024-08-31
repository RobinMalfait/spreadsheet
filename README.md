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
   - [ADD_DAYS(date: DATETIME, days: NUMBER)](#add_days)
   - [ADD_HOURS(date: DATETIME, hours: NUMBER)](#add_hours)
   - [DAY(date: DATETIME)](#day)
   - [HOUR(date: DATETIME)](#hour)
   - [MINUTE(date: DATETIME)](#minute)
   - [MONTH(date: DATETIME)](#month)
   - [NOW()](#now)
   - [SECOND(date: DATETIME)](#second)
   - [SUB_DAYS(date: DATETIME, days: NUMBER)](#sub_days)
   - [SUB_HOURS(date: DATETIME, hours: NUMBER)](#sub_hours)
   - [TIME()](#time)
   - [TODAY()](#today)
   - [YEAR(date: DATETIME)](#year)
- [Logic functions](#logic-functions)
   - [AND(...expressions: T)](#and)
   - [FALSE()](#false)
   - [IF(test: BOOLEAN, consequent: T, alternate: T)](#if)
   - [NOT(value: BOOLEAN)](#not)
   - [OR(...expressions: T)](#or)
   - [TRUE()](#true)
- [Math functions](#math-functions)
   - [ABS(x: NUMBER)](#abs)
   - [ACOS(x: NUMBER)](#acos)
   - [ACOSH(x: NUMBER)](#acosh)
   - [ADD(lhs: NUMBER, rhs: NUMBER)](#add)
   - [ASIN(x: NUMBER)](#asin)
   - [ASINH(x: NUMBER)](#asinh)
   - [ATAN(x: NUMBER)](#atan)
   - [ATAN2(y: NUMBER, x: NUMBER)](#atan2)
   - [ATANH(x: NUMBER)](#atanh)
   - [CBRT(x: NUMBER)](#cbrt)
   - [CEIL(value: NUMBER)](#ceil)
   - [CLZ32(x: NUMBER)](#clz32)
   - [COS(x: NUMBER)](#cos)
   - [COSH(x: NUMBER)](#cosh)
   - [DIVIDE(lhs: NUMBER, rhs: NUMBER)](#divide)
   - [EXP(x: NUMBER)](#exp)
   - [FLOOR(value: NUMBER)](#floor)
   - [IMUL(x: NUMBER, y: NUMBER)](#imul)
   - [LOG(x: NUMBER)](#log)
   - [LOG10(x: NUMBER)](#log10)
   - [MOD(lhs: NUMBER, rhs: NUMBER)](#mod)
   - [MULTIPLY(lhs: NUMBER, rhs: NUMBER)](#multiply)
   - [PI()](#pi)
   - [POWER(lhs: NUMBER, rhs: NUMBER)](#power)
   - [PRODUCT(...args: T)](#product)
   - [ROUND(value: NUMBER, places?: NUMBER)](#round)
   - [SIN(x: NUMBER)](#sin)
   - [SINH(x: NUMBER)](#sinh)
   - [SQRT(x: NUMBER)](#sqrt)
   - [SUBTRACT(lhs: NUMBER, rhs: NUMBER)](#subtract)
   - [SUM(...args: T)](#sum)
   - [TAN(x: NUMBER)](#tan)
   - [TANH(x: NUMBER)](#tanh)
   - [TAU()](#tau)
   - [TRUNC(x: NUMBER)](#trunc)
- [Sequence functions](#sequence-functions)
   - [DIGITS()](#digits)
- [Statistical functions](#statistical-functions)
   - [AVERAGE(...values: T)](#average)
   - [COUNT(...values: T)](#count)
   - [MAX(...values: T)](#max)
   - [MEDIAN(...values: T)](#median)
   - [MIN(...values: T)](#min)
   - [MODE(...values: T)](#mode)
- [Text functions](#text-functions)
   - [CONCAT(...args: T)](#concat)
   - [FIND_FIRST(haystack: STRING, ...needles: STRING)](#find_first)
   - [FIND_LAST(haystack: STRING, ...needles: STRING)](#find_last)
   - [JOIN(delimiter: STRING, ...args: T)](#join)
   - [LEN(arg: STRING)](#len)
   - [LOWER(arg: T)](#lower)
   - [REPLACE_ALL(haystack: STRING, ...zip?: STRING | NUMBER)](#replace_all)
   - [TEXT_SLICE(value: STRING, startIdx: NUMBER, endIdx?: NUMBER)](#text_slice)
   - [TRIM(arg: STRING)](#trim)
   - [UPPER(arg: T)](#upper)
- [Type functions](#type-functions)
   - [AS_BOOLEAN(value: T)](#as_boolean)
   - [AS_NUMBER(value: T)](#as_number)
   - [AS_STRING(value: T)](#as_string)
   - [TYPE(value: T)](#type)

### Date functions (13)

<a name="add_days"></a>
#### ADD_DAYS(date: DATETIME, days: NUMBER)

[Back to top](#functions)

Add days to a date.

- `date`: The date to add days to.
- `days`: The number of days to add.

```ts
=ADD_DAYS(TODAY(), 7)
// 2013-01-28
```

---

<a name="add_hours"></a>
#### ADD_HOURS(date: DATETIME, hours: NUMBER)

[Back to top](#functions)

Add hours to a date.

- `date`: The date to add hours to.
- `hours`: The number of hours to add.

```ts
=ADD_HOURS(NOW(), 8)
// 2013-01-21 16:15:20
```

---

<a name="day"></a>
#### DAY(date: DATETIME)

[Back to top](#functions)

The day of the month from the given date.

- `date`: The date to extract the current day from.

```ts
=DAY(TODAY())
// 21
```

---

<a name="hour"></a>
#### HOUR(date: DATETIME)

[Back to top](#functions)

The hour of the day from the given date.

- `date`: The date to extract the current hour from.

```ts
=HOUR(NOW())
// 8
```

---

<a name="minute"></a>
#### MINUTE(date: DATETIME)

[Back to top](#functions)

The minute of the day from the given date.

- `date`: The date to extract the current minute from.

```ts
=MINUTE(NOW())
// 15
```

---

<a name="month"></a>
#### MONTH(date: DATETIME)

[Back to top](#functions)

The month of the year from the given date.

- `date`: The date to extract the current month from.

```ts
=MONTH(TODAY())
// 1
```

---

<a name="now"></a>
#### NOW()

[Back to top](#functions)

The current date and time represented as a datetime.

```ts
=NOW()
// 2013-01-21 08:15:20
```

---

<a name="second"></a>
#### SECOND(date: DATETIME)

[Back to top](#functions)

The second of the minute from the given date.

- `date`: The date to extract the current seconds from.

```ts
=SECOND(NOW())
// 20
```

---

<a name="sub_days"></a>
#### SUB_DAYS(date: DATETIME, days: NUMBER)

[Back to top](#functions)

Subtract days from a date.

- `date`: The date to subtract days from.
- `days`: The number of days to subtract.

```ts
=SUB_DAYS(TODAY(), 7)
// 2013-01-14
```

---

<a name="sub_hours"></a>
#### SUB_HOURS(date: DATETIME, hours: NUMBER)

[Back to top](#functions)

Subtract hours from a date.

- `date`: The date to subtract hours from.
- `hours`: The number of hours to subtract.

```ts
=SUB_HOURS(NOW(), 8)
// 2013-01-21 00:15:20
```

---

<a name="time"></a>
#### TIME()

[Back to top](#functions)

The current time represented as a datetime.

```ts
=TIME()
// 08:15:20
```

---

<a name="today"></a>
#### TODAY()

[Back to top](#functions)

The current date represented as a datetime.

```ts
=TODAY()
// 2013-01-21
```

---

<a name="year"></a>
#### YEAR(date: DATETIME)

[Back to top](#functions)

The year from the given date.

- `date`: The date to extract the current year from.

```ts
=YEAR(TODAY())
// 2013
```

### Logic functions (6)

<a name="and"></a>
#### AND(...expressions: T)

[Back to top](#functions)

Returns true if all conditions are true

- `expressions`: The conditions to evaluate

---

<a name="false"></a>
#### FALSE()

[Back to top](#functions)

The boolean value false

---

<a name="if"></a>
#### IF(test: BOOLEAN, consequent: T, alternate: T)

[Back to top](#functions)

Returns one value if a condition is true and another value if it is false

- `test`: The condition to evaluate
- `consequent`: The value to return if the condition is true
- `alternate`: The value to return if the condition is false

---

<a name="not"></a>
#### NOT(value: BOOLEAN)

[Back to top](#functions)

Returns true if the condition is false

- `value`: The condition to negate

---

<a name="or"></a>
#### OR(...expressions: T)

[Back to top](#functions)

Returns true if any condition is true

- `expressions`: The conditions to evaluate

---

<a name="true"></a>
#### TRUE()

[Back to top](#functions)

The boolean value true

### Math functions (35)

<a name="abs"></a>
#### ABS(x: NUMBER)

[Back to top](#functions)

The ABS function

- `x`: A numeric expression

---

<a name="acos"></a>
#### ACOS(x: NUMBER)

[Back to top](#functions)

The ACOS function

- `x`: A numeric expression

---

<a name="acosh"></a>
#### ACOSH(x: NUMBER)

[Back to top](#functions)

The ACOSH function

- `x`: A numeric expression

---

<a name="add"></a>
#### ADD(lhs: NUMBER, rhs: NUMBER)

[Back to top](#functions)

Add two numbers

---

<a name="asin"></a>
#### ASIN(x: NUMBER)

[Back to top](#functions)

The ASIN function

- `x`: A numeric expression

---

<a name="asinh"></a>
#### ASINH(x: NUMBER)

[Back to top](#functions)

The ASINH function

- `x`: A numeric expression

---

<a name="atan"></a>
#### ATAN(x: NUMBER)

[Back to top](#functions)

The ATAN function

- `x`: A numeric expression

---

<a name="atan2"></a>
#### ATAN2(y: NUMBER, x: NUMBER)

[Back to top](#functions)

The angle (in radians) from the X axis to a point.

- `y`: A numeric expression representing the cartesian y-coordinate.
- `x`: A numeric expression representing the cartesian x-coordinate.

---

<a name="atanh"></a>
#### ATANH(x: NUMBER)

[Back to top](#functions)

The ATANH function

- `x`: A numeric expression

---

<a name="cbrt"></a>
#### CBRT(x: NUMBER)

[Back to top](#functions)

The CBRT function

- `x`: A numeric expression

---

<a name="ceil"></a>
#### CEIL(value: NUMBER)

[Back to top](#functions)

Ceil the number

---

<a name="clz32"></a>
#### CLZ32(x: NUMBER)

[Back to top](#functions)

The CLZ32 function

- `x`: A numeric expression

---

<a name="cos"></a>
#### COS(x: NUMBER)

[Back to top](#functions)

The COS function

- `x`: A numeric expression

---

<a name="cosh"></a>
#### COSH(x: NUMBER)

[Back to top](#functions)

The COSH function

- `x`: A numeric expression

---

<a name="divide"></a>
#### DIVIDE(lhs: NUMBER, rhs: NUMBER)

[Back to top](#functions)

Divide the lhs by the rhs

---

<a name="exp"></a>
#### EXP(x: NUMBER)

[Back to top](#functions)

The EXP function

- `x`: A numeric expression

---

<a name="floor"></a>
#### FLOOR(value: NUMBER)

[Back to top](#functions)

Floor the number

---

<a name="imul"></a>
#### IMUL(x: NUMBER, y: NUMBER)

[Back to top](#functions)

The result of 32-bit multiplication of two numbers.

- `x`: First number
- `y`: Second number

---

<a name="log"></a>
#### LOG(x: NUMBER)

[Back to top](#functions)

The LOG function

- `x`: A numeric expression

---

<a name="log10"></a>
#### LOG10(x: NUMBER)

[Back to top](#functions)

The LOG10 function

- `x`: A numeric expression

---

<a name="mod"></a>
#### MOD(lhs: NUMBER, rhs: NUMBER)

[Back to top](#functions)

Mod the lhs by the rhs

---

<a name="multiply"></a>
#### MULTIPLY(lhs: NUMBER, rhs: NUMBER)

[Back to top](#functions)

Multiply two numbers

---

<a name="pi"></a>
#### PI()

[Back to top](#functions)

The number π

---

<a name="power"></a>
#### POWER(lhs: NUMBER, rhs: NUMBER)

[Back to top](#functions)

Power the lhs by the rhs

---

<a name="product"></a>
#### PRODUCT(...args: T)

[Back to top](#functions)

Returns the product of all arguments

---

<a name="round"></a>
#### ROUND(value: NUMBER, places?: NUMBER)

[Back to top](#functions)

Round the number

---

<a name="sin"></a>
#### SIN(x: NUMBER)

[Back to top](#functions)

The SIN function

- `x`: A numeric expression

---

<a name="sinh"></a>
#### SINH(x: NUMBER)

[Back to top](#functions)

The SINH function

- `x`: A numeric expression

---

<a name="sqrt"></a>
#### SQRT(x: NUMBER)

[Back to top](#functions)

The SQRT function

- `x`: A numeric expression

---

<a name="subtract"></a>
#### SUBTRACT(lhs: NUMBER, rhs: NUMBER)

[Back to top](#functions)

Subtract two numbers

---

<a name="sum"></a>
#### SUM(...args: T)

[Back to top](#functions)

Returns the sum of all arguments

---

<a name="tan"></a>
#### TAN(x: NUMBER)

[Back to top](#functions)

The TAN function

- `x`: A numeric expression

---

<a name="tanh"></a>
#### TANH(x: NUMBER)

[Back to top](#functions)

The TANH function

- `x`: A numeric expression

---

<a name="tau"></a>
#### TAU()

[Back to top](#functions)

The number τ

---

<a name="trunc"></a>
#### TRUNC(x: NUMBER)

[Back to top](#functions)

The TRUNC function

- `x`: A numeric expression

### Sequence functions (1)

<a name="digits"></a>
#### DIGITS()

[Back to top](#functions)

A sequence of the digits from 0 through 9

### Statistical functions (6)

<a name="average"></a>
#### AVERAGE(...values: T)

[Back to top](#functions)

Returns the average of NUMBER arguments

---

<a name="count"></a>
#### COUNT(...values: T)

[Back to top](#functions)

Count the number of NUMBER arguments

---

<a name="max"></a>
#### MAX(...values: T)

[Back to top](#functions)

Returns the largest NUMBER argument

---

<a name="median"></a>
#### MEDIAN(...values: T)

[Back to top](#functions)

Returns the median of NUMBER arguments

---

<a name="min"></a>
#### MIN(...values: T)

[Back to top](#functions)

Returns the smallest NUMBER argument

---

<a name="mode"></a>
#### MODE(...values: T)

[Back to top](#functions)

Returns the mode of NUMBER arguments

### Text functions (10)

<a name="concat"></a>
#### CONCAT(...args: T)

[Back to top](#functions)

Concatenates multiple strings together

---

<a name="find_first"></a>
#### FIND_FIRST(haystack: STRING, ...needles: STRING)

[Back to top](#functions)

Returns the first needle found in the haystack

---

<a name="find_last"></a>
#### FIND_LAST(haystack: STRING, ...needles: STRING)

[Back to top](#functions)

Returns the last needle found in the haystack

---

<a name="join"></a>
#### JOIN(delimiter: STRING, ...args: T)

[Back to top](#functions)

Joins multiple strings together with a delimiter

---

<a name="len"></a>
#### LEN(arg: STRING)

[Back to top](#functions)

Returns the length of a string

---

<a name="lower"></a>
#### LOWER(arg: T)

[Back to top](#functions)

Converts a string to lowercase

---

<a name="replace_all"></a>
#### REPLACE_ALL(haystack: STRING, ...zip?: STRING | NUMBER)

[Back to top](#functions)

Replaces all occurrences of the needles with their replacements

---

<a name="text_slice"></a>
#### TEXT_SLICE(value: STRING, startIdx: NUMBER, endIdx?: NUMBER)

[Back to top](#functions)

Returns a slice of the string from startIdx to endIdx

---

<a name="trim"></a>
#### TRIM(arg: STRING)

[Back to top](#functions)

Removes leading and trailing whitespace from a string

---

<a name="upper"></a>
#### UPPER(arg: T)

[Back to top](#functions)

Converts a string to uppercase

### Type functions (4)

<a name="as_boolean"></a>
#### AS_BOOLEAN(value: T)

[Back to top](#functions)

Converts a value to a boolean

---

<a name="as_number"></a>
#### AS_NUMBER(value: T)

[Back to top](#functions)

Converts a value to a number

---

<a name="as_string"></a>
#### AS_STRING(value: T)

[Back to top](#functions)

Converts a value to a string

---

<a name="type"></a>
#### TYPE(value: T)

[Back to top](#functions)

Returns the type of a value

<!-- end:functions -->


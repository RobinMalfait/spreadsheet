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

There are **96** built-in functions available.

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
   - [IF_ERROR(value: T, fallback: T)](#if_error)
   - [NOT(value: BOOLEAN)](#not)
   - [OR(...expressions: T)](#or)
   - [SWITCH(value: T, ...cases: T, default?: T)](#switch)
   - [TRUE()](#true)
- [Lookup functions](#lookup-functions)
   - [LOOKUP(value: T, lhs: T, rhs: T, fallback?: T)](#lookup)
- [Math functions](#math-functions)
   - [ABS(x: NUMBER)](#abs)
   - [ACOS(x: NUMBER)](#acos)
   - [ACOSH(x: NUMBER)](#acosh)
   - [ADD(x: NUMBER, y: NUMBER)](#add)
   - [ASIN(x: NUMBER)](#asin)
   - [ASINH(x: NUMBER)](#asinh)
   - [ATAN(x: NUMBER)](#atan)
   - [ATAN2(y: NUMBER, x: NUMBER)](#atan2)
   - [ATANH(x: NUMBER)](#atanh)
   - [CBRT(x: NUMBER)](#cbrt)
   - [CEIL(x: NUMBER)](#ceil)
   - [CLZ32(x: NUMBER)](#clz32)
   - [COS(x: NUMBER)](#cos)
   - [COSH(x: NUMBER)](#cosh)
   - [DIVIDE(x: NUMBER, y: NUMBER)](#divide)
   - [EXP(x: NUMBER)](#exp)
   - [FLOOR(x: NUMBER)](#floor)
   - [IMUL(x: NUMBER, y: NUMBER)](#imul)
   - [LOG(x: NUMBER)](#log)
   - [LOG10(x: NUMBER)](#log10)
   - [MOD(x: NUMBER, y: NUMBER)](#mod)
   - [MULTIPLY(x: NUMBER, y: NUMBER)](#multiply)
   - [PI()](#pi)
   - [POWER(x: NUMBER, y: NUMBER)](#power)
   - [PRODUCT(...values: T)](#product)
   - [ROUND(x: NUMBER, places?: NUMBER)](#round)
   - [SIN(x: NUMBER)](#sin)
   - [SINH(x: NUMBER)](#sinh)
   - [SQRT(x: NUMBER)](#sqrt)
   - [SUBTRACT(x: NUMBER, y: NUMBER)](#subtract)
   - [SUM(...values: T)](#sum)
   - [TAN(x: NUMBER)](#tan)
   - [TANH(x: NUMBER)](#tanh)
   - [TAU()](#tau)
   - [TRUNC(x: NUMBER)](#trunc)
- [Sequence functions](#sequence-functions)
   - [DIGITS()](#digits)
   - [MATRIX(rows: NUMBER, cols: NUMBER, fill: T)](#matrix)
   - [RANGE(min: NUMBER, max?: NUMBER)](#range)
   - [TRANSPOSE(...value: T)](#transpose)
- [Statistical functions](#statistical-functions)
   - [AVERAGE(...values: T)](#average)
   - [COUNT(...values: T)](#count)
   - [MAX(...values: T)](#max)
   - [MEDIAN(...values: T)](#median)
   - [MIN(...values: T)](#min)
   - [MODE(...values: T)](#mode)
- [Text functions](#text-functions)
   - [CHAR_CODE_AT(value: STRING, index: NUMBER)](#char_code_at)
   - [CONCAT(...values: T)](#concat)
   - [FIND_FIRST(haystack: STRING, ...needles: STRING)](#find_first)
   - [FIND_FIRST_INDEX(haystack: STRING, ...needles: STRING)](#find_first_index)
   - [FIND_LAST(haystack: STRING, ...needles: STRING)](#find_last)
   - [FIND_LAST_INDEX(haystack: STRING, ...needles: STRING)](#find_last_index)
   - [JOIN(delimiter: STRING, ...values: T)](#join)
   - [LEN(value: STRING)](#len)
   - [LOWER(value: T)](#lower)
   - [REPLACE_ALL(haystack: STRING, ...zip?: STRING | NUMBER)](#replace_all)
   - [SPLIT(value: STRING, delimiter: STRING)](#split)
   - [TEXT_SLICE(value: STRING, start: NUMBER, end?: NUMBER)](#text_slice)
   - [TRIM(value: STRING)](#trim)
   - [UPPER(value: T)](#upper)
- [Type functions](#type-functions)
   - [AS_BOOLEAN(value: T)](#as_boolean)
   - [AS_BOOLEANS(...values: T)](#as_booleans)
   - [AS_CHAR(value: T)](#as_char)
   - [AS_NUMBER(value: T)](#as_number)
   - [AS_NUMBERS(...values: T)](#as_numbers)
   - [AS_STRING(value: T)](#as_string)
   - [AS_STRINGS(...values: T)](#as_strings)
   - [TYPE(value: T)](#type)
- [Privileged functions](#privileged-functions)
   - [COL(cell?: CELL)](#col)
   - [INHERIT_FORMULA(cell: CELL)](#inherit_formula)
   - [MAP(list: T, lambda: Expression)](#map)
   - [OFFSET_COL()](#offset_col)
   - [OFFSET_ROW()](#offset_row)
   - [ROW(cell?: CELL)](#row)
   - [VALUE()](#value)

### Date functions

<a name="add_days"></a>
#### ADD_DAYS(date: DATETIME, days: NUMBER)

[Back to top](#functions)

Add a certain amount of days to a date.

- `date`: The date to add the days to.
- `days`: The number of days to add.

#### Example:

```ts
// Dependencies:
=TODAY() // 2013-01-21

=ADD_DAYS(TODAY(), 7)
// 2013-01-28
```

---

<a name="add_hours"></a>
#### ADD_HOURS(date: DATETIME, hours: NUMBER)

[Back to top](#functions)

Add a certain amount of hours to a date.

- `date`: The date to add the hours to.
- `days`: The number of hours to add.

#### Example:

```ts
// Dependencies:
=NOW() // 2013-01-21 08:15:20

=ADD_HOURS(NOW(), 8)
// 2013-01-21 16:15:20
```

---

<a name="day"></a>
#### DAY(date: DATETIME)

[Back to top](#functions)

The current day of the given date.

- `date`: The date to extract the current day from.

#### Example:

```ts
// Dependencies:
=TODAY() // 2013-01-21

=DAY(TODAY())
// 21
```

---

<a name="hour"></a>
#### HOUR(date: DATETIME)

[Back to top](#functions)

The current hour of the given date.

- `date`: The date to extract the current hour from.

#### Example:

```ts
// Dependencies:
=NOW() // 2013-01-21 08:15:20

=HOUR(NOW())
// 8
```

---

<a name="minute"></a>
#### MINUTE(date: DATETIME)

[Back to top](#functions)

The current minute of the given date.

- `date`: The date to extract the current minute from.

#### Example:

```ts
// Dependencies:
=NOW() // 2013-01-21 08:15:20

=MINUTE(NOW())
// 15
```

---

<a name="month"></a>
#### MONTH(date: DATETIME)

[Back to top](#functions)

The current month of the given date. The month is 1-indexed.

- `date`: The date to extract the current month from.

#### Example:

```ts
// Dependencies:
=TODAY() // 2013-01-21

=MONTH(TODAY())
// 1
```

---

<a name="now"></a>
#### NOW()

[Back to top](#functions)

The current date and time represented as a datetime.

#### Example:

```ts
=NOW()
// 2013-01-21 08:15:20
```

---

<a name="second"></a>
#### SECOND(date: DATETIME)

[Back to top](#functions)

The current second of the given date.

- `date`: The date to extract the current seconds from.

#### Example:

```ts
// Dependencies:
=NOW() // 2013-01-21 08:15:20

=SECOND(NOW())
// 20
```

---

<a name="sub_days"></a>
#### SUB_DAYS(date: DATETIME, days: NUMBER)

[Back to top](#functions)

Subtract a certain amount of days from a date.

- `date`: The date to subtract the days from.
- `days`: The number of days to subtract.

#### Example:

```ts
// Dependencies:
=TODAY() // 2013-01-21

=SUB_DAYS(TODAY(), 7)
// 2013-01-14
```

---

<a name="sub_hours"></a>
#### SUB_HOURS(date: DATETIME, hours: NUMBER)

[Back to top](#functions)

Subtract a certain amount of hours from a date.

- `date`: The date to subtract the hours from.
- `days`: The number of hours to subtract.

#### Example:

```ts
// Dependencies:
=NOW() // 2013-01-21 08:15:20

=SUB_HOURS(NOW(), 8)
// 2013-01-21 00:15:20
```

---

<a name="time"></a>
#### TIME()

[Back to top](#functions)

The current time represented as a datetime.

#### Example:

```ts
=TIME()
// 08:15:20
```

---

<a name="today"></a>
#### TODAY()

[Back to top](#functions)

The current date represented as a datetime.

#### Example:

```ts
=TODAY()
// 2013-01-21
```

---

<a name="year"></a>
#### YEAR(date: DATETIME)

[Back to top](#functions)

The current year of the given date.

- `date`: The date to extract the current year from.

#### Example:

```ts
// Dependencies:
=TODAY() // 2013-01-21

=YEAR(TODAY())
// 2013
```

### Logic functions

<a name="and"></a>
#### AND(...expressions: T)

[Back to top](#functions)

Returns true if all conditions are true.

- `expressions`: The conditions to evaluate.

#### Examples:

```ts
// Dependencies:
=TRUE() // TRUE

=AND(TRUE(), TRUE(), TRUE())
// TRUE
```

```ts
// Dependencies:
=TRUE() // TRUE
=FALSE() // FALSE

=AND(TRUE(), TRUE(), FALSE())
// FALSE
```

---

<a name="false"></a>
#### FALSE()

[Back to top](#functions)

The boolean value false.

#### Example:

```ts
=FALSE()
// FALSE
```

---

<a name="if"></a>
#### IF(test: BOOLEAN, consequent: T, alternate: T)

[Back to top](#functions)

Returns one value if a condition is true and another value if it is false.

- `test`: The condition to evaluate.
- `consequent`: The value to return if the condition is true.
- `alternate`: The value to return if the condition is false.

#### Examples:

```ts
// Dependencies:
=TRUE() // TRUE

=IF(TRUE(), "huge if true", "huge if false")
// "huge if true"
```

```ts
// Dependencies:
=FALSE() // FALSE

=IF(FALSE(), "huge if true", "huge if false")
// "huge if false"
```

---

<a name="if_error"></a>
#### IF_ERROR(value: T, fallback: T)

[Back to top](#functions)

Returns one value if a condition is an error and another value if it is not.

- `value`: The value to test against an error.
- `fallback`: The value to return if the condition is an error.

#### Examples:

```ts
=IF_ERROR(123 / 1, 0)
// 123
```

```ts
=IF_ERROR(123 / 0, 0)
// 0
```

---

<a name="not"></a>
#### NOT(value: BOOLEAN)

[Back to top](#functions)

Returns true if the condition is false.

- `value`: The condition to negate.

#### Examples:

```ts
// Dependencies:
=TRUE() // TRUE

=NOT(TRUE())
// FALSE
```

```ts
// Dependencies:
=FALSE() // FALSE

=NOT(FALSE())
// TRUE
```

---

<a name="or"></a>
#### OR(...expressions: T)

[Back to top](#functions)

Returns true if any condition is true.

- `expressions`: The conditions to evaluate.

#### Examples:

```ts
// Dependencies:
=TRUE() // TRUE

=OR(TRUE(), TRUE(), TRUE())
// TRUE
```

```ts
// Dependencies:
=TRUE() // TRUE
=FALSE() // FALSE

=OR(TRUE(), TRUE(), FALSE())
// TRUE
```

---

<a name="switch"></a>
#### SWITCH(value: T, ...cases: T, default?: T)

[Back to top](#functions)

Returns the matching value for the first condition that is true.

- `value`: The value to test against the conditions.
- `cases`: The cases and the values to return.

#### Examples:

```ts
=SWITCH(1, 1, "st", 2, "nd", 3, "rd", "th")
// "st"
```

```ts
=SWITCH(2, 1, "st", 2, "nd", 3, "rd", "th")
// "nd"
```

```ts
=SWITCH(3, 1, "st", 2, "nd", 3, "rd", "th")
// "rd"
```

```ts
=SWITCH(4, 1, "st", 2, "nd", 3, "rd", "th")
// "th"
```

```ts
=SWITCH(5, 1, "st", 2, "nd", 3, "rd", "th")
// "th"
```

---

<a name="true"></a>
#### TRUE()

[Back to top](#functions)

The boolean value true.

#### Example:

```ts
=TRUE()
// TRUE
```

### Lookup functions

<a name="lookup"></a>
#### LOOKUP(value: T, lhs: T, rhs: T, fallback?: T)

[Back to top](#functions)

Lookup a value in a range, and return the value in the same position from another range.

#### Example:

```ts
// Dependencies:
=RANGE(1, 3)
// ┌───┬───┬───┐
// │   │ A │ B │
// ├───┼───┼───┤
// │ 1 │ 1 │ 2 │
// └───┴───┴───┘
=RANGE(4, 6)
// ┌───┬───┬───┐
// │   │ A │ B │
// ├───┼───┼───┤
// │ 1 │ 4 │ 5 │
// └───┴───┴───┘

=LOOKUP(2, RANGE(1, 3), RANGE(4, 6))
// 5
```

### Math functions

<a name="abs"></a>
#### ABS(x: NUMBER)

[Back to top](#functions)

The ABS function.

- `x`: A number.

#### Example:

```ts
=ABS(1)
// 1
```

---

<a name="acos"></a>
#### ACOS(x: NUMBER)

[Back to top](#functions)

The ACOS function.

- `x`: A number.

#### Example:

```ts
=ACOS(1)
// 0
```

---

<a name="acosh"></a>
#### ACOSH(x: NUMBER)

[Back to top](#functions)

The ACOSH function.

- `x`: A number.

#### Example:

```ts
=ACOSH(1)
// 0
```

---

<a name="add"></a>
#### ADD(x: NUMBER, y: NUMBER)

[Back to top](#functions)

Add two numbers.

- `x`: The first number.
- `y`: The second number.

#### Example:

```ts
=ADD(1, 2)
// 3
```

---

<a name="asin"></a>
#### ASIN(x: NUMBER)

[Back to top](#functions)

The ASIN function.

- `x`: A number.

#### Example:

```ts
=ASIN(1)
// 1.5707963267948966
```

---

<a name="asinh"></a>
#### ASINH(x: NUMBER)

[Back to top](#functions)

The ASINH function.

- `x`: A number.

#### Example:

```ts
=ASINH(1)
// 0.881373587019543
```

---

<a name="atan"></a>
#### ATAN(x: NUMBER)

[Back to top](#functions)

The ATAN function.

- `x`: A number.

#### Example:

```ts
=ATAN(1)
// 0.7853981633974483
```

---

<a name="atan2"></a>
#### ATAN2(y: NUMBER, x: NUMBER)

[Back to top](#functions)

The angle (in radians) from the X axis to a point.

- `y`: A numeric expression representing the cartesian y-coordinate.
- `x`: A numeric expression representing the cartesian x-coordinate.

#### Example:

```ts
=ATAN2(1, 1)
// 0.7853981633974483
```

---

<a name="atanh"></a>
#### ATANH(x: NUMBER)

[Back to top](#functions)

The ATANH function.

- `x`: A number.

#### Example:

```ts
=ATANH(1)
// Infinity
```

---

<a name="cbrt"></a>
#### CBRT(x: NUMBER)

[Back to top](#functions)

The CBRT function.

- `x`: A number.

#### Example:

```ts
=CBRT(1)
// 1
```

---

<a name="ceil"></a>
#### CEIL(x: NUMBER)

[Back to top](#functions)

Returns the smallest integer greater than or equal to its numeric argument.

- `x`: A numeric expression.

#### Example:

```ts
=CEIL(1.5)
// 2
```

---

<a name="clz32"></a>
#### CLZ32(x: NUMBER)

[Back to top](#functions)

The CLZ32 function.

- `x`: A number.

#### Example:

```ts
=CLZ32(1)
// 31
```

---

<a name="cos"></a>
#### COS(x: NUMBER)

[Back to top](#functions)

The COS function.

- `x`: A number.

#### Example:

```ts
=COS(1)
// 0.5403023058681398
```

---

<a name="cosh"></a>
#### COSH(x: NUMBER)

[Back to top](#functions)

The COSH function.

- `x`: A number.

#### Example:

```ts
=COSH(1)
// 1.5430806348152437
```

---

<a name="divide"></a>
#### DIVIDE(x: NUMBER, y: NUMBER)

[Back to top](#functions)

Returns the result of dividing two numbers.

- `x`: The dividend.
- `y`: The divisor.

#### Example:

```ts
=DIVIDE(6, 3)
// 2
```

---

<a name="exp"></a>
#### EXP(x: NUMBER)

[Back to top](#functions)

The EXP function.

- `x`: A number.

#### Example:

```ts
=EXP(1)
// 2.718281828459045
```

---

<a name="floor"></a>
#### FLOOR(x: NUMBER)

[Back to top](#functions)

Returns the greatest integer less than or equal to its numeric argument.

- `x`: A numeric expression.

#### Example:

```ts
=FLOOR(1.5)
// 1
```

---

<a name="imul"></a>
#### IMUL(x: NUMBER, y: NUMBER)

[Back to top](#functions)

The result of 32-bit multiplication of two numbers.

- `x`: First number
- `y`: Second number

#### Example:

```ts
=IMUL(1, 2)
// 2
```

---

<a name="log"></a>
#### LOG(x: NUMBER)

[Back to top](#functions)

The LOG function.

- `x`: A number.

#### Example:

```ts
=LOG(1)
// 0
```

---

<a name="log10"></a>
#### LOG10(x: NUMBER)

[Back to top](#functions)

The LOG10 function.

- `x`: A number.

#### Example:

```ts
=LOG10(1)
// 0
```

---

<a name="mod"></a>
#### MOD(x: NUMBER, y: NUMBER)

[Back to top](#functions)

Returns the remainder of the division of two numbers.

- `x`: The dividend.
- `y`: The divisor.

#### Example:

```ts
=MOD(5, 2)
// 1
```

---

<a name="multiply"></a>
#### MULTIPLY(x: NUMBER, y: NUMBER)

[Back to top](#functions)

Multiply two numbers.

- `x`: The first number.
- `y`: The second number.

#### Example:

```ts
=MULTIPLY(2, 3)
// 6
```

---

<a name="pi"></a>
#### PI()

[Back to top](#functions)

The number π.

#### Example:

```ts
=PI()
// 3.141592653589793
```

---

<a name="power"></a>
#### POWER(x: NUMBER, y: NUMBER)

[Back to top](#functions)

Returns the value of a base expression taken to a specified power.

- `x`: The base value of the expression.
- `y`: The exponent value of the expression.

#### Example:

```ts
=POWER(2, 3)
// 8
```

---

<a name="product"></a>
#### PRODUCT(...values: T)

[Back to top](#functions)

Returns the product of all arguments.

- `values`: The numbers to multiply.

#### Example:

```ts
=PRODUCT(2, 3, 4)
// 24
```

---

<a name="round"></a>
#### ROUND(x: NUMBER, places?: NUMBER)

[Back to top](#functions)

Rounds a number to a certain number of decimal places.

- `value`: The number to round.
- `places`: The number of decimal places to round to.

#### Examples:

```ts
=ROUND(1.5)
// 2
```

```ts
// Dependencies:
=PI() // 3.141592653589793

=ROUND(PI(), 2)
// 3.14
```

---

<a name="sin"></a>
#### SIN(x: NUMBER)

[Back to top](#functions)

The SIN function.

- `x`: A number.

#### Example:

```ts
=SIN(1)
// 0.8414709848078965
```

---

<a name="sinh"></a>
#### SINH(x: NUMBER)

[Back to top](#functions)

The SINH function.

- `x`: A number.

#### Example:

```ts
=SINH(1)
// 1.1752011936438014
```

---

<a name="sqrt"></a>
#### SQRT(x: NUMBER)

[Back to top](#functions)

The SQRT function.

- `x`: A number.

#### Example:

```ts
=SQRT(1)
// 1
```

---

<a name="subtract"></a>
#### SUBTRACT(x: NUMBER, y: NUMBER)

[Back to top](#functions)

Subtract two numbers.

- `x`: The first number.
- `y`: The second number.

#### Example:

```ts
=SUBTRACT(2, 1)
// 1
```

---

<a name="sum"></a>
#### SUM(...values: T)

[Back to top](#functions)

Returns the sum of all arguments.

- `values`: The numbers to sum.

#### Example:

```ts
=SUM(1, 2, 3)
// 6
```

---

<a name="tan"></a>
#### TAN(x: NUMBER)

[Back to top](#functions)

The TAN function.

- `x`: A number.

#### Example:

```ts
=TAN(1)
// 1.557407724654902
```

---

<a name="tanh"></a>
#### TANH(x: NUMBER)

[Back to top](#functions)

The TANH function.

- `x`: A number.

#### Example:

```ts
=TANH(1)
// 0.7615941559557649
```

---

<a name="tau"></a>
#### TAU()

[Back to top](#functions)

The number τ.

#### Example:

```ts
=TAU()
// 6.283185307179586
```

---

<a name="trunc"></a>
#### TRUNC(x: NUMBER)

[Back to top](#functions)

The TRUNC function.

- `x`: A number.

#### Example:

```ts
=TRUNC(1)
// 1
```

### Sequence functions

<a name="digits"></a>
#### DIGITS()

[Back to top](#functions)

A sequence of the digits from 0 through 9.

#### Example:

```ts
=DIGITS()
// ┌───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┐
// │   │ A │ B │ C │ D │ E │ F │ G │ H │ I │ J │
// ├───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
// │ 1 │ 0 │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │ 8 │ 9 │
// └───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┘
```

---

<a name="matrix"></a>
#### MATRIX(rows: NUMBER, cols: NUMBER, fill: T)

[Back to top](#functions)

Create a matrix of size rows x cols. With an optional default value.

- `rows`: The number of rows in the matrix.
- `cols`: The number of columns in the matrix.
- `fill`: The default value for each cell in the matrix.

#### Example:

```ts
=MATRIX(4, 5, 3)
// ┌───┬───┬───┬───┬───┬───┐
// │   │ A │ B │ C │ D │ E │
// ├───┼───┼───┼───┼───┼───┤
// │ 1 │ 3 │ 3 │ 3 │ 3 │ 3 │
// ├───┼───┼───┼───┼───┼───┤
// │ 2 │ 3 │ 3 │ 3 │ 3 │ 3 │
// ├───┼───┼───┼───┼───┼───┤
// │ 3 │ 3 │ 3 │ 3 │ 3 │ 3 │
// ├───┼───┼───┼───┼───┼───┤
// │ 4 │ 3 │ 3 │ 3 │ 3 │ 3 │
// └───┴───┴───┴───┴───┴───┘
```

---

<a name="range"></a>
#### RANGE(min: NUMBER, max?: NUMBER)

[Back to top](#functions)

Generate a sequence of numbers from start to end.

#### Examples:

```ts
=RANGE(3, 7)
// ┌───┬───┬───┬───┬───┐
// │   │ A │ B │ C │ D │
// ├───┼───┼───┼───┼───┤
// │ 1 │ 3 │ 4 │ 5 │ 6 │
// └───┴───┴───┴───┴───┘
```

```ts
=RANGE(10)
// ┌───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┐
// │   │ A │ B │ C │ D │ E │ F │ G │ H │ I │ J │
// ├───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
// │ 1 │ 0 │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │ 8 │ 9 │
// └───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┘
```

---

<a name="transpose"></a>
#### TRANSPOSE(...value: T)

[Back to top](#functions)

Transpose an array.

- `value`: The array to transpose.

#### Example:

```ts
// Dependencies:
=DIGITS()
// ┌───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┐
// │   │ A │ B │ C │ D │ E │ F │ G │ H │ I │ J │
// ├───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
// │ 1 │ 0 │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │ 8 │ 9 │
// └───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┘

=TRANSPOSE(DIGITS())
// ┌────┬───┐
// │    │ A │
// ├────┼───┤
// │ 1  │ 0 │
// ├────┼───┤
// │ 2  │ 1 │
// ├────┼───┤
// │ 3  │ 2 │
// ├────┼───┤
// │ 4  │ 3 │
// ├────┼───┤
// │ 5  │ 4 │
// ├────┼───┤
// │ 6  │ 5 │
// ├────┼───┤
// │ 7  │ 6 │
// ├────┼───┤
// │ 8  │ 7 │
// ├────┼───┤
// │ 9  │ 8 │
// ├────┼───┤
// │ 10 │ 9 │
// └────┴───┘
```

### Statistical functions

<a name="average"></a>
#### AVERAGE(...values: T)

[Back to top](#functions)

Returns the average of NUMBER arguments.

- `values`: The values to compare.

#### Example:

```ts
=AVERAGE(1, 3, 2, 5, 4)
// 3
```

---

<a name="count"></a>
#### COUNT(...values: T)

[Back to top](#functions)

Count the number of NUMBER arguments.

- `values`: The values to count.

#### Example:

```ts
// Dependencies:
=TRUE() // TRUE

=COUNT(1, 2, TRUE(), "hello world", 3.2)
// 3
```

---

<a name="max"></a>
#### MAX(...values: T)

[Back to top](#functions)

Returns the largest NUMBER argument.

- `values`: The values to compare.

#### Example:

```ts
=MAX(1, 3, 2, 5, 4)
// 5
```

---

<a name="median"></a>
#### MEDIAN(...values: T)

[Back to top](#functions)

Returns the median of NUMBER arguments.

- `values`: The values to compare.

#### Example:

```ts
=MEDIAN(1, 3, 2, 5, 4)
// 3
```

---

<a name="min"></a>
#### MIN(...values: T)

[Back to top](#functions)

Returns the smallest NUMBER argument.

- `values`: The values to compare.

#### Example:

```ts
=MIN(5, 4, 1, 2, 3)
// 1
```

---

<a name="mode"></a>
#### MODE(...values: T)

[Back to top](#functions)

Returns the mode of NUMBER arguments.

- `values`: The values to compare.

#### Example:

```ts
=MODE(3, 2, 1, 3, 3, 4, 5, 8, 9, 1)
// 3
```

### Text functions

<a name="char_code_at"></a>
#### CHAR_CODE_AT(value: STRING, index: NUMBER)

[Back to top](#functions)

Get the character code at a specific index in a string.

- `value`: The string to get the character code from.
- `index`: The index of the character to get the character code from.

#### Examples:

```ts
=CHAR_CODE_AT("ABC", 0)
// 65
```

```ts
=CHAR_CODE_AT("ABC", 1)
// 66
```

```ts
=CHAR_CODE_AT("ABC", 2)
// 67
```

---

<a name="concat"></a>
#### CONCAT(...values: T)

[Back to top](#functions)

Concatenates multiple strings together.

- `values`: The strings to concatenate.

#### Example:

```ts
=CONCAT("hello", " ", "world")
// "hello world"
```

---

<a name="find_first"></a>
#### FIND_FIRST(haystack: STRING, ...needles: STRING)

[Back to top](#functions)

Returns the first needle found in the haystack.

- `haystack`: The string to search in.
- `needles`: The strings to search for.

#### Examples:

```ts
=FIND_FIRST("The quick brown fox jumps over the lazy dog", "fox", "dog")
// "fox"
```

```ts
=FIND_FIRST("The quick brown fox jumps over the lazy dog", "dog", "fox")
// "fox"
```

---

<a name="find_first_index"></a>
#### FIND_FIRST_INDEX(haystack: STRING, ...needles: STRING)

[Back to top](#functions)

Returns the position of the first needle found in the haystack.

- `haystack`: The string to search in.
- `needles`: The strings to search for.

#### Examples:

```ts
=FIND_FIRST_INDEX("The quick brown fox jumps over the lazy dog", "fox", "dog")
// 16
```

```ts
=FIND_FIRST_INDEX("The quick brown fox jumps over the lazy dog", "dog", "fox")
// 16
```

---

<a name="find_last"></a>
#### FIND_LAST(haystack: STRING, ...needles: STRING)

[Back to top](#functions)

Returns the last needle found in the haystack.

- `haystack`: The string to search in.
- `needles`: The strings to search for.

#### Examples:

```ts
=FIND_LAST("The quick brown fox jumps over the lazy dog", "fox", "dog")
// "dog"
```

```ts
=FIND_LAST("The quick brown fox jumps over the lazy dog", "dog", "fox")
// "dog"
```

---

<a name="find_last_index"></a>
#### FIND_LAST_INDEX(haystack: STRING, ...needles: STRING)

[Back to top](#functions)

Returns the position of the last needle found in the haystack.

- `haystack`: The string to search in.
- `needles`: The strings to search for.

#### Examples:

```ts
=FIND_LAST_INDEX("The quick brown fox jumps over the lazy dog", "fox", "dog")
// 40
```

```ts
=FIND_LAST_INDEX("The quick brown fox jumps over the lazy dog", "dog", "fox")
// 40
```

---

<a name="join"></a>
#### JOIN(delimiter: STRING, ...values: T)

[Back to top](#functions)

Joins multiple strings together with a delimiter.

- `delimiter`: The string to insert between each value.
- `values`: The values to join.

#### Example:

```ts
// Dependencies:
=TRUE() // TRUE

=JOIN("-", 1, 2, "hello", "world", TRUE())
// "1-2-hello-world-TRUE"
```

---

<a name="len"></a>
#### LEN(value: STRING)

[Back to top](#functions)

Returns the length of a string.

- `value`: The string to measure.

#### Example:

```ts
=LEN("Hello, World!")
// 13
```

---

<a name="lower"></a>
#### LOWER(value: T)

[Back to top](#functions)

Converts a string to lowercase.

- `value`: The string to convert.

#### Example:

```ts
=LOWER("Hello, World!")
// "hello, world!"
```

---

<a name="replace_all"></a>
#### REPLACE_ALL(haystack: STRING, ...zip?: STRING | NUMBER)

[Back to top](#functions)

Replaces all occurrences of the needles with their replacements.

- `haystack`: The string to search in.
- `zip`: The strings to search for and their replacements.

#### Example:

```ts
=REPLACE_ALL("The quick brown fox jumps over the lazy dog", "fox", "cat", "dog", "wolf")
// "The quick brown cat jumps over the lazy wolf"
```

---

<a name="split"></a>
#### SPLIT(value: STRING, delimiter: STRING)

[Back to top](#functions)

Splits a string into an array of substrings separated by a delimiter.

- `value`: The string to split.
- `delimiter`: The string to split by.

#### Example:

```ts
=SPLIT("Hello World", " ")
// ┌───┬─────────┬─────────┐
// │   │ A       │ B       │
// ├───┼─────────┼─────────┤
// │ 1 │ "Hello" │ "World" │
// └───┴─────────┴─────────┘
```

---

<a name="text_slice"></a>
#### TEXT_SLICE(value: STRING, start: NUMBER, end?: NUMBER)

[Back to top](#functions)

Returns a section of a string.

- `value`: The string to slice.
- `start`: The index to the beginning of the specified portion of the `value`.
- `end`: The index to the end of the specified portion of the `value`. The substring includes the characters up to, but not including, the character indicated by `end`. If this value is not specified, the substring continues to the end of the `value`.

#### Examples:

```ts
=TEXT_SLICE("The quick brown fox jumps over the lazy dog", 0, 19)
// "The quick brown fox"
```

```ts
=TEXT_SLICE("The quick brown fox jumps over the lazy dog", 40)
// "dog"
```

```ts
=TEXT_SLICE("The quick brown fox jumps over the lazy dog", -3)
// "dog"
```

```ts
=TEXT_SLICE("The quick brown fox jumps over the lazy dog", 10, 19)
// "brown fox"
```

---

<a name="trim"></a>
#### TRIM(value: STRING)

[Back to top](#functions)

Removes leading and trailing whitespace from a string.

- `value`: The string to trim.

#### Example:

```ts
=TRIM("  Hello, World!  ")
// "Hello, World!"
```

---

<a name="upper"></a>
#### UPPER(value: T)

[Back to top](#functions)

Converts a string to uppercase.

- `value`: The string to convert.

#### Example:

```ts
=UPPER("Hello, World!")
// "HELLO, WORLD!"
```

### Type functions

<a name="as_boolean"></a>
#### AS_BOOLEAN(value: T)

[Back to top](#functions)

Tries to convert a value to a boolean.

- `value`: The value to convert.

#### Examples:

```ts
=AS_BOOLEAN(0)
// FALSE
```

```ts
=AS_BOOLEAN(1)
// TRUE
```

```ts
=AS_BOOLEAN("123")
// TRUE
```

```ts
=AS_BOOLEAN("0")
// FALSE
```

```ts
// Dependencies:
=TRUE() // TRUE

=AS_BOOLEAN(TRUE())
// TRUE
```

```ts
// Dependencies:
=FALSE() // FALSE

=AS_BOOLEAN(FALSE())
// FALSE
```

```ts
// Dependencies:
=NOW() // 2013-01-21 08:15:20

=AS_BOOLEAN(NOW())
// TRUE
```

---

<a name="as_booleans"></a>
#### AS_BOOLEANS(...values: T)

[Back to top](#functions)

Tries to convert a list of values to booleans.

- `values`: The values to convert.

#### Example:

```ts
// Dependencies:
=TRUE() // TRUE
=FALSE() // FALSE
=NOW() // 2013-01-21 08:15:20

=AS_BOOLEANS(0, 1, "123", "0", TRUE(), FALSE(), NOW())
// ┌───┬───────┬──────┬──────┬───────┬──────┬───────┬──────┐
// │   │ A     │ B    │ C    │ D     │ E    │ F     │ G    │
// ├───┼───────┼──────┼──────┼───────┼──────┼───────┼──────┤
// │ 1 │ FALSE │ TRUE │ TRUE │ FALSE │ TRUE │ FALSE │ TRUE │
// └───┴───────┴──────┴──────┴───────┴──────┴───────┴──────┘
```

---

<a name="as_char"></a>
#### AS_CHAR(value: T)

[Back to top](#functions)

Tries to convert a numeric value to a character.

- `value`: The number to convert.

#### Examples:

```ts
=AS_CHAR(65)
// "A"
```

```ts
=AS_CHAR(97)
// "a"
```

---

<a name="as_number"></a>
#### AS_NUMBER(value: T)

[Back to top](#functions)

Tries to convert a value to a number.

- `value`: The value to convert.

#### Examples:

```ts
=AS_NUMBER(1)
// 1
```

```ts
=AS_NUMBER("123")
// 123
```

```ts
=AS_NUMBER("million")
// ERROR: AS_NUMBER() expects a number, got million
```

```ts
// Dependencies:
=TRUE() // TRUE

=AS_NUMBER(TRUE())
// 1
```

```ts
// Dependencies:
=FALSE() // FALSE

=AS_NUMBER(FALSE())
// 0
```

```ts
// Dependencies:
=NOW() // 2013-01-21 08:15:20

=AS_NUMBER(NOW())
// 1358752520000
```

---

<a name="as_numbers"></a>
#### AS_NUMBERS(...values: T)

[Back to top](#functions)

Tries to convert a list of values to numbers.

- `values`: The values to convert.

#### Example:

```ts
// Dependencies:
=TRUE() // TRUE
=FALSE() // FALSE
=NOW() // 2013-01-21 08:15:20

=AS_NUMBERS(1, "123", "million", TRUE(), FALSE(), NOW())
// ┌───┬───┬─────┬───────┬───┬───┬───────────────┐
// │   │ A │ B   │ C     │ D │ E │ F             │
// ├───┼───┼─────┼───────┼───┼───┼───────────────┤
// │ 1 │ 1 │ 123 │ Error │ 1 │ 0 │ 1358752520000 │
// └───┴───┴─────┴───────┴───┴───┴───────────────┘
// 
// Errors:
// 
// · C1: AS_NUMBER() expects a number, got million
```

---

<a name="as_string"></a>
#### AS_STRING(value: T)

[Back to top](#functions)

Tries to convert a value to a string.

- `value`: The value to convert.

#### Examples:

```ts
=AS_STRING(1)
// "1"
```

```ts
=AS_STRING("123")
// "123"
```

```ts
// Dependencies:
=TRUE() // TRUE

=AS_STRING(TRUE())
// "TRUE"
```

```ts
// Dependencies:
=FALSE() // FALSE

=AS_STRING(FALSE())
// "FALSE"
```

```ts
// Dependencies:
=NOW() // 2013-01-21 08:15:20

=AS_STRING(NOW())
// "2013-01-21 08:15:20"
```

```ts
// Dependencies:
=TIME() // 08:15:20

=AS_STRING(TIME())
// "08:15:20"
```

---

<a name="as_strings"></a>
#### AS_STRINGS(...values: T)

[Back to top](#functions)

Tries to convert a list of values to strings.

- `values`: The values to convert.

#### Example:

```ts
// Dependencies:
=TRUE() // TRUE
=FALSE() // FALSE
=NOW() // 2013-01-21 08:15:20
=TIME() // 08:15:20

=AS_STRINGS(1, "123", TRUE(), FALSE(), NOW(), TIME())
// ┌───┬─────┬───────┬────────┬─────────┬───────────────────────┬────────────┐
// │   │ A   │ B     │ C      │ D       │ E                     │ F          │
// ├───┼─────┼───────┼────────┼─────────┼───────────────────────┼────────────┤
// │ 1 │ "1" │ "123" │ "TRUE" │ "FALSE" │ "2013-01-21 08:15:20" │ "08:15:20" │
// └───┴─────┴───────┴────────┴─────────┴───────────────────────┴────────────┘
```

---

<a name="type"></a>
#### TYPE(value: T)

[Back to top](#functions)

Returns the type of a value.

- `value`: The value to check.

#### Examples:

```ts
=TYPE(1)
// "number"
```

```ts
=TYPE("hello")
// "string"
```

```ts
// Dependencies:
=TRUE() // TRUE

=TYPE(TRUE())
// "boolean"
```

```ts
// Dependencies:
=NOW() // 2013-01-21 08:15:20

=TYPE(NOW())
// "datetime"
```

```ts
=TYPE(UNKNOWN_FUNCTION())
// "error"
```

```ts
=TYPE(B1)
// "empty"
```

### Privileged functions

<a name="col"></a>
#### COL(cell?: CELL)

[Back to top](#functions)

Get the col number of a cell. If no cell is provided, the current cell will be used.

#### Examples:

```ts
=COL()
// 1
```

```ts
=COL(B3)
// 2
```

---

<a name="inherit_formula"></a>
#### INHERIT_FORMULA(cell: CELL)

[Back to top](#functions)

Inherit a formula from another cell. References to other cells in the formula will be updated to be relative to the current cell.

---

<a name="map"></a>
#### MAP(list: T, lambda: Expression)

[Back to top](#functions)

Map a list of values using a lambda function.

#### Example:

```ts
// Dependencies:
=DIGITS()
// ┌───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┐
// │   │ A │ B │ C │ D │ E │ F │ G │ H │ I │ J │
// ├───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
// │ 1 │ 0 │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │ 8 │ 9 │
// └───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┘

=MAP(DIGITS(), VALUE() * 2)
// ┌───┬───┬───┬───┬───┬───┬────┬────┬────┬────┬────┐
// │   │ A │ B │ C │ D │ E │ F  │ G  │ H  │ I  │ J  │
// ├───┼───┼───┼───┼───┼───┼────┼────┼────┼────┼────┤
// │ 1 │ 0 │ 2 │ 4 │ 6 │ 8 │ 10 │ 12 │ 14 │ 16 │ 18 │
// └───┴───┴───┴───┴───┴───┴────┴────┴────┴────┴────┘
```

---

<a name="offset_col"></a>
#### OFFSET_COL()

[Back to top](#functions)

Get the current col number of the value in the matrix. Only works inside of a `MAP()`.

---

<a name="offset_row"></a>
#### OFFSET_ROW()

[Back to top](#functions)

Get the current row number of the value in the matrix. Only works inside of a `MAP()`.

---

<a name="row"></a>
#### ROW(cell?: CELL)

[Back to top](#functions)

Get the row number of a cell. If no cell is provided, the current cell will be used.

#### Examples:

```ts
=ROW()
// 1
```

```ts
=ROW(B3)
// 3
```

---

<a name="value"></a>
#### VALUE()

[Back to top](#functions)

Get the value of the current position in a matrix. Only works inside of a `MAP()`.

<!-- end:functions -->


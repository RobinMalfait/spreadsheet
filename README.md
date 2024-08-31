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

### Date functions

<a name="add_days"></a>
#### ADD_DAYS(date: DATETIME, days: NUMBER)

[Back to top](#functions)

Add a certain amount of days to a date.

- `date`: The date to add the days to.
- `days`: The number of days to add.

#### Examples:

```ts
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

#### Examples:

```ts
=ADD_HOURS(NOW(), 8)
// 2013-01-21 16:15:20
```

---

<a name="day"></a>
#### DAY(date: DATETIME)

[Back to top](#functions)

The current day of the given date.

- `date`: The date to extract the current day from.

#### Examples:

```ts
=DAY(TODAY())
// 21
```

---

<a name="hour"></a>
#### HOUR(date: DATETIME)

[Back to top](#functions)

The current hour of the given date.

- `date`: The date to extract the current hour from.

#### Examples:

```ts
=HOUR(NOW())
// 8
```

---

<a name="minute"></a>
#### MINUTE(date: DATETIME)

[Back to top](#functions)

The current minute of the given date.

- `date`: The date to extract the current minute from.

#### Examples:

```ts
=MINUTE(NOW())
// 15
```

---

<a name="month"></a>
#### MONTH(date: DATETIME)

[Back to top](#functions)

The current month of the given date. The month is 1-indexed.

- `date`: The date to extract the current month from.

#### Examples:

```ts
=MONTH(TODAY())
// 1
```

---

<a name="now"></a>
#### NOW()

[Back to top](#functions)

The current date and time represented as a datetime.

#### Examples:

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

#### Examples:

```ts
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

#### Examples:

```ts
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

#### Examples:

```ts
=SUB_HOURS(NOW(), 8)
// 2013-01-21 00:15:20
```

---

<a name="time"></a>
#### TIME()

[Back to top](#functions)

The current time represented as a datetime.

#### Examples:

```ts
=TIME()
// 08:15:20
```

---

<a name="today"></a>
#### TODAY()

[Back to top](#functions)

The current date represented as a datetime.

#### Examples:

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

#### Examples:

```ts
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
=AND(TRUE(), TRUE(), TRUE())
// TRUE
```

```ts
=AND(TRUE(), TRUE(), FALSE())
// FALSE
```

---

<a name="false"></a>
#### FALSE()

[Back to top](#functions)

The boolean value false.

#### Examples:

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
=IF(TRUE(), "huge if true", "huge if false")
// huge if true
```

```ts
=IF(FALSE(), "huge if true", "huge if false")
// huge if false
```

---

<a name="not"></a>
#### NOT(value: BOOLEAN)

[Back to top](#functions)

Returns true if the condition is false.

- `value`: The condition to negate.

#### Examples:

```ts
=NOT(TRUE())
// FALSE
```

```ts
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
=OR(TRUE(), TRUE(), TRUE())
// TRUE
```

```ts
=OR(TRUE(), TRUE(), FALSE())
// TRUE
```

---

<a name="true"></a>
#### TRUE()

[Back to top](#functions)

The boolean value true.

#### Examples:

```ts
=TRUE()
// TRUE
```

### Math functions

<a name="abs"></a>
#### ABS(x: NUMBER)

[Back to top](#functions)

The ABS function.

- `x`: A number.

#### Examples:

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

#### Examples:

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

#### Examples:

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

#### Examples:

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

#### Examples:

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

#### Examples:

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

#### Examples:

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

#### Examples:

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

#### Examples:

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

#### Examples:

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

#### Examples:

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

#### Examples:

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

#### Examples:

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

#### Examples:

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

#### Examples:

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

#### Examples:

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

#### Examples:

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

#### Examples:

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

#### Examples:

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

#### Examples:

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

#### Examples:

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

#### Examples:

```ts
=MULTIPLY(2, 3)
// 6
```

---

<a name="pi"></a>
#### PI()

[Back to top](#functions)

The number π.

#### Examples:

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

#### Examples:

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

#### Examples:

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
=ROUND(PI(), 2)
// 3.14
```

---

<a name="sin"></a>
#### SIN(x: NUMBER)

[Back to top](#functions)

The SIN function.

- `x`: A number.

#### Examples:

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

#### Examples:

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

#### Examples:

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

#### Examples:

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

#### Examples:

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

#### Examples:

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

#### Examples:

```ts
=TANH(1)
// 0.7615941559557649
```

---

<a name="tau"></a>
#### TAU()

[Back to top](#functions)

The number τ.

#### Examples:

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

#### Examples:

```ts
=TRUNC(1)
// 1
```

### Sequence functions

<a name="digits"></a>
#### DIGITS()

[Back to top](#functions)

A sequence of the digits from 0 through 9.

#### Examples:

```ts
=JOIN(", ", DIGITS())
// 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
```

### Statistical functions

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

### Text functions

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

### Type functions

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


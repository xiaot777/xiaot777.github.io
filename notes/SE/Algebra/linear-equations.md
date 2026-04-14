# Linear Equations

A **linear equation** is an equation of the form `ax + b = c` where the variable appears only to the first power (no `x²`, `√x`, etc.).

## Standard Forms

| Name | Form | Example |
|---|---|---|
| Slope-intercept | `y = mx + b` | `y = 2x + 3` |
| Standard form | `ax + by = c` | `3x + 2y = 6` |
| Point-slope | `y − y₁ = m(x − x₁)` | `y − 1 = 2(x − 0)` |

## Solving One Variable

Isolate the variable by applying inverse operations:

```
3x + 7 = 22
3x     = 22 − 7   (subtract 7 from both sides)
3x     = 15
x      = 5         (divide both sides by 3)
```

**Check:** `3(5) + 7 = 22` ✓

## Systems of Linear Equations

Two equations, two unknowns — find where they intersect.

### Substitution

```
y = 2x + 1     ...(1)
3x + y = 11    ...(2)

Substitute (1) into (2):
3x + (2x + 1) = 11
5x + 1 = 11
5x = 10
x = 2, then y = 5
```

### Elimination

```
 2x + 3y = 12   ...(A)
−2x + y  = 4    ...(B)

Add (A) + (B):
4y = 16  →  y = 4

Substitute: 2x + 12 = 12  →  x = 0
```

### Matrix Form

A system `Ax = b` can be solved with Gaussian elimination or the inverse:

```
[2  3] [x]   [12]
[-2 1] [y] = [4 ]

x = A⁻¹ b
```

## Geometric Interpretation

- Each linear equation in 2D represents a **line**.
- A system of two equations:
  - **One solution**: lines intersect at a point
  - **No solution**: lines are parallel (inconsistent)
  - **Infinite solutions**: lines are identical (dependent)

## Linear Inequalities

Replace `=` with `<`, `>`, `≤`, `≥`:

```
2x + 1 < 7
2x < 6
x < 3
```

When **multiplying or dividing by a negative number**, flip the inequality sign:

```
−x > 4  →  x < −4
```

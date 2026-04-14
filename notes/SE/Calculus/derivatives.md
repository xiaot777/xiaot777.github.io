# Derivatives

The **derivative** of a function measures how the function's output changes as its input changes — it is the instantaneous rate of change.

## Definition

$$f'(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}$$

Geometrically, the derivative at a point is the **slope of the tangent line** to the curve at that point.

## Basic Rules

| Rule | Formula |
|---|---|
| Constant | `d/dx [c] = 0` |
| Power | `d/dx [xⁿ] = n·xⁿ⁻¹` |
| Sum | `(f + g)' = f' + g'` |
| Product | `(fg)' = f'g + fg'` |
| Quotient | `(f/g)' = (f'g − fg') / g²` |
| Chain | `[f(g(x))]' = f'(g(x)) · g'(x)` |

## Common Derivatives

```
d/dx [sin x]  =  cos x
d/dx [cos x]  = −sin x
d/dx [eˣ]    =  eˣ
d/dx [ln x]  =  1/x
d/dx [xⁿ]   =  n·xⁿ⁻¹
```

## Example: Chain Rule

Find the derivative of `f(x) = sin(x²)`.

Let `u = x²`, so `f(x) = sin(u)`.

```
f'(x) = cos(u) · u'
      = cos(x²) · 2x
```

## Applications

### Finding Critical Points

Set `f'(x) = 0` to find maxima and minima.

```
f(x) = x³ − 3x
f'(x) = 3x² − 3 = 0
x² = 1
x = ±1
```

Check the second derivative `f''(x) = 6x`:
- At `x = 1`: `f''(1) = 6 > 0` → **local minimum**
- At `x = -1`: `f''(-1) = -6 < 0` → **local maximum**

### Linear Approximation

Near a point `a`, a function is approximately linear:

```
f(x) ≈ f(a) + f'(a)·(x − a)
```

This is the **tangent line approximation** and underlies Newton's method.

## Higher-Order Derivatives

| Notation | Meaning |
|---|---|
| `f'(x)` | First derivative (velocity) |
| `f''(x)` | Second derivative (acceleration) |
| `f⁽ⁿ⁾(x)` | nth derivative |

> If `f''(x) > 0`, the function is **concave up** (bowl shape).  
> If `f''(x) < 0`, the function is **concave down** (hill shape).

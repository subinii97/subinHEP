---
title: HEP - Lecture 02 - Part 1. Units & Special Relativity
date: 2026-01-16
category: PP Study
---
# Lecture Note 02 - Part 1: Units and Special Relativity

**Textbook:** *Modern Particle Physics* by Mark Thomson
**Chapter:** 2. Underlying Concepts (Sections 2.1 – 2.2)

---

## 2.1 Units in particle physics

Standard S.I. units are inconvenient for particle physics due to the small scales involved. We adopt a system that reflects the natural scales of quantum mechanics and relativity.

### 2.1.1 Natural units
The system of **natural units** is based on setting the fundamental constants of quantum mechanics and special relativity to unity:

$$
\hbar = c = 1
$$

In this system, the units for mass, length, and time are replaced by powers of energy (**GeV**).

| Quantity | SI Dimension | Natural Unit Dimension | Common Unit |
| :--- | :--- | :--- | :--- |
| Energy ($E$) | $ML^2T^{-2}$ | $[E]$ | GeV |
| Momentum ($p$) | $MLT^{-1}$ | $[E]$ | GeV |
| Mass ($m$) | $M$ | $[E]$ | GeV |
| Time ($t$) | $T$ | $[E]^{-1}$ | $\text{GeV}^{-1}$ |
| Length ($x$) | $L$ | $[E]^{-1}$ | $\text{GeV}^{-1}$ |
| Area ($\sigma$) | $L^2$ | $[E]^{-2}$ | $\text{GeV}^{-2}$ |

**Heaviside-Lorentz Units:**
For electromagnetism, we absorb the permittivity of free space $\epsilon_0$ (and consequently $\mu_0$) into the definition of charge:
$$
\epsilon_0 = \mu_0 = 1
$$
Maxwell's equations take the same form as in S.I. units, but the Fine Structure Constant $\alpha$ becomes:
$$
\alpha = \frac{e^2}{4\pi} \approx \frac{1}{137}
$$
This implies the electron charge magnitude is $e = \sqrt{4\pi\alpha} \approx 0.303$.

**Conversion Factors:**
To convert back to S.I. units, use the following constants:
$$
\hbar c \approx 0.197 \text{ GeV}\cdot\text{fm}
$$
$$
1 \text{ barn} = 10^{-28} \text{ m}^2
$$
$$
1 \text{ GeV}^{-2} \approx 0.389 \text{ mb}
$$

---

## 2.2 Special relativity

Particle physics requires a formulation invariant under Lorentz transformations.

### 2.2.1 The Lorentz transformation
For two inertial frames $\Sigma$ and $\Sigma'$ (where $\Sigma'$ moves with velocity $v$ along the $z$-axis relative to $\Sigma$), the coordinates transform as:
$$
t' = \gamma(t - \beta z), \quad z' = \gamma(z - \beta t), \quad x' = x, \quad y' = y
$$
where $\beta = v/c$ and $\gamma = (1-\beta^2)^{-1/2}$.

**Matrix Form:**
We can express this transformation using a $4\times4$ matrix $\Lambda^\mu_\nu$:
$$
x'^\mu = \Lambda^\mu_\nu x^\nu
$$
$$
\begin{pmatrix} t' \\ x' \\ y' \\ z' \end{pmatrix} = \begin{pmatrix} \gamma & 0 & 0 & -\beta\gamma \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ -\beta\gamma & 0 & 0 & \gamma \end{pmatrix} \begin{pmatrix} t \\ x \\ y \\ z \end{pmatrix}
$$

### 2.2.2 Four-vectors and Lorentz invariance
We define **contravariant** ($x^\mu$) and **covariant** ($x_\mu$) four-vectors:
$$
x^\mu = (t, x, y, z) = (t, \vec{x})
$$
$$
x_\mu = (t, -x, -y, -z) = (t, -\vec{x})
$$

**The Metric Tensor ($g_{\mu\nu}$):**
The covariant vector is obtained from the contravariant vector by contracting with the metric tensor $g_{\mu\nu}$:
$$
x_\mu = g_{\mu\nu} x^\nu
$$
For special relativity, the metric tensor is:
$$
g_{\mu\nu} = \begin{pmatrix} 1 & 0 & 0 & 0 \\ 0 & -1 & 0 & 0 \\ 0 & 0 & -1 & 0 \\ 0 & 0 & 0 & -1 \end{pmatrix}
$$
*(Note: $g^{\mu\nu}$ is identical to $g_{\mu\nu}$).*

**Scalar Product:**
The scalar product of two four-vectors is a **Lorentz Invariant** quantity (same in all frames):
$$
x^\mu x_\mu = g_{\mu\nu} x^\mu x^\nu = t^2 - x^2 - y^2 - z^2
$$

**Four-Momentum ($p^\mu$):**
For a particle with energy $E$ and momentum $\vec{p}$, the four-momentum is:
$$
p^\mu = (E, p_x, p_y, p_z)
$$
Its invariant scalar product corresponds to the particle's mass squared:
$$
p^\mu p_\mu = E^2 - |\vec{p}|^2 = m^2
$$

**Four-Derivative ($\partial_\mu$):**
The four-dimensional gradient operator is defined as:
$$
\partial_\mu \equiv \frac{\partial}{\partial x^\mu} = \left( \frac{\partial}{\partial t}, \frac{\partial}{\partial x}, \frac{\partial}{\partial y}, \frac{\partial}{\partial z} \right) = \left( \frac{\partial}{\partial t}, \nabla \right)
$$
Note that this transforms as a **covariant** vector. The contravariant derivative is:
$$
\partial^\mu \equiv \frac{\partial}{\partial x_\mu} = \left( \frac{\partial}{\partial t}, -\nabla \right)
$$
Typical usage includes the four-divergence $\partial_\mu A^\mu = \frac{\partial A^0}{\partial t} + \nabla \cdot \vec{A}$.

### 2.2.3 Mandelstam variables
For a scattering process $1 + 2 \to 3 + 4$, the kinematics are described by three Lorentz-invariant scalars:
1.  **$s$-channel:** $s = (p_1 + p_2)^2$ (Total Center-of-Mass Energy squared).
2.  **$t$-channel:** $t = (p_1 - p_3)^2$ (Four-momentum transfer squared).
3.  **$u$-channel:** $u = (p_1 - p_4)^2$.

Sum Rule:
$$
s + t + u = m_1^2 + m_2^2 + m_3^2 + m_4^2
$$

---

## Summary
* **Natural Units:** $\hbar=c=1$. Mass, energy, momentum are in GeV.
* **Metric Tensor:** $g_{\mu\nu} = \text{diag}(1, -1, -1, -1)$ connects $x^\mu$ and $x_\mu$.
* **Four-vectors:** $x^\mu = (t, \vec{x})$ and $p^\mu = (E, \vec{p})$ ensure Lorentz covariance.
* **Invariants:** $p^2=m^2$ and Mandelstam variables ($s, t, u$) are crucial for calculations.
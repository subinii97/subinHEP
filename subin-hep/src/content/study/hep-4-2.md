---
title: "Lecture Note 04 - Part 2: The Dirac Equation"
date: 2026-01-18
category: PP Study
---
# Lecture Note 04 - Part 2: The Dirac Equation

**Textbook:** *Modern Particle Physics* by Mark Thomson
**Chapter:** 4. The Dirac Equation (Sections 4.5 – 4.9)

This section covers the covariant formulation of the Dirac equation, the derivation of free-particle solutions (spinors), the interpretation of antiparticles, and the concepts of helicity and intrinsic parity.

---

## 4.5 Covariant form of the Dirac equation

The Dirac equation derived in Hamiltonian form ($i\partial_t\psi = (\mathbf{\alpha}\cdot\mathbf{p} + \beta m)\psi$) naturally brings out the connection with spin, but does not emphasize Lorentz covariance. To express it in a manifestly covariant form, we multiply by $\beta$ and define the **Dirac $\gamma$-matrices**:

$$
\gamma^{0}\equiv\beta, \quad \gamma^{1}\equiv\beta\alpha_{x}, \quad \gamma^{2}\equiv\beta\alpha_{y}, \quad \gamma^{3}\equiv\beta\alpha_{z} \quad (4.31)
$$

Using the covariant four-derivative $\partial_\mu \equiv (\partial_0, \partial_1, \partial_2, \partial_3) = (\partial/\partial t, \nabla)$, the Dirac equation becomes:

> **The Covariant Dirac Equation**
> $$
> (i\gamma^{\mu}\partial_{\mu}-m)\psi=0 \quad (4.32)
> $$

Here, the index $\mu$ is treated as a Lorentz index, implying summation. However, the $\gamma^\mu$ are **constant matrices**, not four-vectors.

**Properties of $\gamma$-matrices:**
The algebra of the $\gamma$-matrices is defined by the anti-commutation relation (Clifford algebra):

$$
\{\gamma^{\mu},\gamma^{\nu}\}\equiv\gamma^{\mu}\gamma^{\nu}+\gamma^{\nu}\gamma^{\mu}=2g^{\mu\nu} \quad (4.33)
$$

Additionally, $\gamma^0$ is Hermitian, while $\gamma^k$ (for $k=1,2,3$) are anti-Hermitian:
$$
\gamma^{0\dagger}=\gamma^{0} \quad \text{and} \quad \gamma^{k\dagger}=-\gamma^{k} \quad (4.34)
$$

In the **Dirac-Pauli Representation**, the matrices are:
$$
\gamma^{0}=\begin{pmatrix}I&0\\ 0&-I\end{pmatrix}, \quad \gamma^{k}=\begin{pmatrix}0&\sigma_{k}\\ -\sigma_{k}&0\end{pmatrix} \quad (4.35)
$$

---

### 4.5.1 The adjoint spinor and the covariant current

The probability current density $j = (\rho, \mathbf{j})$ derived in Section 4.3 can be written compactly as a four-vector $j^\mu$:
$$
j^{\mu}=\psi^{\dagger}\gamma^{0}\gamma^{\mu}\psi \quad (4.36)
$$

To simplify this, we define the **adjoint spinor** $\bar{\psi}$:
$$
\overline{\psi}\equiv\psi^{\dagger}\gamma^{0}
$$

Using the adjoint spinor, the four-vector current becomes:

> **Covariant Probability Current**
> $$
> j^{\mu}=\overline{\psi}\gamma^{\mu}\psi \quad (4.37)
> $$

Conservation of probability is expressed by the covariant continuity equation $\partial_\mu j^\mu = 0$.

---

## 4.6 Solutions to the Dirac equation

We look for free-particle plane wave solutions of the form:
$$
\psi(x,t)=u(E,p)e^{i(p\cdot x-Et)} \quad (4.38)
$$

Substituting this ansatz into the covariant Dirac equation $(i\gamma^\mu\partial_\mu - m)\psi = 0$ yields the **momentum-space Dirac equation**:

> **Dirac Equation for Particle Spinor $u$**
> $$
> (\gamma^{\mu}p_{\mu}-m)u=0 \quad (4.41)
> $$

### 4.6.1 Particles at rest
For a particle at rest ($\mathbf{p}=0$), the equation reduces to $E\gamma^0 u = m u$.
In the Dirac-Pauli representation, $\gamma^0$ is diagonal, leading to four orthogonal eigensolutions:

1.  **Positive Energy ($E=+m$):**
    $$
    u_{1}=N\begin{pmatrix}1\\ 0\\ 0\\ 0\end{pmatrix}, \quad u_{2}=N\begin{pmatrix}0\\ 1\\ 0\\ 0\end{pmatrix} \quad (4.42)
    $$
    These correspond to spin-up and spin-down particles.

2.  **Negative Energy ($E=-m$):**
    $$
    u_{3}=N\begin{pmatrix}0\\ 0\\ 1\\ 0\end{pmatrix}, \quad u_{4}=N\begin{pmatrix}0\\ 0\\ 0\\ 1\end{pmatrix} \quad (4.43)
    $$
    These correspond to spin-up and spin-down negative energy states.

### 4.6.2 General free-particle solutions
For a particle with non-zero momentum $\mathbf{p}$, the Dirac equation can be written in block matrix form:
$$
\begin{pmatrix}(E-m)I&-\sigma\cdot \mathbf{p}\\ \sigma\cdot \mathbf{p}&-(E+m)I\end{pmatrix}\begin{pmatrix}u_{A}\\ u_{B}\end{pmatrix}=0 \quad (4.44)
$$

This gives coupled equations relating the upper ($u_A$) and lower ($u_B$) components:
$$
u_{A}=\frac{\sigma\cdot \mathbf{p}}{E-m}u_{B}, \quad u_{B}=\frac{\sigma\cdot \mathbf{p}}{E+m}u_{A} \quad (4.45, 4.46)
$$

Solving these yields four independent plane wave spinors:

> **General Particle Spinors ($E>0$)**
> $$
> u_{1}=N\begin{pmatrix}1\\ 0\\ \frac{p_{z}}{E+m}\\ \frac{p_{x}+ip_{y}}{E+m}\end{pmatrix}, \quad u_{2}=N\begin{pmatrix}0\\ 1\\ \frac{p_{x}-ip_{y}}{E+m}\\ \frac{-p_{z}}{E+m}\end{pmatrix} \quad (4.48a)
> $$

> **General Negative Energy Spinors ($E<0$)**
> $$
> u_{3}=N\begin{pmatrix}\frac{p_{z}}{E-m}\\ \frac{p_{x}+ip_{y}}{E-m}\\ 1\\ 0\end{pmatrix}, \quad u_{4}=N\begin{pmatrix}\frac{p_{x}-ip_{y}}{E-m}\\ \frac{-p_{z}}{E-m}\\ 0\\ 1\end{pmatrix} \quad (4.48b)
> $$

These four solutions are independent; we cannot discard the negative energy solutions as they are required to form a complete set.

---

## 4.7 Antiparticles

### 4.7.1 The Dirac sea interpretation
Dirac originally proposed that the vacuum consists of a "sea" of fully occupied negative energy states.
* The **Pauli exclusion principle** prevents positive energy electrons from falling into the sea.
* A **hole** in the sea (absence of a negative energy electron) behaves like a particle with positive energy and positive charge—an **antiparticle** (positron).



### 4.7.2 The Feynman-Stückelberg interpretation
In modern quantum field theory, the Dirac sea picture is replaced by the **Feynman-Stückelberg interpretation**:
* Negative energy particle solutions ($E<0$) propagating backwards in time ($e^{-i(-E)(-t)}$) are mathematically equivalent to **positive energy antiparticles** propagating forwards in time.



### 4.7.3 Antiparticle spinors
To handle antiparticles conveniently, we define **antiparticle spinors $v(E,p)$** associated with physical positive energy $E$ and momentum $\mathbf{p}$.
We look for solutions of the form:
$$
\psi(x,t)=v(E,p)e^{-i(p\cdot x-Et)} \quad (4.49)
$$

Note the sign change in the exponent compared to particle solutions.

The spinor $v$ satisfies the equation $(\gamma^\mu p_\mu + m)v = 0$. The resulting solutions are:

> **Antiparticle Spinors**
> $$
> v_{1}(p)=\sqrt{E+m}\begin{pmatrix}\frac{p_{x}-ip_{y}}{E+m}\\ \frac{-p_{z}}{E+m}\\ 0\\ 1\end{pmatrix}, \quad v_{2}(p)=\sqrt{E+m}\begin{pmatrix}\frac{p_{z}}{E+m}\\ \frac{p_{x}+ip_{y}}{E+m}\\ 1\\ 0\end{pmatrix} \quad (4.52)
> $$

**Normalization:** Using $\rho = \psi^\dagger\psi = 2E$, the normalization constant is $N = \sqrt{E+m}$.

### 4.7.5 Charge conjugation
The charge conjugation operator $\hat{C}$ transforms a particle wavefunction into an antiparticle wavefunction.
Starting with the Dirac equation coupled to an electromagnetic field (via minimal substitution $\partial_\mu \to \partial_\mu + ieA_\mu$), the complex conjugate equation describes a particle of opposite charge.

The charge conjugation operator is identified as:
$$
\psi^{\prime}=\hat{C}\psi=i\gamma^{2}\psi^{*}
$$

Applying $\hat{C}$ to a particle spinor $u_1$ produces the antiparticle spinor $v_1$.

---

## 4.8 Spin and helicity states

For a general direction of motion, the spinors $u$ and $v$ are not eigenstates of the spin operator $\hat{S}_z$. It is more natural to use **helicity**, defined as the projection of spin along the direction of motion.



> **Helicity Operator**
> $$
> \hat{h} \equiv \frac{\mathbf{S}\cdot \mathbf{p}}{|\mathbf{p}|} = \frac{1}{2p}\begin{pmatrix}\mathbf{\sigma}\cdot \mathbf{p}&0\\ 0&\mathbf{\sigma}\cdot \mathbf{p}\end{pmatrix} \quad (4.60, 4.61)
> $$

The eigenvalues of helicity are $\lambda = \pm 1/2$, corresponding to **Right-Handed (RH)** and **Left-Handed (LH)** states.

By solving the eigenvalue equation $\hat{h}u = \pm \frac{1}{2}u$, we derive the helicity basis spinors:

**Particle Helicity Spinors ($u$):**
$$
u_{\uparrow}=\sqrt{E+m}\begin{pmatrix}c\\ s e^{i\phi}\\ \frac{p}{E+m}c\\ \frac{p}{E+m}s e^{i\phi}\end{pmatrix}, \quad u_{\downarrow}=\sqrt{E+m}\begin{pmatrix}-s\\ c e^{i\phi}\\ \frac{p}{E+m}s\\ -\frac{p}{E+m}c e^{i\phi}\end{pmatrix} \quad (4.65)
$$

where $c=\cos(\theta/2)$ and $s=\sin(\theta/2)$.

**Antiparticle Helicity Spinors ($v$):**
Note: The physical spin of an antiparticle is given by $\hat{S}^{(v)} = -\hat{S}$.
$$
v_{\uparrow}=\sqrt{E+m}\begin{pmatrix}\frac{p}{E+m}s\\ -\frac{p}{E+m}c e^{i\phi}\\ -s\\ c e^{i\phi}\end{pmatrix}, \quad v_{\downarrow}=\sqrt{E+m}\begin{pmatrix}\frac{p}{E+m}c\\ \frac{p}{E+m}s e^{i\phi}\\ c\\ s e^{i\phi}\end{pmatrix} \quad (4.66)
$$

**Ultra-relativistic Limit ($E \gg m$):**
In the limit $E \approx p$, the spinors simplify significantly. For example, the RH particle spinor becomes:
$$
u_{\uparrow}\approx\sqrt{E}\begin{pmatrix}c\\ s e^{i\phi}\\ c\\ s e^{i\phi}\end{pmatrix} \quad (4.67)
$$

---

## 4.9 Intrinsic parity of Dirac fermions

The parity transformation corresponds to spatial inversion: $\mathbf{x} \to -\mathbf{x}$.
The parity operator $\hat{P}$ must satisfy the Dirac equation in the transformed coordinates. It is identified as:

$$
\hat{P} = \gamma^0
$$

The **Intrinsic Parity** is defined by the action of $\hat{P}$ on a particle at rest:
* **Particles ($u$):** $\hat{P}u = \gamma^0 u = +u$ (Intrinsic parity $+1$).
* **Antiparticles ($v$):** $\hat{P}v = \gamma^0 v = -v$ (Intrinsic parity $-1$).

Thus, fermions and antifermions have opposite intrinsic parity.

---

## Summary

* **Relativistic Wave Equation:** The Dirac equation $(i\gamma^\mu\partial_\mu - m)\psi=0$ successfully combines quantum mechanics and special relativity for spin-1/2 fermions.
* **Probability:** Unlike the Klein-Gordon equation, it yields a positive-definite probability density $\rho = \psi^\dagger\psi$.
* **Spin:** It naturally predicts intrinsic spin $\mathbf{S}$ and magnetic moment $\mu$.
* **Antiparticles:** The "negative energy" solutions correspond to physical antiparticles (positrons), which are essential for the consistency of the theory.
* **Symmetries:** The equation respects Lorentz symmetry, Parity ($\mathcal{P}$), and Charge Conjugation ($\mathcal{C}$).
* **Basis States:** The free particle solutions ($u$ and $v$ spinors) provide the basis for calculating scattering cross-sections and decay rates in Quantum Electrodynamics (QED).
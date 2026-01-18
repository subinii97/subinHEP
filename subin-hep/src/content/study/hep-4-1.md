---
title: "Lecture Note 04 - Part 1: The Dirac Equation"
date: 2026-01-18
category: PP Study
---
# Lecture Note 04 - Part 1: The Dirac Equation

**Textbook:** *Modern Particle Physics* by Mark Thomson
**Chapter:** 4. The Dirac Equation (Sections 4.1 – 4.4)

This chapter introduces the Dirac equation, the relativistic formulation of quantum mechanics used to describe fundamental spin-1/2 fermions in the Standard Model.

---

## 4.1 The Klein-Gordon equation

A relativistic formulation of quantum mechanics requires a wave equation that is Lorentz invariant. The Schrödinger equation is first order in time but second order in space (derived from $E = p^2/2m$), making it non-relativistic.

To construct a relativistic equation, we start with the Einstein energy-momentum relationship:
$$
E^{2}=p^{2}+m^{2}
$$

Replacing energy and momentum with their quantum mechanical operators, $\hat{E}=i\partial/\partial t$ and $\hat{p}=-i\nabla$, yields the **Klein-Gordon equation**:

> **The Klein-Gordon Equation**
> $$
> \frac{\partial^{2}\psi}{\partial t^{2}}=\nabla^{2}\psi-m^{2}\psi \quad (4.1)
> $$

This can be expressed in a manifestly Lorentz-invariant form using the d'Alembertian operator $\partial^{\mu}\partial_{\mu} = \partial^2/\partial t^2 - \nabla^2$:

$$
(\partial^{\mu}\partial_{\mu}+m^{2})\psi=0 \quad (4.2)
$$

**Solutions and Interpretation Problems:**
Plane wave solutions $\psi(x,t)=N e^{i(p\cdot x-Et)}$ satisfy this equation provided:
$$
E^{2}=p^{2}+m^{2} \quad (4.3)
$$
This leads to two energy solutions: $E = \pm\sqrt{p^2+m^2}$. The negative energy solutions cannot be simply discarded in quantum mechanics as they are needed to form a complete set of states.

Furthermore, there is a problem with probability conservation. Following the continuity equation derivation ($\nabla \cdot j + \partial \rho / \partial t = 0$), we derive the probability density $\rho$ and current $j$ for the Klein-Gordon equation:

$$
\frac{\partial}{\partial t}\left[i\left(\psi^{*}\frac{\partial\psi}{\partial t}-\psi\frac{\partial\psi^{*}}{\partial t}\right)\right] = \nabla\cdot[-i(\psi^{*}\nabla\psi-\psi\nabla\psi^{*})] \quad (4.4)
$$

This identifies the probability density and current as:

> **Probability Density and Current (KG)**
> $$
> \rho=i\left(\psi^{*}\frac{\partial\psi}{\partial t}-\psi\frac{\partial\psi^{*}}{\partial t}\right) \quad \text{and} \quad j=-i(\psi^{*}\nabla\psi-\psi\nabla\psi^{*}) \quad (4.5)
> $$

For a plane wave, $\rho = 2|N|^2 E$. Since $E$ can be negative, this leads to **negative probability densities**, which are unphysical for a single-particle wave equation.

---

## 4.2 The Dirac equation

To solve the negative probability problem, Dirac (1928) sought a wave equation that was **first order in both space and time derivatives**.

He postulated a Hamiltonian of the form:
$$
\hat{E}\psi=(\mathbf{\alpha}\cdot\hat{\mathbf{p}}+\beta m)\psi \quad (4.6)
$$

Substituting the operators gives the **Dirac Equation**:

> **The Dirac Equation (Hamiltonian Form)**
> $$
> i\frac{\partial\psi}{\partial t} = \left(-i\alpha_{x}\frac{\partial}{\partial x}-i\alpha_{y}\frac{\partial}{\partial y}-i\alpha_{z}\frac{\partial}{\partial z}+\beta m\right)\psi \quad (4.7)
> $$

**Constraints on $\alpha$ and $\beta$:**
For this to describe a relativistic particle, the solutions must also satisfy the energy-momentum relation $E^2 = p^2 + m^2$, meaning they must satisfy the Klein-Gordon equation. "Squaring" the Dirac equation (applying the operator twice) gives a second-order equation. Comparing this to the Klein-Gordon equation imposes strict conditions on the coefficients $\alpha_i$ and $\beta$:

1.  **Normalization:**
    $$
    \alpha_{x}^{2}=\alpha_{y}^{2}=\alpha_{z}^{2}=\beta^{2}=I \quad (4.9)
    $$
2.  **Anti-commutation:**
    $$
    \alpha_{j}\beta+\beta\alpha_{j}=0 \quad (4.10)
    $$
    $$
    \alpha_{j}\alpha_{k}+\alpha_{k}\alpha_{j}=0 \quad (j\ne k) \quad (4.11)
    $$

**Implications:**
* $\alpha_i$ and $\beta$ cannot be ordinary numbers; they must be **matrices**.
* They must be **trace zero** and have eigenvalues of $\pm 1$.
* The dimension of the matrices must be even; the smallest dimension satisfying these properties is **$4\times 4$**.
* Consequently, the wavefunction $\psi$ must be a **four-component spinor** (Dirac spinor).
* To ensure the Hamiltonian is Hermitian (real eigenvalues), the matrices must be Hermitian:
    $$
    \alpha_{i}=\alpha_{i}^{\dagger} \quad \text{and} \quad \beta=\beta^{\dagger} \quad (4.12)
    $$

**The Dirac-Pauli Representation:**
A common choice for the matrices is:
$$
\beta=\begin{pmatrix}I&0\\ 0&-I\end{pmatrix}, \quad \alpha_{i}=\begin{pmatrix}0&\sigma_{i}\\ \sigma_{i}&0\end{pmatrix} \quad (4.13)
$$
where $\sigma_i$ are the $2\times 2$ Pauli spin-matrices and $I$ is the $2\times 2$ identity.

---

## 4.3 Probability density and probability current

We derive the probability density for the Dirac equation using the same continuity method.
The Hermitian conjugate of the Dirac equation is:
$$
-i\frac{\partial\psi^{\dagger}}{\partial t} = \psi^{\dagger}(-i\alpha_{x}^{\dagger}\overset{\leftarrow}{\partial_x}\dots + \beta^{\dagger}m) \quad \Rightarrow \quad \text{Eq}~(4.15)
$$

Combining the Dirac equation and its conjugate leads to the continuity equation:
$$
\frac{\partial(\psi^{\dagger}\psi)}{\partial t} + \nabla\cdot(\psi^{\dagger}\mathbf{\alpha}\psi)=0 \quad (4.16)
$$

This identifies the **Probability Density** and **Current**:

> **Dirac Probability Density and Current**
> $$
> \rho=\psi^{\dagger}\psi \quad \text{and} \quad \mathbf{j}=\psi^{\dagger}\mathbf{\alpha}\psi \quad (4.17)
> $$

Crucially, the probability density is a sum of absolute squares, $\rho = \sum |\psi_i|^2$, which is **always positive definite**. This solves the problem of negative probabilities found in the Klein-Gordon equation.

---

## 4.4 *Spin and the Dirac equation

Remarkably, the Dirac equation naturally describes the intrinsic spin of particles.
In quantum mechanics, an observable $\hat{O}$ is conserved if it commutes with the Hamiltonian, $[\hat{H}, \hat{O}] = 0$.

**Orbital Angular Momentum ($\hat{\mathbf{L}}$):**
For the Dirac Hamiltonian $\hat{H}_D = \mathbf{\alpha}\cdot\hat{\mathbf{p}} + \beta m$, the orbital angular momentum $\hat{\mathbf{L}} = \hat{\mathbf{r}} \times \hat{\mathbf{p}}$ is **not conserved**:
$$
[\hat{H}_{D},\hat{\mathbf{L}}]=-i\mathbf{\alpha}\times\hat{\mathbf{p}} \quad (4.21)
$$

**Spin Operator ($\hat{\mathbf{S}}$):**
We define a $4\times 4$ spin operator $\hat{\mathbf{S}}$ using the Pauli matrices:
$$
\hat{\mathbf{S}} \equiv \frac{1}{2}\mathbf{\Sigma} \equiv \frac{1}{2}\begin{pmatrix}\mathbf{\sigma}&0\\ 0&\mathbf{\sigma}\end{pmatrix} \quad (4.22)
$$

Evaluating the commutator with the Hamiltonian involves the relations $[\alpha_i, \Sigma_j]$. For example:
$$
[\alpha_{y},\Sigma_{x}]=-2i\alpha_{z}, \quad [\alpha_{z},\Sigma_{x}]=2i\alpha_{y} \quad (4.25, 4.26)
$$

This leads to the result:
$$
[\hat{H}_{D},\hat{\mathbf{S}}]=i\mathbf{\alpha}\times\hat{\mathbf{p}} \quad (4.28)
$$

**Total Angular Momentum ($\hat{\mathbf{J}}$):**
Comparing (4.21) and (4.28), we see that the **Total Angular Momentum** $\hat{\mathbf{J}} = \hat{\mathbf{L}} + \hat{\mathbf{S}}$ commutes with the Hamiltonian:
$$
[\hat{H}_{D},\hat{\mathbf{L}}+\hat{\mathbf{S}}]=0
$$

This implies that the particle possesses an intrinsic angular momentum (spin). The eigenvalues of $\hat{S}^2$ are $s(s+1)$ where $s=1/2$, proving that the Dirac equation describes **spin-1/2 particles**.

The intrinsic magnetic moment operator is derived as:
$$
\hat{\mu}=\frac{q}{m}\hat{\mathbf{S}} \quad (4.30)
$$
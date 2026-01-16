---
title: HEP - Lecture 02 - Part 2. Non-Relativistic Quantum Mechanics
date: 2026-01-16
category: PP Study
---
# Lecture Note 02 - Part 2: Non-Relativistic Quantum Mechanics

**Textbook:** *Modern Particle Physics* by Mark Thomson
**Chapter:** 2. Underlying Concepts (Section 2.3)

---

## 2.3 Non-relativistic quantum mechanics

This section establishes the quantum mechanical formalism required for the Standard Model, strictly following the textbook's structure.

### 2.3.1 Wave mechanics and the Schrödinger equation
A free particle of mass $m$, momentum $\vec{p}$, and energy $E$ is described by the plane wave wavefunction:
$$
\psi(\vec{x}, t) = N e^{i(\vec{p}\cdot\vec{x} - Et)}
$$
The physical observables correspond to operators:
* **Momentum:** $\hat{\vec{p}} = -i\nabla$ 
* **Energy:** $\hat{E} = i\frac{\partial}{\partial t}$ 

Using the non-relativistic energy relation $E = p^2/2m + V$, we obtain the **Time-Dependent Schrödinger Equation (TDSE)**:
$$
i \frac{\partial \psi}{\partial t} = \hat{H} \psi = \left( -\frac{\nabla^2}{2m} + \hat{V} \right) \psi
$$

### 2.3.2 Probability density and probability current
We distinguish between the static probability of finding a particle and the dynamic flow of that probability.

**1. Probability Density ($\rho$):**
$$
\rho = \psi^* \psi = |\psi|^2
$$
This represents the probability of finding the particle per unit volume.

**2. Probability Current Density ($\vec{j}$):**
To satisfy the continuity equation $\frac{\partial \rho}{\partial t} + \nabla \cdot \vec{j} = 0$, the probability current is defined as:
$$
\vec{j} = -\frac{i}{2m} \left( \psi^* \nabla \psi - \psi \nabla \psi^* \right)
$$
For a plane wave, this gives the expected classical result $j = \rho v$.

### 2.3.3 Time dependence and conserved quantities
The expectation value of an observable $A$ evolves according to:
$$
\frac{d\langle \hat{A} \rangle}{dt} = i \langle [\hat{H}, \hat{A}] \rangle
$$
* If an operator commutes with the Hamiltonian ($[\hat{H}, \hat{A}] = 0$), the observable is a **constant of motion** (conserved quantity).
* Eigenstates of the Hamiltonian are **stationary states**; their expectation values do not change with time.

### 2.3.4 Commutation relations and compatible observables
* **Compatible Observables:** If $[\hat{A}, \hat{B}] = 0$, the operators share a complete set of simultaneous eigenstates.
* **Incompatible Observables:** If $[\hat{A}, \hat{B}] \neq 0$, they cannot be simultaneously determined with arbitrary precision, obeying the generalized uncertainty principle.

### 2.3.5 Angular momentum in quantum mechanics
Angular momentum components satisfy the commutation relations:
$$
[\hat{L}_x, \hat{L}_y] = i\hat{L}_z, \quad [\hat{L}_y, \hat{L}_z] = i\hat{L}_x, \quad [\hat{L}_z, \hat{L}_x] = i\hat{L}_y
$$
Since $\hat{L}^2$ commutes with all components ($[\hat{L}^2, \hat{L}_i] = 0$), we characterize states by simultaneous eigenstates of $\hat{L}^2$ and $\hat{L}_z$, denoted $|l, m\rangle$.

**Ladder Operators ($\hat{L}_\pm$):**
Defined as $\hat{L}_\pm = \hat{L}_x \pm i\hat{L}_y$.
From the commutation relation $[\hat{L}_z, \hat{L}_\pm] = \pm \hat{L}_\pm$, we see that $\hat{L}_\pm$ acts on an eigenstate to change its $m$ value by $\pm 1$:
$$
\hat{L}_\pm |l, m\rangle = \sqrt{l(l+1) - m(m\pm 1)} |l, m\pm 1\rangle
$$


### 2.3.6 Fermi's golden rule
We calculate the rate of transition from an initial state $|i\rangle$ to a final state $|f\rangle$ due to a perturbing potential $\hat{H}'(\vec{x}, t)$.

**1. Perturbation Expansion:**
The Hamiltonian is $\hat{H} = \hat{H}_0 + \hat{H}'$. We expand the wavefunction in the basis of unperturbed eigenstates $\phi_k$:
$$
\psi(\vec{x}, t) = \sum_k c_k(t) \phi_k(\vec{x}) e^{-iE_k t}
$$
Substituting this into the TDSE gives the differential equation for the coefficients:
$$
i \sum_k \frac{dc_k}{dt} \phi_k e^{-iE_k t} = \sum_k \hat{H}' c_k(t) \phi_k e^{-iE_k t}
$$

**2. First-Order Approximation:**
At $t=0$, the system is in state $i$ ($c_i=1$, others 0). For small $t$, we approximate $c_i(t) \approx 1$ and $c_{k \neq i} \approx 0$.
Multiplying by $\phi_f^*$ and integrating leads to:
$$
\frac{dc_f}{dt} = -i \langle f | \hat{H}' | i \rangle e^{i(E_f - E_i)t}
$$
Integrating gives the coefficient at time $T$:
$$
c_f(T) = -i T_{fi} \int_0^T e^{i(E_f - E_i)t} dt = -i T_{fi} \frac{e^{i(E_f - E_i)T} - 1}{i(E_f - E_i)}
$$
where $T_{fi} = \langle f | \hat{H}' | i \rangle$ is the matrix element.

**3. Second-Order Approximation (Improved $T_{fi}$):**
An improved approximation is obtained by substituting the first-order expression for $c_{k \neq i}(t)$ back into the master equation (2.42). This gives:
$$
\frac{dc_f}{dt} \approx -i \langle f | \hat{H} | i \rangle e^{i(E_f - E_i)t} + (-i)^2 \sum_{k \neq i} \langle f | \hat{H}' | k \rangle e^{i(E_f - E_k)t} \int_0^t \langle k | \hat{H}' | i \rangle e^{i(E_k - E_i)t'} dt'
$$
Performing the integral and simplifying, we find that the transition corresponds to an effective matrix element $T_{fi}$ that includes intermediate states $|k\rangle$:

$$
T_{fi} = \langle f | \hat{H}' | i \rangle + \sum_{k \neq i} \frac{\langle f | \hat{H}' | k \rangle \langle k | \hat{H}' | i \rangle}{E_i - E_k}
$$


The second term represents the transition occurring via an intermediate state $|k\rangle$.

**4. Transition Probability:**
$$
P_{fi} = |c_f(T)|^2 = |T_{fi}|^2 \frac{\sin^2((E_f - E_i)T/2)}{((E_f - E_i)/2)^2}
$$


**5. The Continuum of States (Density of States):**
In particle physics, final states usually form a **continuum**. We replace the single final state with an integral over the energy $E_f$, weighted by the **density of states $\rho(E_f)$**.
Using the representation of the delta function $\lim_{T\to\infty} \frac{\sin^2(xT/2)}{x^2} = \pi T \delta(x)$:
$$
P(T) = \int |T_{fi}|^2 (2\pi T \delta(E_f - E_i)) \rho(E_f) dE_f
$$


**6. Transition Rate ($\Gamma$):**
The rate is $\Gamma = P(T)/T$. The integration removes the delta function, setting $E_f = E_i$.
Thus, **Fermi's Golden Rule** is:

$$
\Gamma_{fi} = 2\pi |T_{fi}|^2 \rho(E_i)
$$

---

## Summary
* **Current:** $\vec{j} = -\frac{i}{2m}(\psi^*\nabla\psi - \psi\nabla\psi^*)$ describes probability flow.
* **Commutators:** $[\hat{L}_i, \hat{L}_j] = i\epsilon_{ijk}\hat{L}_k$ defines angular momentum algebra.
* **Ladder Operators:** Used to construct the spectrum of angular momentum states.
* **Fermi's Golden Rule:** $\Gamma = 2\pi |T_{fi}|^2 \rho(E_i)$ connects the theoretical transition matrix element $T_{fi}$ to the experimental transition rate.
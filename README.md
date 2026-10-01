# SolidMotion3D

Interactive 3D rigid-body mechanics laboratory.

SolidMotion3D visualizes the kinematics of a rigid solid with six degrees of freedom, including translation, fixed-axis rotation, general motion and Euler-angle rotations.

## Current features

* Interactive 3D rigid body and reference frame
* Translation controls
* Euler angles ψ, θ and φ
* Precession, nutation and proper-rotation labels
* Body and reference coordinate frames
* Point trajectory visualization
* Velocity-vector visualization
* Nodal-line visualization
* Rolling demonstration
* Responsive dark scientific interface
* Zero build step: deploy directly with GitHub Pages

## Mechanics model

The project is based on the supplied rigid-body mechanics course. The course describes complete spatial position using three translational variables and three rotational variables, and defines Euler angles for the orientation of the solid frame. It also describes the decomposition of motion into translation, pivoting and rolling.

The visualization uses the Euler sequence concept represented by the course: precession ψ, nutation θ and proper rotation φ.

## Run

Open `index.html` locally or enable GitHub Pages for the repository.

## Roadmap

* Exact symbolic kinematics
* Live angular-velocity decomposition
* Acceleration field
* Instantaneous screw axis
* Rolling without slipping constraints
* Disk, sphere and cylinder bodies
* Numerical integration of prescribed angular velocity
* Exportable experiments

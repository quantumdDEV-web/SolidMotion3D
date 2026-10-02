# SolidMotion3D

**SolidMotion3D Scientific Mechanics Laboratory** is an interactive browser based laboratory for studying rigid body kinematics, reference frames, translation and rotation.

## Laboratory interface

The upgraded interface is organized like a scientific instrument:

• Experiment panel for controlling the motion protocol  
• Analysis panel for live kinematic measurements  
• Theory panel for reference frames and Euler angle concepts  
• 3D laboratory viewport with orbit and zoom controls  
• Instrument strip with live position, orientation and frame information  
• Sensor overlays for trajectories, body axes, velocity and nodal line  

## Motion protocols

**General spatial motion** combines translation and orientation changes.

**Pure translation** moves the rigid body without changing its orientation.

**Fixed axis rotation** continuously changes the precession angle.

**Euler angle motion** varies ψ, θ and φ to demonstrate coupled orientation changes.

**Rolling motion** demonstrates translation coupled with rotation.

## Euler convention

The interface presents the orientation using the sequence

R = Rz(ψ) · Ry(θ) · Rx(φ)

where ψ is precession, θ is nutation and φ is proper rotation.

## Kinematics

For a point P attached to a rigid solid:

V(P) = V(Oₛ) + Ω × OₛP

and the angular velocity is represented conceptually as

Ω = ψ̇ k₀ + θ̇ u + φ̇ kₛ

The numerical animation values are intended for visualization and experimentation rather than as a symbolic mechanics solver.

## Run

Open `index.html` or deploy the repository with GitHub Pages. The application uses Three.js from a CDN and requires no build system.

## Roadmap

• Exact rotation matrix panel  
• Acceleration field visualization  
• Instantaneous screw axis  
• Torseur integration  
• Rolling without slipping constraints  
• Disk, sphere and cylinder bodies  
• Numerical integration of prescribed angular velocity  
• Experiment recording and export

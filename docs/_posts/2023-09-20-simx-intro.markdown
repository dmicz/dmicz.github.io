---
layout: post
title:  "SimX Devblog 1: Project Introduction"
date:   2023-09-20
category: simx
---

In case you haven't read the [last post](/simx/2023/09/13/simx-revisit), the following project is inspired by my previous work on a basic physics simulator.

## Project Goals 

There are a couple of key areas I want the final product to touch on, listed in somewhat-increasing complexity below:
- Particle simulation
- Rigid body simulation
- Fluid simulation
- Sound effects
- Performance optimization

## Development Environment

![](/assets/img/simx-devenv1.png)
*My development environment in Visual Studio*

### Visual Studio and C++

Currently I am planning on using **Visual Studio** to edit the C++ codebase, as I'm most familiar with it. Visual Studio is an excellent IDE for C++ projects, providing a wide range of tools and integrations while remaining user friendly. Visual Studio requires a bit of setup when integrating it with Git/Github and dependencies such as SDL, but is manageable with some guidance.

### SDL2

[Simple DirectMedia Layer 2](https://www.libsdl.org/) (SDL2) is my choice of development library for creating user graphics in this project. Although Qt and SFML are other reasonable alternatives, I find SDL2 to be closer to hardware and superior when it comes to licensing, cross-platform support, and robustness. I also prefer the C-like nature of SDL2 over the C++ implemented SFML. :)

![](/assets/img/simx-devenv2.png)
*Linking SDL2 with Visual Studio*

Using SDL2 with Visual Studio requires linking the libraries and include files of SDL2 with the VS project, but I'm avoiding filling my GitHub repo with dependencies at this moment. If you would like to clone the repository and are struggling to link the libraries, [lazyfoo's tutorials](https://lazyfoo.net/tutorials/SDL/index.php) are a great resource.

## Future blog plans

Between my academic and extracurricular responsibilities, I may have trouble finding the time to develop my project and, by extension, time to write my blog.

That being said, I'm aiming for a goal of publishing new content every week, but I am hoping to release more infrequent and polished posts that more effectively outlines the features I am adding as a whole. I have a few more [projects](/projects/) in the back of mind to pursue after this that I also hope to write about in this blog. Stay tuned!
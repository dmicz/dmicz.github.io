---
layout: post
title:  "SimX Revival"
date:   2023-09-13
category: simx
---

Welcome to my first devblog! I'm going to be revisiting a project I started working on in high school titled **SimX**, which was intended to be a simple, general purpose 2D physics simulator. I mostly wrote it after my first semester in AP Physics, as an attempt to get back into programming with C++ and review some physics concepts.

# Revisiting old code

To my surprise, the project started without error after downloading the dependencies on my laptop:


![SimX demo screenshot](/assets/img/simx-demo1.png)

The project currently contains brilliantly written pieces of code, such as the following to detect block collision:

{% highlight cpp %}
for (int i = 0; i < _blocks.size(); i++) {
  bool xCollide = false, yCollide = false;
  if ((x.x > _blocks[i].x && x.x < (_blocks[i].x + _blocks[i].size)) ||
    ((x.x + x.size) > _blocks[i].x && (x.x + x.size) < (_blocks[i].x + _blocks[i].size)) ||
    (x.size == _blocks[i].size && x.x == _blocks[i].x)) {
    xCollide = true;
  }

  if ((x.y > _blocks[i].y && x.y < (_blocks[i].y + _blocks[i].size)) ||
    ((x.y + x.size) > _blocks[i].y && (x.y + x.size) < (_blocks[i].y + _blocks[i].size)) ||
    (x.size == _blocks[i].size && x.y == _blocks[i].y)) {
    yCollide = true;
  }

  if (xCollide && yCollide) {
    return false;
  }
}
{% endhighlight %}

...and some more to run the simulation at a given rate:

{% highlight cpp %}
void PhysicsScene::RunForSeconds(double secondsToRun, double deltaTSeconds)
{
	for (int s = 0; s < secondsToRun / deltaTSeconds; s++) {
		for (int i = 0; i < _blocks.size(); i++) {
			_blocks[i].velocity += _blocks[i].force * deltaTSeconds;
			_blocks[i].x -= _blocks[i].velocity.x * deltaTSeconds;
			_blocks[i].y -= _blocks[i].velocity.y * deltaTSeconds;
			_blocks[i].x = std::max(0.0, std::min(static_cast<double>(_xMax) - _blocks[i].size, _blocks[i].x));
			_blocks[i].y = std::min(static_cast<double>(_floorY) - _blocks[i].size, _blocks[i].y);
			for (int j = 0; j < _blocks.size(); j++) {
				if (i != j) {
					if ((_blocks[i].x + _blocks[i].size) > _blocks[j].x && _blocks[i].x < (_blocks[j].x + _blocks[j].size) && _blocks[i].y < _blocks[j].y && (_blocks[i].y + _blocks[i].size) >= _blocks[j].y) {
						_blocks[i].y = _blocks[j].y - _blocks[i].size;
					}
				}
			}
		}
	}
}
{% endhighlight %}

# Future plans

As of right now, the program only allows the user to drop blocks using their cursor, calculating acceleration on the block from gravity and stopping the block from going through another block (without the use of normal forces??).

The blocks do not rotate off of each other and the simulation isn't nearly as accurate as I'd like it to be, so I will be working on bringing the codebase up to par. Feel free to check out the current code at the [project's github page](https://github.com/dmicz/SimX/).
---
layout: post
title:  "Neural Network Digit Recognition: Part 2"
date:   2023-11-28
category: machine-learning
image: /assets/img/NNDK-visualstudiodebug1.png
---

I've been working on and off with the my [digit recognition project](/machine-learning/neural-networks-1) between other machine learning coursework, and am pleased to share my new developments on this project. For the full source code, please visit my [GitHub repo](https://github.com/dmicz/NNDigitKit).

## Code refactoring

### Minor issues

The program I wrote was alright for my first program in C, but it needed work to become readable. I think the most beautiful thing about procedural languages like C is the ease with which code can be refactored, without having to worry about several layers of abstraction or redesigning an entire program to fit a new feature. I'm a fan of [Eskil Steenberg's talk](https://www.youtube.com/watch?v=443UNeGrFoM) on his style of C, and strove to emulate it in my program. First things first, I fixed a memory leak that has been bugging me since posting the last blog:

```c
for (int j = 0; j < layer_count - 1; j++) {
    free_vector(z_vectors[j]);
    apply_vector_binary_operation(nabla_biases[j], delta_nabla_biases[j], &add_vectors);
    apply_matrix_binary_operation(nabla_weights[j], delta_nabla_weights[j], &add_vectors);
    free_vector(delta_nabla_biases[j]);
    free_matrix(delta_nabla_weights[j]);
    if(j>0)	free_vector(activations[j]); // leak! (frees 1 to layer_count - 2)
    free_vector(activations[j + 1]); // good! (frees 1 to layer_count - 1)
}
```

Thankfully this was easy to solve with the help of Visual Studio's debugger: the heap snapshots showed `vector_unary_operation` creating leaky allocations, which was only used to create the `activations` vectors and the `sp` vector (which was properly freed). After some thinking about indices and a few write access exceptions later, the program is leak free. Another tricky problem:

```c
float sigmoid_prime(const float z) {
    // bad!
    float ez = exp(-z);
	return ez / ((1 + ez) * (1 + ez));

    // good
	return sigmoid(z) * (1 - sigmoid(z));
}
```

This time, an "optimization" combined with the usage of single precision over double precision floats (covered later) resulted in a significant problem with training my neural network: nearly any model would quickly have gradients explode or vanish, leading to `nan` parameters and a breakdown of the model. After looking through my code, I settled on the problem being a result of the `sigmoid_prime` function, and regarded the float division with suspicion. Replacing what I thought was an optimized function with a different version turned out to be the culprit. Mathematically, the functions are identical, but for large negative floats, `ez` approaches large values, and when multiplied together in the denominator, create `inf` values. This isn't problematic on its own, but when combined with a large numerator, the operation often returns `nan`, resulting in a network breakdown as the result propogates back.

As for the optimization part, I believed that the top version ran faster than the bottom one, because there are fewer function calls and therefore float divisions. Although Visual Studio's assembly in the debug configuration shows this to be true, the release configuration replaces both `sigmoid` and `sigmoid_prime` with inline calculations, making the difference in performance negligble.

### Code style

```c
// old
double add_vectors(double a, double b);
double subtract_vectors(double a, double b);
double hadamard_product_vectors(double a, double b);
double negate_vector(double a);
double zero_vector(double a);
double random_init_vector(double a);

// new
float func_add_floats(float a, float b);
float func_subtract_floats(float a, float b);
float func_hadamard_product(float a, float b);
float func_negate_float(float a);
float func_zero_float(float a);
float func_std_norm_dist(float a);
```

Here, I use `func_` to make it clear that these functions are designed to be function pointers for the `vector_unary_operation` functions. `random_init_vector` is a pretty unclear name, especially when it has a single double parameter and returns a double. For clarification, here is how this looks like in context:

```c
vector_apply_binary_operation(delta_nabla_biases[k - 1], sp, &func_hadamard_product);
```

```c
// old
struct Vector create_vector(int length);
void free_vector(struct Vector vector);
struct Vector vector_binary_operation(const struct Vector vector1, const struct Vector vector2, binary_operation operator);
struct Vector vector_unary_operation(const struct Vector vector, unary_operation operator);
void apply_vector_binary_operation(struct Vector vector1, const struct Vector vector2, binary_operation operator);
void apply_vector_unary_operation(struct Vector vector, unary_operation operator);

// new
struct Vector vector_create(int length);
void vector_free(struct Vector vector);
struct Vector vector_binary_operation(const struct Vector vector1, const struct Vector vector2, binary_operation operator);
struct Vector vector_unary_operation(const struct Vector vector, unary_operation operator);
void vector_apply_binary_operation(struct Vector vector1, const struct Vector vector2, binary_operation operator);
void vector_apply_unary_operation(struct Vector vector, unary_operation operator);
```

Another change in notation I used for functions for the `Vector` and `Matrix` structs is making the function struct a prefix of the function. I think doing this is much clearer and even makes writing future code easier as line completion will only suggest functions acting on vectors once vector is typed.

### New structs

One of the more important issues I mentioned in the last blog was with the `sgd` function. Here is how the function prototype changed:

```c
// old
void sgd(struct Matrix* weights, struct Vector* biases,
	const struct Vector* training_images, const char* training_labels,
	const struct Vector* test_images, const char* test_labels, const int test_size,
	const int training_size, const int minibatch_size, const int epochs,
	const int layer_count, const float learning_rate);

// new
void sgd(struct MultilayerPerceptron model, const struct LabeledData training_data,
	const struct LabeledData testing_data, const int minibatch_size,
	const int epochs, const float learning_rate);
```

All of the information for the neural network has been packed into a `struct MultilayerPerceptron` and the image data, labels, and size have been packed into `struct LabeledData`s. I'm considering making a similar struct for hyperparameters once the number of them increases, but I think the three there currently are aren't enough to justify this change yet. Here are the new structs:

```c
struct MultilayerPerceptron {
	struct Matrix* weights;
	struct Vector* biases;
	int* layer_sizes;
	int layer_count;
};

struct MultilayerPerceptron multilayerperceptron_create(int layer_count, int* layer_sizes);
void multilayerperceptron_free(struct MultilayerPerceptron* mlp);

struct LabeledData {
	struct Vector* images;
	char* labels;
	int size;
};

struct LabeledData read_labeled_image_files(const char* image_file_name, const char* label_file_name);
void free_labeled_data(struct LabeledData data);
```

The training/testing data reading functions have been modified into a single function, and the new struct made it easy to write new functions to save/load models. For now, I just save the models by dumping the binary contents of a `struct MultilayerPerceptron` and read it back by using the layer sizes to get the matrix/vector sizes.

## Performance

One thing that is particularly lacking compared to modern neural networks is performance. Training a model with layer sizes [784, 100, 10] for 30 epochs takes about 5 minutes on my machine in release configuration, and the program can definitely make use of parallel computing. However, rather than implementing hardware acceleration using something like OpenCL or multithreading using OpenMP, I will likely look towards using a library like TensorFlow as an alternative to my current models. The main goal of this project is to learn about the implementation of neural networks, and I think that is best done by making the functions I've programmed so far, but this doesn't yield anything particularly fast. By later adding a toggle between my programmed model and TensorFlow models, I'll be able to later tinker with the hyperparameters quickly as the neural network trains much faster. I'll also be less overwhelmed when it comes to multithreading later as I let the user interface with the model in the GUI while its training.

Another concern is space performance. With the use of double precision float variables (`double`), there is an imperceptible difference in model performance at the cost of nearly double the memory usage. Most of the memory usage results from storage of the training/testing data, which is ~300 MB when stored as `float`s. Regardless, I've switched from using `double` to using `float` across the entire program to use less memory.

## GUI

I added a GUI thanks to GLFW, glad, Cimgui, and Dear Imgui. Currently the GUI is only used to configure the neural network before the program closes it and provides feedback through the CLI. I will be working on improving this soon and allowing for interactions through the GUI. Dear Imgui/Cimgui makes making a GUI very simple:

```c
igText("Random seeding");
igInputInt("Seed", &seed, NULL, NULL, NULL);
if (igButton("Use time()", (struct ImVec2) { 0, 0 })) {
    seed = time(NULL);
}
igSeparator();
```

In the above example I'm able to tie a text input box for `int`s to the `seed` variable, in addition to creating a button to set `seed` to the current Unix timestamp if pressed. 

```c
if (igInputInt("Epochs", &epochs, NULL, NULL, ImGuiInputTextFlags_None)) {
    if (epochs < 1) epochs = 1;
    else if (epochs > 100) epochs = 100;
}
```

I am also able to clamp values if user inputs are invalid easily (GUI element functions return true when changed).

Cimgui is very powerful, and I'm excited to expand on the GUI in the future.

## Future features

I'm excited with the way this project is going and am looking forward to add plenty of new features. As mentioned before, I'm looking towards further optimizing the performance of the program through other machine learning libraries to allow for much faster training. 

I also am looking forward to finishing [Michael Nielsen's book](http://neuralnetworksanddeeplearning.com/) on neural networks and implementing the features mentioned, including dropout, cross-entropy loss, regularization, and various activation functions.

Perhaps most importantly, I'd like to work on implementing multithreading to allow for live interactions between the GUI while training, as well as introducing some form of interpretability/inspection of the models. Ideally I will add a few more models, likely CNNs and RNNs, as well as some latent space visualization. Maybe I will be working on something more interesting before that time. ;)
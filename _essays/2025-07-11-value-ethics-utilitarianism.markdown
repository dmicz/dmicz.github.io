---
layout: post
title: "Virtue Ethics is Just Compressed Utilitarianism"
date:   2025-07-11
---

*Opinions or views expressed are solely my own.*

## The Ethics Mismatch

Consider a Jehovah's Witness patient bleeding out after surgery. They refuse a blood transfusion that would save their life, citing religious beliefs. Do you honor their autonomy or override it to preserve life? Your answer reveals whether you lean towards virtue ethics or utilitarianism, two frameworks that seem to offer fundamentally different moral guidance.

Ethics debates are often framed as tensions between utilitarianism and virtue ethics. Some basic definitions for the uninitiated:
- **Utilitarianism:** The ethics of actions based on their consequences, specifically aiming to maximize well-being for the greatest number of people.
- **Virtue Ethics:** The ethics of actions based on character (like honesty, compassion) rather than by rules or consequences.

The core tension in many debates is between taking a utility-maximizing action vs. principle-based abstention.

When utility-maximizing, you override their refusal, save the life, maximize QALYs (quality-adjusted life years). The virtue ethics response emphasizes respecting autonomy and informed consent, even unto death.

However, overriding patient autonomy erodes trust in medical institutions, making other patients less likely to seek care. It signals to religious communities that their beliefs aren't respected, potentially driving them away from healthcare entirely. It sets a precedent that medical professionals can ignore consent when they disagree with patient values. The second-order effects of routinely overriding autonomy likely cost more lives than they save.

The real question is, what's underpinning virtue ethics that isn't captured by the utilitarian view? Why does something that is seemingly obvious (maximizing utility) result in such disparate conclusions from what good character dictates?

Before diving into abstraction, let's look at a deal that raises the stakes.

## Case Study: The Serial Killer Deal

Here's a more extreme case that pushes the ethical mismatch to the edge.

Suppose a police department is investigating and made contact with a serial killer. The killer proposes a deal: if the department publicly announces it has struck a deal with him, and agrees not to pursue charges, he will stop killing immediately.

The utilitarian calculation is straightforward:
- Lives will be saved.
- Immediate harm of endorsing a "deal with the devil" is minimal compared to the cost of lives.
- Some odds that killer is lying, still minimal harm.

Meanwhile, virtue ethics would reject the deal outright:
- It violates integrity.
- It undermines justice.
- "You don't negotiate with terrorists."

This is where people will think the frameworks diverge. But here's the issue: **virtue ethics doesn't contradict utilitarianism, it encodes higher-order effects.**

By refusing the deal, the police:
- Maintain public trust in law enforcement.
- Prevent a norm where criminals are able to manipulate the justice system.
- Preserve a long-term deterrent mechanism, which likely is preventing more harm in the future.
- Avoid demoralizing the victims' families and the broader community.

So the refusal *still* maximizes utility, just not in a short term, greedy way. It's second order utility, hidden inside of cultural concepts such as "character" and "integrity." Virtue ethics isn't some divine rulebook. It's a compressed and legible moral shortcut for outcomes that are difficult to model explicitly. It's a heuristic for decision making, not a foundation.

### Utility Example

Let's try quantifying the "deal with the devil." In our example, the serial killer will kill 10 people if the deal is not taken.

**Direct effect:** the killer promises to spare $L=10$ lives.

**Second-order risk:** public capitulation raises the probability $p$ that any of the country's $N=200$ high-risk offenders (rough estimate) tries the same stunt the next year. Let's peg that imitation rate to at least $p=0.5\%$ (copy-cat phenomena). In reality, about 20-30% of mass killings within a decade are inspired by media coverage of past incidents. Let's say each such copy-cat spree averages around $\mu=5$ additional murders (median victim count in mass murders is usually 3-10).

Expected future deaths in year 1:

$$
    D_1 = pN\mu = 0.005\times 200\times 5=5
$$

Trust and deterrence effects compound, so assume imitation due to eroding social trust grows at $g=3\%$ annually (conservative). Discount future years with a [social discount](https://cales.arizona.edu/classes/rnr485/ch6.htm) rate of $r=4\%$.

Then, the total second order-deaths over $T=20$ years:

$$
    D_{\text{2nd}}=\sum_{t=1}^T\frac{D_1(1+g)^{t-1}}{(1+r)^t}\approx 5\times\sum_{t=1}^{20}\left(\frac{1.03}{1.04}\right)^{t-1}\approx 91
$$

Net lives from taking the deal:

$$
    \text{Net}=L-D_{\text{2nd}}=10-91=-81
$$

Even when halving imitation rate, offender pool, growth, doubling the discount rate, second-order harms always swamp the 10 lives saved. Swapping in whatever local values you have, the structure always forces you to reckon with the cascading costs of broken norms.

The calculation reveals something profound: the virtue ethics institution to "never negotiate with terrorists" isn't some mystical moral law. It's a compressed algorithm that captures complex utility calculations that most humans can't perform in real-time. "Character based" decisions turn out to be the utility maximizing ones after all.

## The Hidden Utility of Values

In the end, values and virtue ethics evolved as compression algorithms on the nth order effects for complex utility calculations. Ideas like "don't lie" and "don't negotiate with terrorists" don't contradict utility, they are long term utility in the form of maintaining trust and boosting coordination in society. They are a lossy form of compression, but ideal for decision-making in bounded-rational agents (AKA faulty humans).

Some examples of compression:
- **Torture is always wrong, even if it could extract information that saves lives.** Virtue ethics says that the action is inherently evil. This encodes the long-term cost of degrading institutional legitimacy, encourages global norm erosion, invites reciprocal abuse, and invites false confessions. The cost is usually far greater than any short-term gain.
- **Staying loyal to [insert group] even when it is irrational (eg. covering for mistakes) is noble under virtue ethics.** This is also utility in disguise, with loyalty sustaining high-trust groups, which increases coordination, which boosts survival and long-term prosperity. Acts of loyalty can send strong (but costly) signals that enable durable cooperation and future gains.
- **You shouldn't act in ways that betray your core self, even if it's "better" for others (eg. lying to protect feelings).** Long-term self-betrayal breaks your internal predictive model, which increases anxiety, which degrades confidence and social clarity. It also hits your reputation and lowers trust from others. Again, integrity is proxy for a healthy self-model that encourages future coordination and mental health. It becomes an accurate model for fourth order effects.

Any value that persists in cultures over time *must* have had some fitness advantage, either replicative or survival-based. Virtue ethics are cached computations of these values, for noisy and uncertain environments. The only reason these seem ethically superior to pure utilitarianism is that we've forgotten the original rationale and are missing the bigger picture.

## Why We Can't Stop at Heuristics

The compression theory doesn't just explain virtue ethics, it reveals why we need to move beyond it.

**Cultural variation challenges the universality claim.** Different societies evolved different values and virtue systems. For example, honor cultures emphasize revenge and reputation, guilt cultures emphasize personal responsibility. If virtue ethics were compressed utility calculations, why wouldn't they converge? Honor cultures emphasize revenge and reputation because they lacked formal legal systems, personal reputation was the only enforcement mechanism. Guilt cultures emphasize individual responsibility because they had institutions that could handle collective punishment. These aren't quirks, these are rational responses to environmental pressures.

**Maladaptive relics are the smoking gun.** Blind obedience to authority, for example, might have been adaptive in small tribes but disasterous for modern societies. The virtue persists not because it's eternally correct, but because cultural change is slow and institutional. This is exactly why we can't treat virtue ethics as an end, the compression algorithm hasn't updated to match our current environment.

**The compression is lossy.** Virtue ethics necessarily sacrifices nuance for simplicity. In edge cases where the heuristic fails, blind adherence to virtue produces worse outcomes than careful utility calculation. The COVID-19 response showcased this: rigid adherence to "don't lie to the public" led to early mask guidance disasters, while countries that explicitly calculated trade-offs between trust and immediate harm responded more effectively. The doctrine was calibrated for normal times when there are months to study an issue before making public statements, not when it becomes a liability in a rapidly evolving crisis.

These aren't counterarguments to the framework, they are the entire point. Once virtue ethics start breaking down as a stopgap, they must be replaced.

## Why This Matters More Now

Most people aren't able to simulate multi-step forward effects. Many nth order effect calculations surprise me, as did the criminal example from above. But this is changing.

We now live in a world where forward modeling, once the exclusive domain of moral intuition and social heuristics, is becoming machine-readable. With large-scale simulation tools, reinforcement learning, and real-world behavioral data, we're no longer stuck relying on vibes or virtue to guess outcomes. Modern platforms are already demonstrating this, making it possible to trace long-term decision effects at scale, far beyond the limits of human working memory:
- **Public health simulations:** [COVID-19 response models](https://arxiv.org/abs/2102.06070) tracked multi-order effects of lockdown policies, balancing immediate viral suppression against economic fallout, interruptions in routine care, mental‑health impacts, and erosion of public trust.
- **Economic policy analysis:** The [Congressional Budget Office](https://taxpolicycenter.org/briefing-book/what-are-dynamic-scoring-and-dynamic-analysis) has used dynamic scoring models, employing macroeconomic models that incorporate behavioral responses (like work, investment, GDP changes) and feedback loops when evaluating tax or spending proposals—moving beyond static point‑in‑time calculations.

In other words, the cognitive load that virtue ethics aimed to reduce are being offloaded.

This has profound consequences. If our tools can model the long-term effects of decisions with higher fidelity than moral heuristics, then we should stop treating values as untouchable truths and start treating them as approximations to be tested and refined.

This doesn't mean we discard moral instincts, it means we put them in their proper place as priors, heuristics, and sanity checks for when models are shaky, but not as substitutes for modeling.

In a world where deep learning is rapidly evolving and it becomes increasingly possible to simulate 20 years of trust erosion from a single policy move, or forecast the impacts of prison reform across generations, clinging to virtue ethics as an end starts to look superstitious. The real game is utility, it always was, but now we'll have the compute for it.

The future of ethics isn't choosing between utility and virtue, it's recognizing that they were never opposed. Virtue ethics emerged as humanity's first attempt to approximate complex utility calculations. Now that we have better tools, we can do better than approximation.

We should be humble about this transition, moral intuitions evolved over millennia and encode wisdom we're only beginning to understand. The goal isn't to discard them but to decode them, test them, and refine them.

## PS: Personal Utility is Not Greedy Optimization

At an individual level, you still cannot plug values into models and expect them to work. If you fully buy into utilitarianism as the right moral frame, it's easy to mistake it for greedy local optimization. Maximizing comfort, productivity, or returns in every personal choice is not how real utility compounds.

Life has entropy, hidden variables, and stochastic forks. A perfectly rational decision in isolation might close doors that only randomness may have opened. For example:
> You can take the bus for \\$3, or a train for $7. The bus is cheaper, and gets you there 15 min later. A greedy utilitarian might choose the train because the time saved lets you work more and therefore earn more. That's fine.

But maybe on the bus you meet someone who ends up changing your worldview. Or it changes your perspective on how the world operates. Or maybe the discomfort of the bus and the fact that it has no outlets to charge your dead phone (true story) makes you daydream, which leads to a blog post, which lands you a job, which shifts your entire path.

That 1% chance of nonlinear upside will destroy any greedy model that doesn't account for variance.

The point of this essay, and the right move, isn't to abolish utility thinking either, it's to add temperature to your personal utility function. Inject randomness, leave some slack, and explore occasionally. Flatten your decision surface just enough to let serendipity flow in.

Something is lost when every decision is crunched through the lens of immediate output. The richness of human experience isn't always found in the greedy path, it's in the variance and side quests.

This is where virtue plays a role: rituals, habits, commitments that don't optimize a single moment open you up to asymmetric long-term compounding. The best personal utility functions aren't greedy, they're exploratory and absorb luck.
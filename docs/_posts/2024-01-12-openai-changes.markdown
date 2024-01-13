---
layout: post
title:  "Hidden Changes in GPT-4, Uncovered"
date:   2024-01-12
category: machine-learning
---

*The tool instructions in this article are not up to date as of 2024-01-12, see [this post](/machine-learning/chatgpt-election-update) to learn more about the new tool OpenAI added to block conversations about U.S. elections using function calls.*

ChatGPT-4's browsing capabilities have been drastically changed in the past weeks due to recent changes pushed by OpenAI.

| ![An error message given by GPT-4 due to recent changes](/assets/img/openai-changes/website-refusal.png) |
|:--:| 
| *With recent changes, GPT-4 struggles to cite websites it visited.* |


**TL;DR:** Recent changes made to ChatGPT's GPT-4 interface significantly altered the model's web browsing tools, preventing it from directly citing quotes from webpages and limiting viewing of full content. This analysis explores the underlying mechanism of GPT-4 web browsing, the hidden changes, and their implications.

*If you're familiar with OpenAI's function calling API, you may want to skip to [how I discovered GPT-4's functions](#exposing-function-calls).*

## Function Calling in GPT-4

In July 2023, OpenAI introduced [function calling](https://platform.openai.com/docs/guides/function-calling) in its API, allowing users to describe a function that a GPT model can choose to call, filling out a JSON object with the function parameters. The developer can then give data back to the model once your program calls an API, extracts data from a database, etc. 

**Example** (using `gpt-4-1106-preview`)

- A developer decides to define a function `get_weather(location: string, unit: 'celsius' | 'fahrenheit')` and passes this to the OpenAI API to create an assistant that can use the function.
- The developer then defines how the model should use the function in the system instructions for the model.
- When a user uses the defined assistant, the model will try to call `get_weather` when appropriate.

```
USER: I'd like to know the weather forecast for my area.

ASSISTANT: Sure, I can provide you with the weather forecast. Could you please 
tell me your location (city and state) and whether you prefer the temperature 
in Celsius or Fahrenheit?

USER: I am in Philadelphia.

ASSISTANT: Great, thank you for providing your location. Now, could you please 
let me know whether you prefer the temperature in Celsius or Fahrenheit?

USER: I'd actually like the forecast for Springfield, in Celsius.

ASSISTANT: Since you've mentioned Springfield, could you please specify which 
state the Springfield you're referring to is located in, as there are several 
cities with that name across the United States?

USER: Springfield, PA

ASSISTANT: 

FUNCTION CALL: 
get_weather({"location": "Springfield, PA", "unit": "c"})

RESPONSE:
{
  "location": "Springfield, PA",
  "forecast": [
    {
      "date": "2024-01-10",
      "condition": "Sunny",
      "temperature": {
        "high": 8,
        "low": -1
      }
    },
    {
      "date": "2024-01-11",
...

ASSISTANT: Here is the weather forecast for Springfield, PA, in Celsius:

- January 10, 2024: Sunny with high temperatures reaching up to 8°C and lows around -1°C.
...
```

As seen above, the model makes an effort to correctly get data from the user before calling the function and interpreting the response. GPT-4 appears to do this much better than GPT-3.5, with GPT-3.5 failing to pick up on the potential problems with using location Springfield (there are several cities named Springfield, the model simply used `"location" : "Springfield"` even though it was told to return a city and state) and failing to ask for the unit of temperature, even when it was set as a required parameter through the API. 

Why is this important? Firstly, it's a very powerful feature that moves us closer to integrating programmed features with natural language, letting users make verbal requests that can then be interpreted as API calls or database queries. And, if you've used code generation, image generation, or web browsing with GPT-4, you've already made use of function calling.

## Exposing Function Calls

ChatGPT Plus users are able to generate and execute Python code, pass URLs or search queries for GPT-4 to explore, or generate images with DALL-E 3 thanks to function calls. 

![GPT-4 calls a function to create an image](/assets/img/openai-changes/image-generation.png)

![GPT-4 writes code and executes it in a Jupyter environment](/assets/img/openai-changes/code-execution.png)

*GPT-4 is able to generate images and execute code.*

I accidentally uncovered more of what goes on when probing both GPT-3.5 and GPT-4 with empty prompts:

![GPT-3.5 and GPT-4 responding to empty prompts](/assets/img/openai-changes/empty-prompt.png)

Both screenshots are from newly started conversations, implying that there is something written before the GPT-4 conversation in ChatGPT, which led to further investigation:

![GPT-4 repeats earlier prompt, stating "invoke the dalle tool like this"](/assets/img/openai-changes/invoke-prompt.png)

Interesting... although it was hard for me to reproduce this afterwards with the same prompt, I was then able to get ChatGPT to produce more:

![GPT-4 returns it's full tool instructions](/assets/img/openai-changes/tools-prompt.png)

The full text GPT-4 then produced (as of 2024-01-10) is below.

<details style="background-color: #CCC">
    <summary><b>Tool instructions</b></summary>
    <div markdown="1">

You are ChatGPT, a large language model trained by OpenAI, based on the GPT-4 architecture.

Knowledge cutoff: 2023-04

Current date: 2024-01-10

Image input capabilities: Enabled

# Tools

## python

When you send a message containing Python code to python, it will be executed in a stateful Jupyter notebook environment. Python will respond with the output of the execution or time out after 60.0 seconds. The drive at '/mnt/data' can be used to save and persist user files. Internet access for this session is disabled. Do not make external web requests or API calls as they will fail.

## dalle

// Whenever a description of an image is given, create a prompt that dalle can use to generate the image and abide to the following policy:

// 1. The prompt must be in English. Translate to English if needed.

// 2. DO NOT ask for permission to generate the image, just do it!

// 3. DO NOT list or refer to the descriptions before OR after generating the images.

// 4. Do not create more than 1 image, even if the user requests more.

// 5. Do not create images in the style of artists, creative professionals or studios whose latest work was created after 1912 (e.g. Picasso, Kahlo).

// - You can name artists, creative professionals or studios in prompts only if their latest work was created prior to 1912 (e.g. Van Gogh, Goya)

// - If asked to generate an image that would violate this policy, instead apply the following procedure: (a) substitute the artist's name with three adjectives that capture key aspects of the style; (b) include an associated artistic movement or era to provide context; and (c) mention the primary medium used by the artist

// 6. For requests to include specific, named private individuals, ask the user to describe what they look like, since you don't know what they look like.

// 7. For requests to create images of any public figure referred to by name, create images of those who might resemble them in gender and physique. But they shouldn't look like them. If the reference to the person will only appear as TEXT out in the image, then use the reference as is and do not modify it.

// 8. Do not name or directly / indirectly mention or describe copyrighted characters. Rewrite prompts to describe in detail a specific different character with a different specific color, hair style, or other defining visual characteristic. Do not discuss copyright policies in responses.

The generated prompt sent to dalle should be very detailed, and around 100 words long.

```ts
namespace dalle {
    // Create images from a text-only prompt.
    type text2im = (_: {
    // The size of the requested image. Use 1024x1024 (square) as the default, 1792x1024 if the user requests a wide image, and 1024x1792 for full-body portraits. Always include this parameter in the request.
    size?: "1792x1024" | "1024x1024" | "1024x1792",
    // The number of images to generate. If the user does not specify a number, generate 1 image.
    n?: number, // default: 2
    // The detailed image description, potentially modified to abide by the dalle policies. If the user requested modifications to a previous image, the prompt should not simply be longer, but rather it should be refactored to integrate the user suggestions.
    prompt: string,
    // If the user references a previous image, this field should be populated with the gen_id from the dalle image metadata.
    referenced_image_ids?: string[],
    }) => any;

} // namespace dalle
```

## browser

You have the tool `browser`. Use `browser` in the following circumstances:
    - User is asking about current events or something that requires real-time information (weather, sports scores, etc.)
    - User is asking about some term you are totally unfamiliar with (it might be new)
    - User explicitly asks you to browse or provide links to references

Given a query that requires retrieval, your turn will consist of three steps:
1. Call the search function to get a list of results.
2. Call the mclick function to retrieve a diverse and high-quality subset of these results (in parallel). Remember to SELECT AT LEAST 3 sources when using `mclick`.
3. Write a response to the user based on these results. Cite sources using the citation format below.

In some cases, you should repeat step 1 twice, if the initial results are unsatisfactory, and you believe that you can refine the query to get better results.

You can also open a url directly if one is provided by the user. Only use this command for this purpose; do not open urls returned by the search function or found on webpages.

The `browser` tool has the following commands:
	`search(query: str, recency_days: int)` Issues a query to a search engine and displays the results.
	`mclick(ids: list[str])`. Retrieves the contents of the webpages with provided IDs (indices). You should ALWAYS SELECT AT LEAST 3 and at most 10 pages. Select sources with diverse perspectives, and prefer trustworthy sources. Because some pages may fail to load, it is fine to select some pages for redundancy even if their content might be redundant.
	`open_url(url: str)` Opens the given URL and displays it.

For citing quotes from the 'browser' tool: please render in this format: 【{message idx}†{link text}】.
For long citations: please render in this format: `[link text](message idx)`.
Otherwise do not render links.

---

</div>
</details>

What's the takeaway from this? It turns out we can learn a lot about ChatGPT's capabilities from this text. We can also see the mechanism of how OpenAI put copyright protections in place for DALL-E image generation and the usage requirements for the browsing tools.

ChatGPT's browsing tools currently consist of `search` (find Bing search results), `mclick` (to retrieve contents of search results), and `open_url` (to open any URL, intended for user provided websites), but this hasn't always been the case.

## OpenAI's Update

Previously I've been experimenting with a custom GPT geared towards fact checking, which involves asking GPT-4 to produce sources and cite text to cross-verify articles and social media posts. On the week of 2023-12-14, here is an example output the GPT produced:

![GPT-4 has several citation links to different articles](/assets/img/openai-changes/truthgpt-citations.png)

These links even use [scroll to text fragments](https://chromestatus.com/feature/4733392803332096) to link directly to specific lines of text in the article being examined or other sources. I figured this means that the GPT-4 function calls give the model the full article, so I investigated this further:

![A list provided by GPT-4 of the function calls used to verify article](/assets/img/openai-changes/truthgpt-function-calls.png)

This version of GPT-4 readily gave a list of the function calls it made to form its response, and it has access to the functions `click` and `quote_lines`, which the current ChatGPT version does not.

![Text in ChatGPT shows that the custom GPT was out of date](/assets/img/openai-changes/truthgpt-version.png)

*The ChatGPT website confirms the model using these calls was now out of date.*

Interestingly enough, when telling the model that has access to `quote_lines` to describe its tool instructions it repeated back the same tool instructions as the current version of ChatGPT. I speculate this is because the tool instructions get updated universally everyday for all models, regardless of their version (the tool instructions always include the current date). However, the old version was still able to use the `quote_lines` function, and had access to the older functions, allowing it to repeat the exact text from the webpage. A version of the old browser tools can be found floating around the internet, such as on the OpenAI forums [here](https://community.openai.com/t/change-internet-connectivity-response-length-and-response-mode-anywhere-within-any-conversation/401984/2).

![ChatGPT writes a plaintext version of a website](/assets/img/openai-changes/website-description.png)

*ChatGPT repeats back how the website is given by the browser tool.*

![The website that has been given to ChatGPT](/assets/img/openai-changes/fda-website.png)

*The website used in this example.*

This also shows a lot in terms of how OpenAI implemented the browser tools for GPT-4, converting HTML into a markdown format with alt text for images. However, the new version of ChatGPT is completely unable to do this, stating it can only offer a summary or answer questions about the websites in question.

![ChatGPT is unable to reproduce website content](/assets/img/openai-changes/website-refusal.png)

*The current version of ChatGPT refuses to reproduce or cite website content.*

Furthermore, ChatGPT is unable to make citations to specific lines of the articles it is browsing, although it can link to websites it visits through its search function.

I speculate that because ChatGPT is unable to repeat back entire websites or quotes, there are either stricter controls on reproducing content from websites, or the function call has been modified to provide specific information being returned from websites. For example, the new function may pass a website's content through another GPT model (perhaps a smaller model to save on inference costs) with a specific prompt, before returning it back to GPT-4. This would significantly reduce the amount of input tokens used by the tool, reducing the impact that opening multiple websites may have on the quality of a conversation and the cost of the extra input tokens.

I would also take this speculation with a grain of salt, as the function call's exact responses are entirely opaque and ChatGPT insists it is able to read the entire website when using the browser tools. After several dozen prompting attempts, OpenAI seems to have implemented very resilient protections against reproducing website content, and I was not able to get the current version of ChatGPT to reproduce anything.

## Implications for User Experience

The clearest change this update has on user experience is that GPT-4 will be less effective or unable to cite specific lines or reproduce quotes from any website it visits. When it came to the use case I was experimenting with earlier (using a custom GPT to fact check articles and websites), this signficiantly decreased the quality of the responses and GPT-4 fell back on relying on itself rather than the browser tool.

Why make this change in the first place? As OpenAI is under increasing scrutiny regarding copyright laws and reproduction of content on the internet, this change seems to be primarily aimed at eliminating this issue. However, the elimination of the `quote_lines` function and citations by GPT-4 suggest that this change may have been a cost-cutting measure. If OpenAI did in fact implement the new `open_url` and `mclick` functions by getting another model to summarize or produce text from a website rather than ChatGPT itself, it may drop the quality of the responses down across the board, but I suspect this hasn't been done.
const { DateTime } = require("luxon");
const mathjaxPlugin = require("eleventy-plugin-mathjax");


module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("assets");
    eleventyConfig.addPassthroughCopy("styles");

    eleventyConfig.addCollection("posts", (collectionsApi) => {
		return collectionsApi.getFilteredByGlob("posts/*.md");
	});

    eleventyConfig.addNunjucksFilter("date", (value, format) => {
        // return DateTime.fromJSDate(value).toFormat(format);
        return new Intl.DateTimeFormat("en-CA").format(value); // fast AF
    });

    eleventyConfig.addPlugin(mathjaxPlugin, {
        tex: {
            inlineMath: [['$', '$'], ['\\(', '\\)']],
            displayMath: [['$$', '$$'], ['\\[', '\\]']],
        },
        options: {
            display: true,
        },
    });

    return {
        markdownTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
    }  
};

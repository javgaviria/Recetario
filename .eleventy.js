module.exports = function (eleventyConfig) {
  // Static assets
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "static/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "admin": "admin" });

  eleventyConfig.setUseGitIgnore(false);

  // Slug filter (in case titles have accents / spaces)
  eleventyConfig.addFilter("slugify", function (str) {
    return String(str)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  });

  eleventyConfig.addCollection("recipe", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/recipes/*.md")
      .sort((a, b) => (b.data.sortDate || 0) - (a.data.sortDate || 0));
  });

  eleventyConfig.addCollection("tagList", function (collectionApi) {
    const recipes = collectionApi.getFilteredByGlob("src/recipes/*.md");
    const tagSet = new Set();
    recipes.forEach((recipe) => {
      (recipe.data.tags || []).forEach((tag) => tagSet.add(tag));
    });
    return [...tagSet].sort((a, b) => a.localeCompare(b, "es"));
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
  };
};

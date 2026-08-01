const fs = require("fs");
const path = require("path");

module.exports = function (eleventyConfig) {
  // Static assets
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "static/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "admin": "admin" });

  eleventyConfig.setUseGitIgnore(false);

  // Ingredients pasted as plain text, one per line.
  // Optional "## Group name" lines split them into sub-groups (e.g. base + salsa).
  eleventyConfig.addFilter("parseIngredients", function (text) {
    if (!text) return [];
    const lines = String(text).split("\n").map((l) => l.trim());
    const groups = [];
    let current = { label: null, items: [] };
    lines.forEach((line) => {
      if (!line) return;
      if (line.startsWith("##")) {
        if (current.items.length || current.label) groups.push(current);
        current = { label: line.replace(/^##\s*/, ""), items: [] };
      } else {
        current.items.push(line.replace(/^[-*•]\s*/, ""));
      }
    });
    if (current.items.length || current.label) groups.push(current);
    return groups;
  });

  // Steps pasted as plain text, one per line. Strips leading bullets/numbers.
  eleventyConfig.addFilter("parseSteps", function (text) {
    if (!text) return [];
    return String(text)
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => l.replace(/^[-*•]\s*/, "").replace(/^\d+[.)]\s*/, ""));
  });

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
      .sort((a, b) => (a.data.title || "").localeCompare(b.data.title || "", "es"));
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

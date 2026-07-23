function slugify(str) {
  return String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

module.exports = {
  layout: "layouts/recipe.njk",
  eleventyComputed: {
    permalink: (data) => `/recetas/${slugify(data.title)}/`,
    slug: (data) => slugify(data.title),
    sortDate: (data) => {
      if (data.date) return new Date(data.date).getTime();
      // Sin fecha cargada: usamos la fecha de creación del archivo como respaldo
      try {
        return require("fs").statSync(data.page.inputPath).birthtimeMs;
      } catch (e) {
        return 0;
      }
    },
  },
};

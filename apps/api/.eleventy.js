require("dotenv").config();

module.exports = function (eleventyConfig) {
  // Copy CSS to the output directory
  eleventyConfig.addPassthroughCopy({
    "docs/css": "css",
  });

  // Watch for CSS changes
  eleventyConfig.addWatchTarget("docs/css/");

  // Stylized List shortcode
  eleventyConfig.addNunjucksShortcode("stylizedList", function(content, type = "ul") {
    const listId = `stylized-list-${Math.random().toString(36).substr(2, 9)}`;

    return `
<div class="stylized-list-wrapper">
  <${type} class="stylized-list" id="${listId}">
    ${content}
  </${type}>
</div>

<style>
  /* Stylized List */
  .stylized-list {
    padding-left: 2rem;
    margin: 2rem 0;
    position: relative;
    list-style: none;
  }

  /* Hand-drawn list items */
  .stylized-list > li {
    position: relative;
    margin-bottom: 1.25rem;
    line-height: 1.7;
    padding-left: 1.5rem;
  }

  /* Hand-drawn bullet points */
  .stylized-list:not(ol) > li::before {
    content: "";
    position: absolute;
    left: -1.5rem;
    top: 0.5rem;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background: linear-gradient(135deg, #fef08a 0%, #fde047 100%);
    border: 2px solid #1c1917;
    box-shadow: 2px 2px 0 0 rgba(0, 0, 0, 1);
    transform: rotate(15deg);
  }

  /* Hand-drawn numbers for ordered lists */
  .stylized-list:is(ol) {
    counter-reset: item;
  }

  .stylized-list:is(ol) > li::before {
    counter-increment: item;
    content: counter(item);
    position: absolute;
    left: -2rem;
    top: 0;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    background: linear-gradient(135deg, #bfdbfe 0%, #93c5fd 100%);
    border: 2px solid #1e3a8a;
    box-shadow: 2px 2px 0 0 rgba(0, 0, 0, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 0.8em;
    color: #1e3a8a;
    transform: rotate(-5deg);
  }

  /* Nested lists */
  .stylized-list ul,
  .stylized-list ol {
    margin: 0.75rem 0 0.75rem 1rem;
  }

  /* Different colors for nested list items */
  .stylized-list > li > ul > li::before {
    background: linear-gradient(135deg, #c7d2fe 0%, #a5b4fc 100%);
    border-color: #3730a3;
  }

  .stylized-list > li > ol > li::before {
    background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
    border-color: #065f46;
    color: #065f46;
  }

  /* Hand-drawn style for the last level of nesting */
  .stylized-list > li > ul > li > ul > li::before,
  .stylized-list > li > ol > li > ol > li::before {
    background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%);
    border-color: #991b1b;
    transform: rotate(-15deg);
  }

  /* Hover effects */
  .stylized-list > li:hover::before {
    transform: scale(1.1) rotate(0deg);
    transition: transform 0.2s ease;
  }
</style>
    `;
  });

  return {
    dir: {
      input: ".",
      includes: "/docs/_includes",
      output: "_site",
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};

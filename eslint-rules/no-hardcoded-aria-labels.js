module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow hardcoded strings in aria-label",
      category: "Accessibility",
      recommended: false,
    },
    schema: [],
    messages: {
      hardcodedAriaLabel:
        "Avoid hardcoded strings in aria-label. Use i18n instead.",
    },
  },
  create(context) {
    return {
      JSXAttribute(node) {
        if (
          node.name.name === "aria-label" &&
          node.value &&
          node.value.type === "Literal"
        ) {
          context.report({
            node,
            messageId: "hardcodedAriaLabel",
          });
        }
      },
    };
  },
};

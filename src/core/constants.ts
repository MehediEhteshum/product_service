export const TTL = 300;
export const CUSTOM_INDEX_SETTING: Object = {
  settings: {
    analysis: {
      filter: {
        autocomplete_filter: {
          type: "edge_ngram",
          min_gram: 1,
          max_gram: 20,
        },
      },
      analyzer: {
        autocomplete: {
          type: "custom",
          tokenizer: "standard",
          filter: ["lowercase", "autocomplete_filter"],
        },
      },
    },
  },
  mappings: {
    properties: {
      name: {
        type: "text",
        analyzer: "autocomplete",
        search_analyzer: "standard",
      },
      description: { type: "text" },
      price: { type: "float" },
      stock: { type: "integer" },
      category: { type: "keyword" },
      imageUrl: { type: "text" },
      createdAt: { type: "date" },
      updatedAt: { type: "date" },
    },
  },
};

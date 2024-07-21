// controllers/knowledgeBase.controller.js
const KnowledgeBase = require('../models/knowledgeBase.model');

// Controller functions
const getAllArticles = async (req, res) => {
  try {
    const articles = await KnowledgeBase.find({});
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const searchArticles = async (req, res) => {
  try {
    const query = req.query.q; // Query parameter from the request

    // Perform text search using MongoDB's $text operator
    const results = await KnowledgeBase.find({ $text: { $search: query } });

    res.json(results);
  } catch (err) {
    console.error('Error searching articles:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createArticle = async (req, res) => {
  const article = {
    title: req.body.title,
    content: req.body.content,
    category: req.body.category,
    tags: req.body.tags
  };
  try {
    const newArticle = await KnowledgeBase.create(article);
    res.status(201).json(newArticle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateArticle = async (req, res) => {
  try {
    const article = await KnowledgeBase.findByIdAndUpdate(req.params.id, req.body);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    const updatedArticle = await KnowledgeBase.findById(req.params.id);
    res.json(updatedArticle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteArticle = async (req, res) => {
  try {
    const articleId = req.params.id;
    console.log(`Attempting to delete article with ID: ${articleId}`); // Debug log

    const article = await KnowledgeBase.findByIdAndDelete(articleId);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    console.log('Deleted article:', article); // Debug log
    res.json({ message: 'Article deleted successfully' });
  } catch (err) {
    console.error('Error deleting article:', err); // Improved error logging
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllArticles,
  searchArticles,
  createArticle,
  updateArticle,
  deleteArticle
};

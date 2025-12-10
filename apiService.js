document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    const resultsArea = document.getElementById('resultsArea');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const resultsContent = document.getElementById('resultsContent');
    const errorMessage = document.getElementById('errorMessage');

    const aiResponse = document.getElementById('aiResponse');
    const aiSources = document.getElementById('aiSources');

    const API_KEY = "";
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`;

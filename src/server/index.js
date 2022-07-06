const express = require('express');
const initDatabase = require('./database');

const initApp = (app) => {
    // For app configurations.
    app.set('json spaces', 4);
    app.use(express.json());
}

module.exports = { initApp, initDatabase }

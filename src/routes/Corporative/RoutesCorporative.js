const express = require('express');
const router = express.Router();


const layout_es = appRoot+'/views/pages/corporative/es.hbs';
const layout_en = appRoot+'/views/pages/corporative/en.hbs';

const modules_es = 'modules/corporative/es/';
const modules_en = 'modules/corporative/en/';


router.get('/', (req, res) => {
    res.render(modules_es+'index', {layout: layout_es});
});

router.get('/conocenos', (req, res) => {
    res.render(modules_es+'conocenos', {layout: layout_es});
});
router.get('/inspecciones-surveys', (req, res) => {
    res.render(modules_es+'inspecciones-surveys', {layout: layout_es});
});
router.get('/periciales', (req, res) => {
    res.render(modules_es+'periciales', {layout: layout_es});
});
router.get('/presencia-mundial', (req, res) => {
    res.render(modules_es+'presencia-mundial', {layout: layout_es});
});
router.get('/contacto', (req, res) => {
    res.render(modules_es+'contacto', {layout: layout_es});
});
router.get('/resources', (req, res) => {
    res.render(modules_es+'resources', {layout: layout_es});
});
router.get('/politica-de-privacidad', (req, res) => {
    res.render(modules_es+'politica-de-privacidad', {layout: layout_es});
});




//ENGLISH

router.get('/en/', (req, res) => {
    res.render(modules_en+'index', {layout: layout_en});
});

router.get('/en/about-us', (req, res) => {
    res.render(modules_en+'about-us', {layout: layout_en});
});
router.get('/en/quality-control-marine-surveys', (req, res) => {
    res.render(modules_en+'quality-control-marine-surveys', {layout: layout_en});
});
router.get('/en/loss-adjuster', (req, res) => {
    res.render(modules_en+'loss-adjuster', {layout: layout_en});
});
router.get('/en/global-presence', (req, res) => {
    res.render(modules_en+'global-presence', {layout: layout_en});
});
router.get('/en/contact', (req, res) => {
    res.render(modules_en+'contact', {layout: layout_en});
});
router.get('/en/resources', (req, res) => {
    res.render(modules_en+'resources', {layout: layout_en});
});
router.get('/en/privacy-policy', (req, res) => {
    res.render(modules_en+'privacy-policy', {layout: layout_en});
});


module.exports = router;
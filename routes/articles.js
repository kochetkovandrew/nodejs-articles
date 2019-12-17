let express = require('express');
let router = express.Router();
const fs = require('fs');
let path = require('path');
const { exec } = require('child_process');

// GET / = get a list of articles
router.get('/', function (req, res) {
  store.ready(async () => {
    try {
      let articles = await store.Model('Articles');
      res.render('articles/index', {title: 'Articles', articles: articles})
    } catch (error) {
      console.error(error);
    }
  });
});

// GET /new = get a form for a new article
router.get('/new', function (req, res) {
  let article = {};
  res.render('articles/new', { title: 'New Article', article: article })
});

// GET /:id/edit = get a form to edit an article #id
router.get('/:id/edit', function (req, res) {
  store.ready(async () => {
    try {
      let article = await store.Model('Article').find(req.params.id);
      res.render('articles/edit', {title: 'Edit an Article', article: article})
    } catch (error) {
      console.error(error);
    }
  });
});

// GET /:id.html = show a HTML page with article :id details
router.get('/:id.html', function (req, res) {
  let appDir = path.dirname(require.main.filename);
  store.ready(async () => {
    try {
      let article = await store.Model('Article').find(req.params.id);
      let text = article.html();
      fs.writeFile(appDir + '/tmp/' + req.params.id + '.html', text, function(err) {
        if (err) {
          return console.log(err);
        } else {
          res.download(appDir + '/tmp/' + req.params.id + '.html');
        }
      });
    } catch (error) {
      console.error(error);
    }
  });
});

// GET /:id.tex = download a .tex file with the article :id
router.get('/:id.tex', function (req, res) {
  let appDir = path.dirname(require.main.filename);
  store.ready(async () => {
    try {
      let article = await store.Model('Article').find(req.params.id);
      let text = article.tex();
      fs.writeFile(appDir + '/tmp/' + req.params.id + '.tex', text, function(err) {
      if (err) {
        return console.log(err);
      } else {
        res.download(appDir + '/tmp/' + req.params.id + '.tex');
      }
    });
    } catch (error) {
      console.error(error);
    }
  });
});

// GET /:id.pdf = download a .pdf file with the article :id
router.get('/:id.pdf', function (req, res) {
  var appDir = path.dirname(require.main.filename);
  store.ready(async () => {
    try {
      let article = await store.Model('Article').find(req.params.id);
      let text = article.tex();
      // writing a .tex fle
      fs.writeFile(appDir + '/tmp/' + req.params.id + '.tex', text, function(err) {
        if (err) {
          return console.log(err);
        } else {
          console.log('texi2pdf ' + appDir + '/tmp/' + req.params.id + '.tex' + ' -o ' + appDir + '/tmp/' + req.params.id + '.pdf');
          // converting a .tex file into .pdf using texi2pdf utility – should be installed
          exec('texi2pdf ' + appDir + '/tmp/' + req.params.id + '.tex' + ' -o ' + appDir + '/tmp/' + req.params.id + '.pdf', (err, stdout, stderr) => {
            if (err) {
              console.log('Error converting tex to pdf');
              console.log(err);
              return;
            } else {
              res.download(appDir + '/tmp/' + req.params.id + '.pdf');
            }
          });
        }
      });
    } catch (error) {
      console.error(error);
    }
  });
});


router.get('/:id', function (req, res) {
  store.ready(async () => {
    try {
      let article = await store.Model('Article').find(req.params.id);
      res.render('articles/show', {title: 'Article Details', article: article})
    } catch (error) {
      console.error(error);
    }
  });
});


router.delete('/:id', function (req, res) {
  store.ready(async () => {
    try {
      let article = await store.Model('Article').find(req.params.id);
      article.delete();
      // should be redirected to GET
      req.method = 'GET';
      res.send(200);
    } catch (error) {
      console.error(error);
    }
  });
});

router.post('/', function (req, res) {
  article = req.body.article;
  store.ready(async () => {
    try {
      const article_instance = await store.Model('Article').create(
          {
            name: article.name,
            author: article.author,
            keyword: article.keyword,
            inhalt: article.inhalt
          }
      );
      res.redirect('/articles');
    } catch(error) {
      console.error(error);
    }
  });
});

router.post('/:id', function(req, res) {
  article = req.body.article;
  store.ready(async () => {
    try {
      let article_instance = await store.Model('Article').find(req.params.id);
      article_instance.set(
          {
            name: article.name,
            author: article.author,
            keyword: article.keyword,
            inhalt: article.inhalt
          }
      );
      // waiting until article saved
      await article_instance.save();
      res.redirect('/articles/' + article_instance.id);
    } catch (error) {
      console.error(error);
    }
  })
});

module.exports = router;

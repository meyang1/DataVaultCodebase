const express = require('express');
const path = require('path');
const adminRoutes = require('./routes/admin');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/admin', adminRoutes);
app.get('/', (req, res) => res.redirect('/admin'));
app.listen(80, '0.0.0.0', () => {
  console.log('Server running on port 80');
});

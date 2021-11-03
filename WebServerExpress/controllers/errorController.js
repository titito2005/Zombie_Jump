import fs from 'fs';
import path from 'path';

class ErrorController {
  getNotFound(req, res) {
    res.status(404).send('<h1>404 Not found</h1>\n<p><a href="/home-page.xhtml">Home</a></p>');
  }
}

// Singleton
const error = new ErrorController();
export default error;

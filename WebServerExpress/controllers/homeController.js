class HomePageController {
  getHomePage(req, res) {
    res.render('HomePage', {
    });
  }
}

const homepage = new HomePageController();
export default homepage;

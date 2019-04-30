class ProfileController {
  static test (req, res) {
      res.json({
        message: 'Success: Profile working'
    })
  }
}

export default ProfileController;
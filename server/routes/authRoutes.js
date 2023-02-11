const { register, login, adduser, viewuser, deleteuser, getbyId, updateuser } = require("../controllers/authControllers");
const { checkUser } = require("../middlewares/authMiddleware");

const router = require("express").Router();

router.post("/", checkUser);
router.post("/register", register);
router.post("/login", login);
router.post("/add-user", adduser);
router.get("/view-user", viewuser);
router.get("/delete-user/:id", deleteuser);
router.post("/edit-user/:id", updateuser);
router.get("/user/:id", getbyId);

module.exports = router;

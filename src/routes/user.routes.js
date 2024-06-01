import { Router } from "express";
import { allUsers, loginUser, registerUser } from "../controllers/User.Controller.js";
import { upload } from "../middleware/multer.middleware.js";
import protect from "../middleware/authMiddleware.js";
// import protectsome from "../middleware/some.js";

const router = Router();

router.post('/', upload.single('photo'), registerUser)
router.route('/login').post(loginUser)
router.route('/').get(protect, allUsers)



const userRoute = router;
export default userRoute;
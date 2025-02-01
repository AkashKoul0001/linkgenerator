const express = require("express");
const { shortenUrl, getUrls, redirectUrl, editUrl, deleteUrl ,getClickLogs, getUserClickAnalytics, redirectToOriginalUrl, searchUrlsByRemark, searchUrls } = require("../controllers/urlController");
const {protect} = require("../middleware/authMiddleware.js")

const router = express.Router();


router.post("/shorten", protect, shortenUrl);
router.get("/urls", protect, getUrls);
router.put("/edit/:shortUrl", protect, editUrl);
router.delete("/delete/:shortUrl", protect, deleteUrl);
//router.get('/search', protect, searchUrlsByRemark);
router.get("/search", protect, searchUrls);
// router.get("/shorty", red);

// router.get('/analytics', protect, (req, res, next) => {
//     console.log("Analytics API is being hit"); // Debug log
//     next();
//   }, getUserClickAnalytics);

router.get("/click-logs", protect, getUserClickAnalytics);
//router.get('/search', protect, searchUrlsByRemark);
router.get("/:shortUrl", redirectUrl);

// router.get('/analytics',protect, getUserClickAnalytics);



module.exports = router;
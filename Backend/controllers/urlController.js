
const Url = require("../models/urlModel");
const ClickLog = require('../models/clickLogModel'); 
const crypto = require("crypto");
const useragent = require('express-useragent'); 

// Function to generate a unique short URL
const generateShortUrl = (url) => {
  return crypto.createHash("md5").update(url + Date.now()).digest("base64url").slice(0, 8);
};

// Shorten and store a URL
exports.shortenUrl = async (req, res) => {
  try {
    const { originalUrl, remark, expiresAt } = req.body;
    const userId = req.user._id.toString(); // Get user ID from JWT

    if (!originalUrl) return res.status(400).json({ error: "Original URL is required" });

    let shortUrl;
    do {
      shortUrl = generateShortUrl(originalUrl);
    } while (await Url.findOne({ shortUrl }));

    const newUrl = new Url({ originalUrl, shortUrl, remark, expiresAt: expiresAt || '2050-02-02T00:22:00.000Z', userId });
    await newUrl.save();

    res.json({ shortUrl, originalUrl, remark, userId });
  } catch (error) {
    res.status(500).json({ error: "Error creating short URL" });
  }
};

// Fetch paginated URLs for a specific user
exports.getUrls = async (req, res) => {
  try {
    const userId = req.user._id; 
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;
    const urls = await Url.find({ userId }).skip(skip).limit(limit);
    const totalUrls = await Url.countDocuments({ userId });
    const totalPages = Math.ceil(totalUrls / limit);

    res.json({ page, limit, totalPages, totalUrls, urls });
  } catch (error) {
    res.status(500).json({ error: "Error fetching URLs" });
  }
};



// exports.redirectUrl = async (req, res) => {
//   try {
//     const { shortUrl } = req.params;
//     console.log("Short URL Requested:", shortUrl); // Debug log

//     // Step 1: Find the URL entry
//     const urlEntry = await Url.findOne({ shortUrl });
//     if (!urlEntry) {
//       return res.status(404).json({ error: "URL not found" });
//     }

//     console.log("URL Entry Found:", urlEntry); // Debug log

//     // Step 2: Log click data
//     const newClick = await ClickLog.create({
//       shortUrl: urlEntry.shortUrl,
//       ipAddress: req.ip,
//       deviceType: req.headers["user-agent"], // Basic detection
//       userId: urlEntry.userId
//     });

//     console.log("Click Logged:", newClick); // Debug log

//     // Step 3: Update click count in the URL model
//     await Url.findOneAndUpdate(
//       { shortUrl },
//       { $inc: { clicks: 1 } }, // Increment click count
//       { new: true }
//     );

//     console.log("Click Count Updated"); // Debug log

//     // Redirect user to original URL
//     res.redirect(urlEntry.originalUrl);
//   } catch (error) {
//     console.error("Redirect Error:", error);
//     res.status(500).json({ error: "Error redirecting URL" });
//   }
// };


// Redirect to the original URL (with expiration check)
exports.redirectUrl = async (req, res) => {
  try {
    const { shortUrl } = req.params;
    console.log("Short URL Requested:", shortUrl); // Debug log

    // Step 1: Find the URL entry
    const urlEntry = await Url.findOne({ shortUrl });
    if (!urlEntry) {
      return res.status(404).json({ error: "URL not found" });
    }

    console.log("URL Entry Found:", urlEntry); // Debug log

    // Step 2: Check if the URL has expired
    if (urlEntry.expiresAt && new Date(urlEntry.expiresAt) < new Date()) {
      // If the link is expired, do not log the click and return an error response
      return res.status(400).json({ error: "This link has expired and is no longer active" });
    }

    // Step 3: Log click data if the link is still active
    const newClick = await ClickLog.create({
      shortUrl: urlEntry.shortUrl,
      ipAddress: req.ip,
      deviceType: req.headers["user-agent"], // Basic detection
      userId: urlEntry.userId
    });

    console.log("Click Logged:", newClick); // Debug log

    // Step 4: Update click count in the URL model if the link is active
    await Url.findOneAndUpdate(
      { shortUrl },
      { $inc: { clicks: 1 } }, // Increment click count
      { new: true }
    );

    console.log("Click Count Updated"); // Debug log

    // Redirect user to the original URL
    res.redirect(urlEntry.originalUrl);
  } catch (error) {
    console.error("Redirect Error:", error);
    res.status(500).json({ error: "Error redirecting URL" });
  }
};

// Get click logs for the authenticated user
exports.getClickLogs = async (req, res) => {
  try {
    const userId = req.user._id;
    const clickLogs = await ClickLog.find({ userId }).populate('userId', 'username');

    if (!clickLogs.length) return res.status(404).json({ error: "No click data found for this user" });

    res.json({ clickLogs });
  } catch (error) {
    res.status(500).json({ error: "Error fetching click logs" });
  }
};

// Edit URL details (Only owner can edit)
exports.editUrl = async (req, res) => {
  try {
    const { shortUrl } = req.params;
    const { originalUrl, remark, expiresAt } = req.body;
    const userId = req.user._id;

    const url = await Url.findOne({ shortUrl, userId });
    if (!url) return res.status(404).json({ error: "URL not found or unauthorized" });

    url.originalUrl = originalUrl || url.originalUrl;
    url.remark = remark || url.remark;
    url.expiresAt = expiresAt || url.expiresAt;
    
    await url.save();
    res.json({ message: "URL updated", url });
  } catch (error) {
    res.status(500).json({ error: "Error updating URL" });
  }
};

// Delete a URL (Only owner can delete)
exports.deleteUrl = async (req, res) => {
  try {
    const { shortUrl } = req.params;
    const userId = req.user._id;

    const url = await Url.findOne({ shortUrl, userId });
    if (!url) return res.status(404).json({ error: "URL not found or unauthorized" });

    await url.deleteOne();
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting URL" });
  }
};


exports.getUserClickAnalytics = async (req, res) => {
  try {
    const userId = req.user._id; // Get authenticated user's ID
    console.log("Authenticated User ID:", userId); // Debug log

    // Find all short URLs created by this user
    const userUrls = await Url.find({ userId }).select("shortUrl");
    const shortUrls = userUrls.map(url => url.shortUrl);
    console.log("User's Short URLs:", shortUrls); // Debug log

    if (shortUrls.length === 0) {
      return res.status(404).json({ error: "No URLs created by this user" });
    }

    // Fetch click logs for all short URLs created by the user
    const clickLogs = await ClickLog.find({ shortUrl: { $in: shortUrls } }).select(
      "shortUrl ipAddress deviceType browser os createdAt"
    );

    console.log("Click Logs Found:", clickLogs); // Debug log

    if (!clickLogs.length) {
      return res.status(404).json({ error: "No click data found for this user" });
    }

    res.json({ totalClicks: clickLogs.length, analytics: clickLogs });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ error: "Error fetching analytics data" });
  }
};



exports.searchUrls = async (req, res) => {
  try {
    const userId = req.user._id;
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    // Search by remark, short URL, or original URL
    const urls = await Url.find({
      userId,
      $or: [
        { remark: { $regex: query, $options: "i" } },
        { shortUrl: { $regex: query, $options: "i" } },
        { originalUrl: { $regex: query, $options: "i" } },
      ],
    });

    res.json({ count: urls.length, results: urls });
  } catch (error) {
    res.status(500).json({ error: "Error searching URLs" });
  }
};


const express = require("express");
const router = express.Router();

const watchlistController = require("../controllers/watchlistController");
const authMiddleware = require("../middleware/authMiddleware");

console.log("Controller:", watchlistController);
console.log("addToWatchlist:", typeof watchlistController.addToWatchlist);
console.log("getWatchlist:", typeof watchlistController.getWatchlist);
console.log("removeFromWatchlist:", typeof watchlistController.removeFromWatchlist);

router.use(authMiddleware);

router.post("/", watchlistController.addToWatchlist);
router.get("/", watchlistController.getWatchlist);
router.delete("/:symbol", watchlistController.removeFromWatchlist);

module.exports = router;
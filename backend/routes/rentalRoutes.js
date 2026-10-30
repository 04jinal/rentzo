const express = require("express");
const RentalItem = require("../models/RentalItem");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET all rental items
router.get("/", async (req, res) => {
  try {
    const items = await RentalItem.find()
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Rental items fetch nahi ho paaye",
    });
  }
});

// GET OWNER'S RENTAL ITEMS
router.get(
  "/owner/:ownerId",
  authMiddleware,
  async (req, res) => {
    try {
      const requestedOwnerId = req.params.ownerId;
      const loggedInUserId = req.user.userId;

      // Sirf apne rentals dekh sakte hain
      if (requestedOwnerId !== loggedInUserId) {
        return res.status(403).json({
          message:
            "Aap sirf apne rentals dekh sakte hain.",
        });
      }

      const items = await RentalItem.find({
        owner: requestedOwnerId,
      })
        .populate("owner", "name email")
        .sort({ createdAt: -1 });

      res.json(items);
    } catch (error) {
      console.error(
        "GET OWNER RENTALS ERROR:",
        error
      );

      res.status(500).json({
        message:
          "Owner items fetch nahi ho paaye",
      });
    }
  }
);


// GET single rental item
router.get("/:id", async (req, res) => {
  try {
    const item = await RentalItem.findById(req.params.id)
      .populate("owner", "name email");

    if (!item) {
      return res.status(404).json({
        message: "Rental item nahi mila",
      });
    }

    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Rental item fetch nahi ho paaya",
    });
  }
});

// POST new rental item
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      pricePerDay,
      location,
      image,
    } = req.body;

    // Owner JWT token se automatically milega
    const owner = req.user.userId;

    if (
      !title ||
      !description ||
      !category ||
      pricePerDay === undefined ||
      !location
    ) {
      return res.status(400).json({
        message: "Required fields missing hain",
      });
    }

    const newItem = await RentalItem.create({
      title,
      description,
      category,
      pricePerDay,
      location,
      image,
      owner,
    });

    res.status(201).json({
      message: "Rental item successfully created",
      item: newItem,
    });
  } catch (error) {
    console.error("CREATE RENTAL ERROR:", error);

    res.status(500).json({
      message: "Rental item create nahi ho paaya",
    });
  }
});

// DELETE RENTAL
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const rental = await RentalItem.findById(req.params.id);

    console.log("DELETE ID:", req.params.id);
    console.log("FOUND RENTAL:", rental);

    if (!rental) {
      return res.status(404).json({
        message: "Rental item nahi mila",
      });
    }

    const loggedInUserId = req.user.userId;
    const loggedInUserRole = req.user.role;

    // Sirf rental owner ya admin delete kar sakta hai
    if (
      loggedInUserRole !== "admin" &&
      rental.owner.toString() !== loggedInUserId
    ) {
      return res.status(403).json({
        message: "Aap sirf apna rental delete kar sakte hain.",
      });
    }

    await RentalItem.findByIdAndDelete(req.params.id);

    res.json({
      message: "Rental successfully deleted",
    });
  } catch (error) {
    console.error("DELETE RENTAL ERROR:", error);

    res.status(500).json({
      message: "Rental delete nahi ho paaya",
    });
  }
});

// TOGGLE RENTAL AVAILABILITY
router.patch("/:id/availability", authMiddleware, async (req, res) => {
  try {
    const { available } = req.body;

    if (typeof available !== "boolean") {
      return res.status(400).json({
        message: "Availability value boolean honi chahiye.",
      });
    }

    const rental = await RentalItem.findById(req.params.id);

    if (!rental) {
      return res.status(404).json({
        message: "Rental item nahi mila",
      });
    }

    const loggedInUserId = req.user.userId;
    const loggedInUserRole = req.user.role;

    // Sirf owner ya admin availability change kar sakta hai
    if (
      loggedInUserRole !== "admin" &&
      rental.owner.toString() !== loggedInUserId
    ) {
      return res.status(403).json({
        message: "Aap sirf apne rental ki availability change kar sakte hain.",
      });
    }

    rental.available = available;

    await rental.save();

    res.json({
      message: available
        ? "Rental ab available hai."
        : "Rental ab unavailable hai.",
      item: rental,
    });
  } catch (error) {
    console.error("TOGGLE RENTAL AVAILABILITY ERROR:", error);

    res.status(500).json({
      message: "Rental availability update nahi ho paayi.",
    });
  }
});

module.exports = router;
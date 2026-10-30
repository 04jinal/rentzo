const express = require("express");
const Booking = require("../models/Booking");
const authMiddleware = require("../middleware/authMiddleware");
const RentalItem = require("../models/RentalItem");

const router = express.Router();

// CREATE BOOKING
router.post("/", authMiddleware, async (req, res) => {
    try {
        const {
            rentalItem,
            startDate,
            endDate,
        } = req.body;

        const renter = req.user.userId;

        // Required fields
        if (
            !rentalItem ||
            !startDate ||
            !endDate
        ) {
            return res.status(400).json({
                message:
                    "Required booking fields missing hain",
            });
        }

        // Check rental item
        const item = await RentalItem.findById(
            rentalItem
        );

        if (!item) {
            return res.status(404).json({
                message: "Rental item nahi mila",
            });
        }

        // Parse dates
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Validate dates
        if (
            isNaN(start.getTime()) ||
            isNaN(end.getTime())
        ) {
            return res.status(400).json({
                message: "Invalid date",
            });
        }

        // End date must be after start date
        if (end <= start) {
            return res.status(400).json({
                message:
                    "End date start date ke baad honi chahiye",
            });
        }

        // Prevent booking your own rental
        if (
            item.owner.toString() === renter
        ) {
            return res.status(403).json({
                message:
                    "Aap apne khud ke rental ko book nahi kar sakte.",
            });
        }

        // Check overlapping bookings
        const existingBooking =
            await Booking.findOne({
                rentalItem,
                status: {
                    $in: [
                        "pending",
                        "confirmed",
                    ],
                },
                startDate: {
                    $lt: end,
                },
                endDate: {
                    $gt: start,
                },
            });

        if (existingBooking) {
            return res.status(409).json({
                message:
                    "Ye item selected dates par already booked hai. Please different dates choose karein.",
            });
        }

        // Calculate total days
        const difference =
            end.getTime() -
            start.getTime();

        const totalDays = Math.ceil(
            difference /
            (1000 * 60 * 60 * 24)
        );

        // Calculate total amount
        const totalAmount =
            totalDays *
            item.pricePerDay;

        // Create booking
        const booking =
            await Booking.create({
                rentalItem,
                renter,
                startDate: start,
                endDate: end,
                totalDays,
                totalAmount,
            });

        // Populate response
        const populatedBooking =
            await Booking.findById(
                booking._id
            )
                .populate("rentalItem")
                .populate(
                    "renter",
                    "name email"
                );

        res.status(201).json({
            message:
                "Booking successfully created",
            booking:
                populatedBooking,
        });
    } catch (error) {
        console.error(
            "CREATE BOOKING ERROR:",
            error
        );

        res.status(500).json({
            message:
                "Booking create nahi ho paayi",
        });
    }
});


// GET USER BOOKINGS
router.get("/user/:userId", authMiddleware, async (req, res) => {
    try {
        const requestedUserId = req.params.userId;
        const loggedInUserId = req.user.userId;

        if (requestedUserId !== loggedInUserId) {
            return res.status(403).json({
                message: "Aap sirf apni bookings dekh sakte hain.",
            });
        }

        const bookings = await Booking.find({
            renter: requestedUserId,
        })
            .populate("rentalItem")
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Bookings fetch nahi ho paayi",
        });
    }
});

// GET BOOKINGS FOR A RENTAL ITEM
router.get(
    "/rental/:rentalId",
    authMiddleware,
    async (req, res) => {
        try {
            const rental = await RentalItem.findById(
                req.params.rentalId
            );

            if (!rental) {
                return res.status(404).json({
                    message: "Rental item nahi mila",
                });
            }
            const bookings = await Booking.find({
                rentalItem: req.params.rentalId,
            })
                .populate("rentalItem")
                .populate("renter", "name email")
                .sort({ createdAt: -1 });

            res.json(bookings);
        } catch (error) {
            console.error(
                "GET RENTAL BOOKINGS ERROR:",
                error
            );

            res.status(500).json({
                message:
                    "Rental bookings fetch nahi ho paayi",
            });
        }
    }
);

// UPDATE BOOKING STATUS
router.patch("/:id/status", authMiddleware, async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "pending",
            "confirmed",
            "cancelled",
            "completed",
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid booking status",
            });
        }

        const booking = await Booking.findById(req.params.id)
            .populate("rentalItem");

        if (!booking) {
            return res.status(404).json({
                message: "Booking nahi mili",
            });
        }

        if (!booking.rentalItem) {
            return res.status(400).json({
                message: "Rental item nahi mila",
            });
        }
        
        const loggedInUserId = req.user.userId;

        const renterId = booking.renter.toString();
        const ownerId = booking.rentalItem.owner.toString();

        // ==========================================
        // RENTER
        // ==========================================

        if (renterId === loggedInUserId) {
            // Renter sirf apni booking cancel kar sakta hai

            if (status !== "cancelled") {
                return res.status(403).json({
                    message:
                        "Aap apni booking ko sirf cancel kar sakte hain.",
                });
            }

            if (
                booking.status !== "pending" &&
                booking.status !== "confirmed"
            ) {
                return res.status(400).json({
                    message:
                        "Ye booking ab cancel nahi ki ja sakti.",
                });
            }
        }

        // ==========================================
        // RENTAL OWNER
        // ==========================================

        else if (ownerId === loggedInUserId) {
            // Rental owner booking confirm ya cancel kar sakta hai

            if (
                status !== "confirmed" &&
                status !== "cancelled"
            ) {
                return res.status(403).json({
                    message:
                        "Rental owner sirf booking confirm ya cancel kar sakta hai.",
                });
            }

            if (
                booking.status !== "pending" &&
                booking.status !== "confirmed"
            ) {
                return res.status(400).json({
                    message:
                        "Ye booking ab update nahi ki ja sakti.",
                });
            }
        }

        // ==========================================
        // ADMIN
        // ==========================================

        else if (req.user.role === "admin") {
            // Admin allowed
        }

        // ==========================================
        // UNAUTHORIZED USER
        // ==========================================

        else {
            return res.status(403).json({
                message:
                    "Aap is booking ko manage nahi kar sakte.",
            });
        }

        booking.status = status;

        await booking.save();

        const updatedBooking = await Booking.findById(
            booking._id
        )
            .populate("rentalItem")
            .populate("renter", "name email");

        res.json({
            message: "Booking status successfully updated",
            booking: updatedBooking,
        });
    } catch (error) {
        console.error(
            "UPDATE BOOKING STATUS ERROR:",
            error
        );

        res.status(500).json({
            message:
                "Booking status update nahi ho paaya",
        });
    }
});


// GET SINGLE BOOKING
// GET SINGLE BOOKING
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate("rentalItem")
            .populate("renter", "name email");

        if (!booking) {
            return res.status(404).json({
                message: "Booking nahi mili",
            });
        }

        const loggedInUserId = req.user.userId;
        const loggedInUserRole = req.user.role;

        const renterId = booking.renter._id.toString();
        const ownerId = booking.rentalItem.owner.toString();

        // Admin allowed
        if (loggedInUserRole === "admin") {
            return res.json(booking);
        }

        // Renter apni booking dekh sakta hai
        if (
            loggedInUserRole === "renter" &&
            renterId !== loggedInUserId
        ) {
            return res.status(403).json({
                message:
                    "Aap sirf apni booking dekh sakte hain.",
            });
        }

        // Owner apne rental ki booking dekh sakta hai
        if (
            loggedInUserRole === "owner" &&
            ownerId !== loggedInUserId
        ) {
            return res.status(403).json({
                message:
                    "Aap is rental ki booking nahi dekh sakte.",
            });
        }

        res.json(booking);
    } catch (error) {
        console.error("GET SINGLE BOOKING ERROR:", error);

        res.status(500).json({
            message: "Booking fetch nahi ho paayi",
        });
    }
});

// GET OWNER WHATSAPP CONTACT
router.get("/:id/owner-contact", authMiddleware, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate({
                path: "rentalItem",
                populate: {
                    path: "owner",
                    select: "name whatsappNumber",
                },
            });

        if (!booking) {
            return res.status(404).json({
                message: "Booking nahi mili",
            });
        }

        // Sirf booking karne wala customer contact dekh sake
        if (booking.renter.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "Aap is owner ka contact nahi dekh sakte.",
            });
        }

        // Booking confirm hona zaroori hai
        if (booking.status !== "confirmed") {
            return res.status(403).json({
                message: "Owner contact booking confirm hone ke baad milega.",
            });
        }

        const owner = booking.rentalItem?.owner;

        if (!owner) {
            return res.status(404).json({
                message: "Owner nahi mila",
            });
        }

        if (!owner.whatsappNumber) {
            return res.status(404).json({
                message: "Owner ka WhatsApp number available nahi hai.",
            });
        }

        res.json({
            ownerName: owner.name,
            whatsappNumber: owner.whatsappNumber,
        });

    } catch (error) {
        console.error("OWNER CONTACT ERROR:", error);

        res.status(500).json({
            message: "Owner contact fetch nahi ho paaya",
        });
    }
});


module.exports = router;
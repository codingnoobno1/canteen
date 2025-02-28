const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/pixelclub", {});

// Define Schema & Model
const menuSchema = new mongoose.Schema({
    menuData: Object // Expected format: { "Monday": [{}, {}, {}, {}], ... }
});
const Menu = mongoose.model("Menu", menuSchema);

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MAX_ENTRIES_PER_DAY = 4;

// API: Get Menu Data (User)
app.get("/api/menu", async (req, res) => {
    try {
        const menu = await Menu.findOne();
        res.json(menu ? menu.menuData : {});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API: Update Menu Data (Admin)
app.post("/api/menu", async (req, res) => {
    try {
        const { menuData, day } = req.body;
        let menu = await Menu.findOne();

        if (!menu) {
            menu = new Menu({ menuData: {} });
        }

        let updatedMenu = menu.menuData || {};

        // Determine where to add if no day is specified
        let targetDay = day;
        if (!targetDay || !DAYS_OF_WEEK.includes(targetDay)) {
            targetDay = DAYS_OF_WEEK.find(d => !updatedMenu[d] || updatedMenu[d].length < MAX_ENTRIES_PER_DAY);
        }

        if (!targetDay) {
            return res.status(400).json({ error: "Menu is full for the week!" });
        }

        // Initialize day if not present
        if (!updatedMenu[targetDay]) {
            updatedMenu[targetDay] = [];
        }

        // Add to the day's menu, ensuring max 4 entries
        if (updatedMenu[targetDay].length < MAX_ENTRIES_PER_DAY) {
            updatedMenu[targetDay].push(menuData);
        } else {
            return res.status(400).json({ error: `${targetDay} is already full!` });
        }

        // Keep only the last 7 days
        const validMenu = {};
        for (let day of DAYS_OF_WEEK) {
            if (updatedMenu[day]) {
                validMenu[day] = updatedMenu[day].slice(0, MAX_ENTRIES_PER_DAY);
            }
        }

        // Save updated menu
        menu.menuData = validMenu;
        await menu.save();

        res.json(validMenu);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

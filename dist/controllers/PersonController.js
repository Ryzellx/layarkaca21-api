"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPopularActors = exports.getPerson = void 0;
const getPerson = async (req, res) => {
    // Stubbed until actual LK21 actor scraper is possible
    res.json({
        success: true,
        data: {
            id: req.params.id,
            name: "Unknown Actor",
            photo: "",
            birthDate: "",
            birthPlace: "",
            bio: "",
            knownFor: [],
            movies: [],
            series: [],
            awards: []
        }
    });
};
exports.getPerson = getPerson;
const getPopularActors = async (req, res) => {
    res.json({ success: true, data: [] });
};
exports.getPopularActors = getPopularActors;

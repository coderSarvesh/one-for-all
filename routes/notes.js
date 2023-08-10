const express = require('express');
const router = express.Router();
const Notes = require('../models/Note');
var fetchuser = require('../middleware/fetchUser');
const { body, validationResult } = require('express-validator');


// To save note
router.post('/addnote', fetchuser, [
    body('title', 'Enter title').isLength({ min: 3 }), //express validator used for cleaning inputs before saving in db
    body('description', 'Enter description').isLength({ min: 5 })
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Notes({
            title, description, tag, user: req.user.id
        })

        const savedNote = await note.save();
        res.json(savedNote);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error");
    }
})

// TO get all notes
router.get('/allnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error");
    }

})

// To get specific note
router.get('/getnote/:id', fetchuser, async (req, res) => {
    try {
        let note = await Notes.findById(req.params.id);
        if (!note) return res.status(404).send("Not Found")

        if (note.user.toString() !== req.user.id)
            return res.status(401).send("Not allowed")

        res.json(note);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error");
    }

})

// Update Note
router.put('/updatenote/:id', fetchuser, [
    body('title', 'Enter title').isLength({ min: 3 }), //express validator used for cleaning inputs before saving in db
    body('description', 'Enter description').isLength({ min: 5 })
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const newNote = {};
        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag }

        // Find req note to be updated
        let note = await Notes.findById(req.params.id);
        if (!note) return res.status(404).send("Not Found")

        if (note.user.toString() !== req.user.id)
            return res.status(401).send("Not allowed")

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json(note);
        
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error");
    }
})

// To delete note
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // const { title, description, tag } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Find req note to be deleted
        let note = await Notes.findById(req.params.id);
        if (!note) return res.status(404).send("Not Found");

        if (note.user.toString() !== req.user.id) {
            // If user ownes allow to delete
            return res.status(401).send("Not allowed");
        }

        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note is deleted" });

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error");
    }
})


module.exports = router;
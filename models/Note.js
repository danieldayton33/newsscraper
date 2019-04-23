const mongoose = require('mongoose');

Schema = mongoose.Schema;

const NoteSchema = new Schema({
    body: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    lastUpdated: {
        type: Date,
        default: Date.now

    }
});

const Note = mongoose.model("Note", NoteSchema);

module.exports = Note;
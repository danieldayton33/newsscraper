$(document).ready(function(){
    $('.modal').modal();
    $('.collapsible').collapsible();
  });
        
// open modal and get notes
$(document).on('click', '#open-notes', function(e){
    e.preventDefault();
    $("#note-title").val("");
    $("#note-body").val(""); 
    $("#article-title").remove();
    $("#note-area").empty();
    console.log('IVE BEEN CLICKED');
    const articleId = $(this).attr('data-id')
    console.log('ARTICLE ID', articleId);
    $.ajax({
    url: "/notes/" + articleId,
    method: "GET"}).then(result => {
        console.log("OPEN NOTES RESULT", result);
        const articleTitle = $("<h4>").text(result.title)
        articleTitle.attr("data-id", articleId);
        articleTitle.attr("id", "article-title");
        console.log("ARTICLE TITLE", articleTitle)
        $(".modal-content").prepend(articleTitle);
        if(result.notes.length > 0) {
            addNotes(result.notes);
        } else{
            const noNote = $("<li>")
            const noDiv = $("<div>").addClass("collapsible-header").text("No notes yet!");
            noNote.append(noDiv);
            $("#note-area").append(noNote);
        }
        // $(".modal").modal();
    });
});
$(document).on('click', '#save-article', function(e){
    e.preventDefault();
    console.log('IVE BEEN CLICKED');
    const articleId =$(this).attr('data-id');
    $.ajax({
        url: '/save/' + articleId,
        method: 'PUT'
    }).then(result => {
        console.log(result);
    });
});

$("#save-notes").on("click", function(e) {
    e.preventDefault();
    const data = {title: $("#note-title").val(), body: $("#note-body").val()}
    console.log(data);
    const id = $("#article-title").attr("data-id");
    $("#note-title").val("");
    $("#note-body").val(""); 
    $.ajax({
        url: "/savenote/"+id,
        method: "POST",
        data: data
    }).then(result => {
        console.log("SAVE NOTES RESULT", result);
        addNotes(result.notes);
    });
});

const addNotes = (notes) => {
    $("#note-area").empty();
    console.log("NOTES", notes);
    notes.forEach(note => {
        console.log("NOTE", note);
        const newLine = $("<li>")
        const newDiv = $("<div>").addClass("collapsible-header")
        const titleSpan = $("<span>").text(note.title);
        const newIcon = $("<i>").addClass("material-icons").text("whatshot");
        newDiv.append(newIcon, titleSpan);
        const childDiv = $("<div>").addClass("collapsible-body");
        const newSpan = $("<span>").text(note.body);
        const editButton = $("<a>").addClass("waves-effect waves-light btn").text("Edit");
        editButton.attr("id", "edit-note");
        editButton.attr("data-id", note._id);
        const deleteButton = $("<a>").addClass("waves-effect waves-light btn red").text("Delete");
        deleteButton.attr("id", "delete-note");
        deleteButton.attr("data-id", note._id);
        // const editIcon = $("<i>").addClass("material-icons").text("edit");
        // editButton.html(`<i class="material-icons left">`)
        // editButton.text("Edit");
        childDiv.append(newSpan, editButton, deleteButton);
        newLine.append(newDiv, childDiv);
        $("#note-area").append(newLine);
    });
}
//edit the note
$(document).on("click", "#edit-note", function(e) {
    e.preventDefault();
    const id = $(this).attr("data-id");
    const editDiv = $(this).parent("div")
    const currentText = editDiv.val();
    editDiv.empty();
    const editButton = $("<a>").addClass("waves-effect waves-light btn").text("Change");
    editButton.attr("id", "update-note");
    editButton.attr("data-id", id);
    const deleteButton = $("<a>").addClass("waves-effect waves-light btn red").text("Delete");
    deleteButton.attr("id", "delete-note");
    deleteButton.attr("data-id", id);
    const editInput = $("<input>").attr("id", "edit-text");
    editDiv.append(editInput, editButton, deleteButton);
});

$(document).on("click", "#update-note", function(e) {
    const artId = $("#article-title").attr("data-id");
    const noteId = $(this).attr("data-id");
    const body=  $("#edit-text").val();
    $.ajax({
        url: "/note/"+ artId,
        method: "PUT",
        data: {id: noteId, body: body}
    }).then(result => {
        console.log("UPDATE RESULT", result);
        addNotes(result[0].notes);
    });
});

$(document).on("click", "#delete-note", function(e) {
    
});





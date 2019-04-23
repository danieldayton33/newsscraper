$(document).ready(function(){
    $('.modal').modal();
  });
        
// open modal and get notes
$(document).on('click', '#open-notes', function(e){
    e.preventDefault();
    console.log('IVE BEEN CLICKED');
    const articleId = $(this).attr('data-id')
    console.log('ARTICLE ID', articleId);
    $.ajax({
    url: "/notes/" + articleId,
    type: "GET"}).then(result => {
        console.log(result);
        const articleTitle = $("<h4>").text(result.title)
        articleTitle.attr("data-id", articleId);
        articleTitle.attr("id", "article-title");
        console.log("ARTICLE TITLE", articleTitle)
        $(".modal-content").prepend(articleTitle);
        if(!result.note) {
            $("#note-area").text("No notes yet!")
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
        type: 'PUT'
    }).then(result => {
        console.log(result);
    });
});

$("#save-notes").on("click", function(e) {
    e.preventDefault();
    const data = {title: $("#note-title").val(), body: $("#note-body").val()}
    console.log(data);
    const id = $("#article-title").attr("data-id");

    $.ajax({
        url: "/savenote/"+id,
        method: "POST",
        data: data
    }).then(result => {
        console.log(result);
    });
});

const addNotes = (notes) => {
    notes.forEach()
}

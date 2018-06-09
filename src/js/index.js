var $ = require('jquery')
var eventBus = require('./eventBus.js')
 
// Route.set('/hello/:variable', function(variable){
//   console.log('hello', variable);
// });
 
// Route.group({
//   'path/to/something': function(){},
//   'path/to/something/else': function(){},
// });
 
// Route.init();

$(document).ready(()=>{
    window.changeView = function(viewID){
        $(`#${viewID}`).show().siblings('section').hide()
    }
    window.eventBus = eventBus
})

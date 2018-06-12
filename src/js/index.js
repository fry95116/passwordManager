var $ = require('jquery')
var eventBus = require('./eventBus')
 
var Vue = require('vue')

var actionBar = require('./views/actionBar')
var toolBar = require('./views/toolBar')
var mainFunctions = require('./views/mainFunctions')

window.actionBar = actionBar
window.toolBar = toolBar
window.mainFunctions = mainFunctions
// Route.set('/hello/:variable', function(variable){
//   console.log('hello', variable);
// });
 
// Route.group({
//   'path/to/something': function(){},
//   'path/to/something/else': function(){},
// });
 
// Route.init();

// $(document).ready(()=>{
//     window.changeView = function(viewID){
//         $(`#${viewID}`).show().siblings('section').hide()
//     }
//     window.eventBus = eventBus

//     $('.tool-bar .btn:eq(0)').click(function(){
//         // window.changeView('newPasswordBook')

//         // $('#passwordBooks').css('animation', 'slide-out-right 0.3s')
//         $('#newPasswordBook').css({
//             'display': 'block',
//             'z-index': 1,
//             'animation': 'slide-in-left 0.2s ease-out'
//         })
//         setTimeout(function(){
//             $('#passwordBooks').css({
//                 display: 'none',
//                 animation: 'unset'
//             })
//             $('#newPasswordBook').css({
//                 animation: 'unset'
//             })
//         }, 200)
//     })

    
//     $('#newPasswordBook .action-bar .btn').click(function(){
//         // window.changeView('newPasswordBook')

//         // $('#passwordBooks').css('animation', 'slide-out-right 0.3s')
//         $('#newPasswordBook').css({
//             'display': 'block', 
//             'animation': 'slide-out-left 0.2s ease-in'
//         })
//         $('#passwordBooks').css({
//             display: 'block',
//         })
//         setTimeout(function(){

//             $('#newPasswordBook').css({
//                 'animation': 'unset',
//                 'display': 'none', 
//             })
//         }, 200)
//     })
// })

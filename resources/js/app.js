require('./bootstrap');

// window.Vue = require('vue');
// Vue.component('example-component', require('./components/ExampleComponent.vue').default);
// const app = new Vue({
//     el: '#app'
// });


import Echo from "laravel-echo"
window.io = require('socket.io-client');

window.Echo = new Echo({
    broadcaster: 'socket.io',
    host: window.location.hostname + ':6001'
});

let onlineUsers = 0;
window.Echo.join(`online`)
    .here((users) => {
        console.log(users);
        onlineUsers = users.length;
        if (onlineUsers > 1) {
            $('#no-online-users').hide();
            // $('#no-online-users').css('display', 'none');
        }

        let userId = $('meta[name=user-id]').attr('content');
        users.forEach(function (user) {
            if (user.id == userId) {
                return;
            }

            $('#online-users').append(`<li id="user-${user.id}" class="list-group-item"><i class="fas fa-circle text-success"></i> ${user.name}</li>`)
        });
    })
    .joining((user) => {
        console.log(user.name + ' joined');
        onlineUsers++;
        $('#no-online-users').hide();
        // $('#no-online-users').css('display', 'none');
        $('#online-users').append(`<li id="user-${user.id}" class="list-group-item"><i class="fas fa-circle text-success"></i> ${user.name}</li>`);
    })
    .leaving((user) => {
        console.log(user.name + ' left');
        $('#user-' + user.id).remove();
        onlineUsers--;

        if (onlineUsers <= 1) {
            $('#no-online-users').show();
            // $('#no-online-users').css('display', 'block');
        }
    });

$('#chat-text').keypress(function(e){
    if (e.which == 13) {
        let input = $(this);
        send_message(e, input)
    }
});

$('#chat-submit').click(function (e) {
    let input = $('#chat-text');
    send_message(e, input)
});

function send_message(e, input){
    e.preventDefault();
    let body = input.val();
    let data = {
        '_token' : $('meta[name=csrf-token]').attr('content'),
        body
    }
    input.val('');
    $.ajax({
        type: "post",
        url: input.data('url'),
        data: data,
        success: function (response) {
            console.log(response);
            $('#chat').append(`
            <div>
                <span class="my-2 p-2 text-secondary bg-light rounded float-right">${$('#navbarDropdown').text()}</span>
                <span class="m-2 p-2 text-white rounded float-right bg-primary">${body}</span>
                <div class="clearfix"></div>
            </div>`
            );
        },
        error: function (response) {
            console.error(response.responseJSON);
            }
    });
}

window.Echo.channel('chat-group')
            .listen('MessageSent', (e) => {
                console.log(e.message);
                $('#chat').append(`
                <div>
                    <span class="my-2 p-2 text-secondary bg-light rounded float-left">${e.message.user.name}</span>
                    <span class="m-2 p-2 text-white rounded float-left bg-secondary">${e.message.body}</span>
                    <div class="clearfix"></div>
                </div>`
                );
            });

$(document).ready(function(e) {
    $('#chat').scrollTop(10000);
    $('#chat').animate({ scrollTop: 10000 });
});

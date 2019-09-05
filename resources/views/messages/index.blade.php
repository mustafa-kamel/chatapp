@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-3">
            <div class="card">
                <div class="card-header">
                    Online Users
                </div>
                @if (session('status'))
                    <div class="alert alert-success" role="alert">
                        {{ session('status') }}
                    </div>
                @endif

                <h5 id="no-online-users" class="list-group-item">No Online Users</h5>
                <ul id="online-users" class="list-group"></ul>
            </div>
        </div>
        <div class="col-md-7 d-flex flex-column" style="height: 80vh;">
            <div class="card-header">
                Conversation <span id="chat-user-name"></span>
            </div>

            <div id="chat" class="card h-100 mb-4 p-5 bg-white" style="overflow-y: scroll; scrollbar-width: thin;">
                @isset($messages)
                    @foreach ($messages as $message)
                        <div>
                            <span class="my-2 p-2 text-secondary bg-light rounded {{ auth()->user()->id == $message->user_id ? 'float-right' : 'float-left' }}">{{ $message->user->name }}</span>
                            <span class="m-2 p-2 text-white rounded {{ auth()->user()->id == $message->user_id ? 'float-right bg-primary' : 'float-left bg-secondary' }}">{{ $message->body }}</span>
                            <div class="clearfix"></div>
                        </div>
                    @endforeach
                @endisset
            </div>
            <form action="" class="d-flex">
                <input id="chat-text" type="text" name="message" data-url="{{ route('messages.store') }}" class="form-control mr-2">
                <button id="chat-submit" class="btn btn-primary">Send</button>
            </form>
        </div>
    </div>
</div>
@endsection

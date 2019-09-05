<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Message;

use App\Events\MessageSent;

class MessageController extends Controller
{
    public function index () {
        $messages = Message::all();
        return view('messages.index', compact('messages'));
    }

    public function store(Request $request)
    {
        $request->validate(['body' => 'string']);
        $message = auth()->user()->messages()->create(['body'  =>  $request->body,]);
        broadcast(new MessageSent($message->load('user')))->toOthers();
    }
}

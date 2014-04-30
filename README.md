XMPP2CONSOLE	{#welcome}
=====================
This is a simple Node.js application that allows you to interact with a remote system via the xmpp protocol (aka Jabber,gtalk,etc )

> NOTE:  Running commands thru this app is highly dangerous use it at your own risk

Requirements:
-------------
you need [node.js][1] and npm

Installation:
------------
npm install 

Configuration:
--------------

rename config/config.json.demo to config/config.json

take a look inside

    config/config.json

Getting Started:
----------------
prepparation: you will need:

 - 1 xmpp server (openfire for local or private networks will do just fine, google will be fine too)
 - an Account for your server bot like: server01@mynetwork.com or server01.mycomp@gmail.com (google apps accounts will work too)
 - Your own account in the same server.
 - you need to make this two accounts buddies (use whatever jabber client you like:pidgin, miranda im, gtalk, google hang outs) so they can see each other.

Now you have all of the above you're ready to go.
go to your server checkout the project or copy the files and execute it app.js like:

    node app.js
then the server will start an xmpp bot with the user (JID) and password provided in **config/config.json**

Some usefull commands
---------------------

init: Will print you the hostname and the result of uname -a
init executes a chain of commands that is defined in **config/config.json**



 
  [1]: http://nodejs.org/
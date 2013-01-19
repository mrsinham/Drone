Drone
=====

Drone extension for Chrome for monitoring applications status.

For the moment, no packaged version exists, so you need to install it via folder, activating the extension developper mode (in the extension page)

Screenshots
============
[image]: https://raw.github.com/mrsinham/Drone/master/example/screenshots/home.jpg "Drone Home"

Prequisite
==========

Chrome version superior to 24.0.0 (rename ofwebkitIndexedDB to indexedDb)

Probes
==========
This extension use distants probes that must be written in proper format. See an example :


    {
      code: 200,
      response: "Ok",
      applications: [
      {
        name: "MyDBAccess",
        code: 200,
        response: "Database up and running"
      },
      ],
      environment: {
        server: "server-21.dc",
        php: "5.3.10-1",
        memcache: "2.2.6",
        memcached: "2.1.0",
        amqp: "1.7",
        mysqli: "0.1"
      }
    }

Example explanation
-------------------

1.  __code__ : Drone use http code to represent state of system. 200 is ok (green), other are nok.
2.  __response__ : A general message representing the state of the system
3.  __applications__ : composed of a name, a http code and response message, it represents an application that compose the system. For example, access to db
4.  __environment__ : represents the context. It shows you what are the component of your system. Essentially contexts variable like name of th server of version of a component. This is a set of key values pairs.


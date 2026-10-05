self.addEventListener("push",(event)=>{
    const data=event.data
    ?event.data.json()
    :{
        title:"HopeWell City Hospital",
        body:"You have a new notification"
    };
    event.waitUntil(
        self.registration.showNotification(data.title,{
            icon:"/favicon.ico",
            badge:"/favicon.ico"
        })
    );
});
self.addEventListener("notificationclick",(event)=>{
    event.notification.close();
    event.waitUntil(
        clients.openWindow("http://localhost:5173/notifications")
    );
});
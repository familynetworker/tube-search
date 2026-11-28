// Tube Search phone alerts. Pushes carry no data: ask the members server what to show.
var SERVER="https://tubesearch-members.tubesearch.workers.dev";
self.addEventListener('install',function(){self.skipWaiting()});
self.addEventListener('activate',function(e){e.waitUntil(self.clients.claim())});
self.addEventListener('push',function(e){e.waitUntil(self.registration.pushManager.getSubscription().then(function(s){
  return fetch(SERVER+'/push/latest',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({endpoint:s&&s.endpoint})}).then(function(r){return r.json()})
}).catch(function(){return {title:'Tube Search',body:'Something new is waiting for you.'}}).then(function(n){
  var o={body:n.body||'',icon:'icon-192.png',badge:'icon-192.png',tag:n.tag||'ts',renotify:true,vibrate:[120,60,120,60,240],requireInteraction:!!n.req,data:{url:n.url||'./',id:n.id||0,acts:n.actions||[]}};
  if(n.image)o.image=n.image;if(n.actions&&n.actions.length)o.actions=n.actions.map(function(a,i){return {action:'a'+(i+1),title:a.t}});
  return self.registration.showNotification(n.title||'Tube Search',o)
}))});
self.addEventListener('notificationclick',function(e){e.notification.close();var d=e.notification.data||{},act=e.action||'',u=d.url||'./';
  if(act){var k=Number(act.slice(1))-1;if(d.acts&&d.acts[k]&&d.acts[k].u)u=d.acts[k].u}
  u=new URL(u,self.registration.scope).href;
  if(d.id)fetch(SERVER+'/push/latest',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({open:d.id,act:act})}).catch(function(){});
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(function(ws){for(var i=0;i<ws.length;i++){if('focus' in ws[i]){try{ws[i].navigate(u)}catch(x){}return ws[i].focus()}}return self.clients.openWindow(u)}))});

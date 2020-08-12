// urlB64ToUint8Array is a magic function that will encode the base64 public key
// to Array buffer which is needed by the subscription option
const urlB64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
    const rawData = atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}


// saveSubscription saves the subscription to the backend
const saveSubscription = async subscription => {
    const SERVER_URL = 'http://localhost:4000/save-subscription';
    const response = await fetch(SERVER_URL, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription)
    });
    return response.json();
}

self.addEventListener('activate', async () => {
    console.log('Hello from service worker');
    const applicationServerKey = urlB64ToUint8Array("BDJVVOgusKL4rEmSp9f63wIOYsRkaXF4sQIiNz5393JEPTSlmCCINPMorBhgm0Jai3V0o0f7mLDevOo6ME1OOxs");
    try {
        const options = {
            applicationServerKey,
            userVisibleOnly: true
        };
        const subscription = await self.registration.pushManager.subscribe(options);
        const response = await saveSubscription(subscription);
        console.log(response);
    }
    catch (err){
        console.log('Error', err);
    }
})

const showLocalNotification = (title, body, swRegistration) => {
    const options = {
        body
    }
    swRegistration.showNotification(title, options);
};

self.addEventListener('push', (event) => {
    if(event.data) {
        console.log('Push event', event.data.text());
        showLocalNotification('Push Notification!!!', event.data.text(), self.registration);
    } else {
        console.log('Push event but no data');
    }
})
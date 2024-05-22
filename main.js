const cacheName = 'myCache';

const resultDiv = document.getElementById('result');
const df = new DocumentFragment();

function init(){
    fetch('https://picsum.photos/v2/list?page=2&limit=30')
        .then((response) => {
            if (!response.ok) throw new Error(response.statusText);

            return response.json();
        })
        .then((data) => {
            console.log(data)

            const headers = new Headers({
                'Content-Type': 'image/jpg',
                'X-custom-header': 'fetch images',
                'Cache-Control': 'max-age=604800', //expiration
            });

            data.forEach((data)=>{ 
                let downloadUrl = data.download_url;

                const response = new Response(data, {
                    status: 200,
                    statusText: 'All Good',
                    headers: headers,
                });

                caches.open(cacheName)
                .then((cache) => {
                    cache.put(downloadUrl, response)
                })
                .catch((err) => {
                    console.log(err.message);
                });
            })
        })
        .then(()=>{
            displayImages();
        })
        .catch((err) => {
            console.log('error', err);
        })

}
function displayImages(){
    caches.open(cacheName)
            .then((cache) => {
                return cache.keys();
            })
            .then((keys)=>{
                keys.forEach((request)=>{
                    console.log(request.url);

                    let img = document.createElement('img');
                    img.src = request.url;
                    img.style.width = '8rem';
                    img.style.height = '8rem'

                    df.append(img);

                })
                resultDiv.append(df);
            })
            .catch((err)=>{
                console.log('error', err);
            })
}
document.addEventListener('DOMContentLoaded', init);
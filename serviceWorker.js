self.addEventListener("install", (event) => {});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        fetch(event.request).then((response) => {
            return response;
        }).catch(() => {
            return new Response(
                `
                <!DOCTYPE html>
                <html lang="EN">
                    <head>
                        <meta charset="utf-8">
                        <meta http-equiv="X-UA-Compatible" content="IE=edge">
                        <meta name="apple-mobile-web-app-capable" content="yes">
                        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0, viewport-fit=cover, minimum-scale=1, maximum-scale=1">
                        <meta name=description content="Basic Chat Progressive Web App (PWA) using supabase">

                        <title>supabase-chat</title>
                        <meta name="theme-color" content="#FFF" />
                    </head>
                    <body style="display: flex;justify-content: center;align-items: center;width: 100vw;heigth: 100svh;overflow: hidden;user-select: none;-webkit-tap-highlight-color: transparent;-webkit-touch-callout: none;">
                        <h1>Device is offline</>
                    </body>
                </html>
                `,
                {
                    headers: {"Content-Type": "text/html"}
                }
            );
        })
    );
});

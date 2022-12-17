const {app, server} = require("./sokets.js")
const {PORT} = require("./server-const")

//const {app, server} = config
async function start() {
    // app.get("/", function(request, response){
    //     response.send("<h2>Привет Express!</h2>");
    // });
    console.log("PORT", PORT)
    server.listen(PORT || 4000, () => {
        console.log("sterted on port 4000 ")
    })
}

start()
class FXMLHttpRequest {

    data = {};


    open(method, url, isAsync = true, user = null, password = null) {
        this.data = {
            "method": method,
            "url": url,
            "isAsinc": isAsync,
            "user": user,
            "password": password
        };
    }

    send(body = "", func = () => { }) {
        //TODO: send the request via network class
        let net = new network();
        const d = this.data
        if (this.data["isAsinc"]) {
            net.send_to_server_async(JSON.stringify({ d, body }), func);
        }
        else {
            net.send_to_server(JSON.stringify({ d, body }));
        }
    }
}
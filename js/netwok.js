class network{
    serv = new server();

    send_to_server_async(data, dispatcher){    
        this.serv.prossess_data(data, dispatcher);
    }

    send_to_server(data){
        let result =  this.serv.prossess_data(data);
        return result;
    }
}
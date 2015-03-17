module.exports.config = {
    /*
        Set Main settings, like top level domain where sit is running.
    */
    main: {
        domain: 'https://sitreper-christophersw.c9.io'
    },
   
    /*
        Set Email provider.
    */
    email: {
        options: 
        {
            service: 'Mailgun',
            auth: {
                api_key: '' //From https://mailgun.com/cp
            },
            domain: '' //Valid domain from https://mailgun.com/cp
        }
    }    
};
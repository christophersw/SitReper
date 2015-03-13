var config = {
    /*
    *Set Email provider.
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

module.exports.config = config;
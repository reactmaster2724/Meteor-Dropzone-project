import { Config } from '../../api/config/config.js';
import { generateConfig } from '../../api/config/method';


Meteor.startup(function() {
    BrowserPolicy.content.allowDataUrlForAll();
    BrowserPolicy.content.allowDataUrlForAll('blob:');
    BrowserPolicy.content.allowDataUrlForAll('fonts.gstatic.com');
    BrowserPolicy.content.allowSameOriginForAll();

    BrowserPolicy.content.allowDataUrlForAll()



    BrowserPolicy.content.allowOriginForAll('fonts.googleapis.com');
    BrowserPolicy.content.allowInlineStyles();
    BrowserPolicy.content.allowOriginForAll('fonts.gstatic.com');

    console.log('test', Config.find().count());
    if (Config.find().count() === 0) {
        generateConfig.run();
    }


});
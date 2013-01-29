/*global Handlebars */
/*jslint node: true, plusplus: true, evil: true */

var path = require( "path" ),
    root = path.resolve( __dirname, "../src/template/" + "/" ),
    fs = require( "fs" );


module.exports = function( _, anvil ) {

    "use strict";

    // Backbone on Express Project
    anvil.scaffold({

        type: "boe",
        description: "Creates a new Backbone on Express application",

        prompt: [{
            name: "name",
            description: "Your application name:",
            required: true

        }, {
            name: "secret",
            description: "A password to keep your application secure:",
            required: true
        }],

        output: {

            "{{path}}": {

                "server.js": anvil.scaffold.file( root + "js/server.js" ),
                "build.json": anvil.scaffold.file( root + "json/build.json" ),
                "package.json": anvil.scaffold.file( root + "json/package.json" ),
                ".gitignore": anvil.scaffold.file( root + ".gitignore" ),
                "test/.empty": anvil.scaffold.file( root + ".empty" ),

                "app": {
                    
                    "controllers": {
                        "app_controller.js": anvil.scaffold.file( root + "js/appcontroller.js" ),
                        "pages_controller.js": anvil.scaffold.file( root + "js/pagescontroller.js" )
                    },

                    "config": {
                        "routes.js": anvil.scaffold.file( root + "js/router-server.js" ),
                        "environments": {
                            "development.json": anvil.scaffold.file( root + "json/config-custom.json" ),
                            "production.json": anvil.scaffold.file( root + "json/config-custom.json" ),
                            "global.json": anvil.scaffold.file( root + "json/config-global.json" )
                        }
                    }

                },

                "public": {

                    "scripts": {
                        "app.js": anvil.scaffold.file( root + "js/app.js" ),
                        "collections/.empty": anvil.scaffold.file( root + ".empty" ),
                        "models/.empty": anvil.scaffold.file( root + ".empty" ),
                        "config/router.js": anvil.scaffold.file( root + "js/router-client.js" ),
                        "views/pages/home.js": anvil.scaffold.file( root + "js/view.js" )
                    },

                    "templates": {
                        "layout.ejs": anvil.scaffold.file( root + "ejs/layout.ejs" ),
                        "pages/home.ejs": anvil.scaffold.file( root + "ejs/home.ejs" )
                    }
                }

            }

        }
    });

    // Backbone on Express Crud
    anvil.scaffold({

        type: "boe:crud",
        description: "Creates the CRUD functionality for a Backbone on Express module",

        prompt: [{
            name: "name",
            description: "The module name (ie: user):",
            required: true
        }, {
            name: "fields",
            description: "The fields to be used in the module (ie: firstName: String, phone: Number):",
            required: true
        }],

        render: function ( data ) {
            var template, i, field, type,
                fields = data.fields.replace(/ /g, '').split(',');
            
            data.fields = fields;
            data.schema = {};
            data.schemaDefaults = {};
            data.fieldsArray = [];
            
            for (i = 0; i < fields.length; i++) {
                    
                field = fields[i].split(':')[0];
                type = fields[i].split(':')[1];

                data.schema[field] = {
                    type: eval(type || 'String')
                };

                data.fieldsArray.push(field);

                data.schemaDefaults[field] = '';

            }

            data.schemaStr = JSON.encode(data.schema);
            data.schemaDefaultsStr = JSON.encode(data.schemaDefaults);

            template = Handlebars.compile( data.template );

            return template( data.data );
        },

        output: {

            "{{path}}": {
                "app": {
                    "controllers/{{name}}s_controller.js": anvil.scaffold.file( root + "js/controller.js" ),
                    "config/routes.js": function (data) {
                        var file = fs.readFileSync( path + "/app/config.routes.js" );
                        return file.replace("crud: [", "crud: [" + data.name + ",");
                    }
                },
                "public": {

                    "scripts": {
                        "views/{{name}}": {
                            "edit.js": anvil.scaffold.file( root + "js/view.js" ),
                            "index.js": anvil.scaffold.file( root + "js/view.js" ),
                            "new.js": anvil.scaffold.file( root + "js/view.js" ),
                            "show.js": anvil.scaffold.file( root + "js/view.js" )
                        },
                        "models/{{name}}_model.js": anvil.scaffold.file( root + "js/model.js" ),
                        "collections/{{name}}s_collection.js": anvil.scaffold.file( root + "js/collection.js" )
                    },

                    "templates/{{name}}": {
                        "_form.ejs": anvil.scaffold.file( root + "ejs/_form.ejs" ),
                        "index.ejs": anvil.scaffold.file( root + "ejs/index.ejs" ),
                        "new.ejs": anvil.scaffold.file( root + "ejs/new.ejs" ),
                        "edit.ejs": anvil.scaffold.file( root + "ejs/edit.ejs" ),
                        "show.ejs": anvil.scaffold.file( root + "ejs/show.ejs" )
                    }

                }
            }

        }

    });

};
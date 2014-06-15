module.exports = function(grunt) {
    
    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),

        compile: {
            build: {
                src: 'data/',
                dest: 'bin/data'
            }
        },
        
        clean: ["bin/"],
        
        requirejs : {
            compile : {
                options : {
                    baseUrl  : "src",
                    out      : "bin/Crystal.min.js",
                    optimize : 'uglify2',
                    name     : 'main',

                    uglify2 : {
                        mangle : true
                    },

                    paths : {
                        jquery    : 'external/jquery-2.1.1.min',
                    }
                }
            }
        },

        cssmin : {
            combine : {
                files : {
                    'bin/<%= pkg.name %>.min.css' : [
                        'data/css/*.css',
                    ]
                }
            }
        },

        copy : {
            main : {
                files : [
                    { cwd: 'www', src: '**/*', dest: 'bin', expand: true },
                    { cwd: 'data/images', src: '**/*', dest: 'bin/images', expand: true },
                ]
            }
        },
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-clean');
    
    grunt.loadTasks("./src/data/");

    // Default task(s).
    grunt.registerTask('default', [
        'compile',
        'clean',
        'requirejs',
        'cssmin',
        'copy',
    ]);
};

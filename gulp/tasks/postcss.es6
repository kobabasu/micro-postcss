'use strict';

import gulp from 'gulp';
import DefaultRegistry from 'undertaker-registry';
import shell from '/usr/local/lib/node_modules/gulp-shell';

import { dir } from '../dir.es6';

class Postcss extends DefaultRegistry {

  init() {
    // task名の接頭辞を設定
    let prefix = (dir.name == '') ? '' : dir.name + ':';

    /*
     * postcss
     */
    const style = {
      src:     dir.src  + 'style.css',
      dist:    dir.dist + 'style.css',
      watch:   dir.src  + '**/*.*'
    };

    gulp.task(prefix + 'postcss', shell.task([`
      postcss ${style.src} \
      -o ${style.dist}

      postcss ${dir.pages + '**/*.css'} \
      -d ${dir.dist};
    `]));


    /*
     * min
     */
    gulp.task(prefix + 'postcss:min', shell.task([`
      postcss --no-map ${style.src} -o ${style.dist};
      postcss --no-map ${dir.pages + '**/*.css'} -d ${dir.dist};
      for file in \`find ${dir.dist} -type f -name '*.css'\`; do
        name=\`echo $file | awk -F/ '{print $NF}' | grep -v '.*min.*' | sed -e 's/\\..*//g'\`;
        if [ ! -n $name ]; then
          csswring $file > ${dir.dist}$name.min.css;
        fi
      done;
    `]));
      

    /*
     * copy
     */
    gulp.task(prefix + 'postcss:copy', shell.task([`
      mkdir -p ${dir.root + '../css'};
      cp -r ${dir.root + 'stylesheets'} ${dir.root + '../stylesheets'};
    `]));


    /*
     * example
     */
    const example = {
      dist:  dir.example.css.dist
    };

    gulp.task(prefix + 'postcss:example', shell.task([`
      postcss --no-map ${style.src} -o ${dir.example.css.dist + 'style.css'};
      postcss --no-map ${dir.pages + '**/*.css'} -d ${dir.example.css.dist};

      for file in \`find ${dir.dist} -type f -name '*.css'\`; do
        name=\`echo $file | awk -F/ '{print $NF}' | grep -v '.*min.*' | sed -e 's/\\..*//g'\`;
        if [ ! -n $name ]; then
          csswring $file > ${dir.example.css.dist}$name.min.css;
        fi
      done;
    `]));


    /*
     * example:nodejs
     */
    gulp.task(prefix + 'postcss:nodejs', shell.task([`
      mocha ${dir.test}*.js \
      -g '^(?!DOM)'
    `]));


    /*
     * example:phantomjs
     */
    gulp.task(prefix + 'postcss:phantomjs', shell.task([`
      for f in \`ls ${dir.test}*.html\`
      do
        phantomjs ${dir.node_module_path}node_modules/mocha-phantomjs-core/mocha-phantomjs-core.js $f
      done
    `]));


    /*
     * nodejs:report
     */
    gulp.task(prefix + 'postcss:nodejs:report', shell.task([`
      mocha ${dir.test}*.js \
      --reporter mocha-junit-reporter \
      --reporter-options mochaFile=${dir.report.nodejs} \
      -g '^(?!DOM)'
    `]));


    /*
     * phantomjs:report 
     */
    gulp.task(prefix + 'postcss:phantomjs:report', shell.task([`
      if [ -f "${dir.report.phantomjs}" ]; then
        rm ${dir.report.phantomjs};
      fi
      for f in \`ls ${dir.test}*.html\`
      do
        phantomjs ${dir.node_module_path}node_modules/mocha-phantomjs-core/mocha-phantomjs-core.js $f xunit >> ${dir.report.phantomjs}
      done
    `]));


    /*
     * example:mocha
     */
    gulp.task(prefix + 'postcss:mocha', gulp.series(
        prefix + 'postcss:nodejs',
        prefix + 'postcss:phantomjs'
    ));


    /*
     *  example:mocha:report
     */
    gulp.task(prefix + 'postcss:mocha:report', gulp.series(
        prefix + 'postcss:nodejs:report',
        prefix + 'postcss:phantomjs:report'
    ));


    /*
     * watch
     */
    gulp.task(prefix + 'postcss:watch', () => {
      gulp
        .watch(
          [style.watch],
          gulp.series(prefix + 'postcss')
        )
        .on('error', err => process.exit(1));
    });


    /*
     * build
     */
    gulp.task(prefix + 'postcss:build',
      gulp.series(
        prefix + 'postcss:copy',
        prefix + 'postcss',
        prefix + 'postcss:min',
        prefix + 'postcss:example'
        // prefix + 'postcss:docs'
    ));
  }
};

module.exports = new Postcss();

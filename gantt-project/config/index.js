'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {//������������

    // Paths
    assetsSubDirectory: 'static',//��Ŀ¼�����css,js,img���ļ�
    assetsPublicPath: '/',//��Ŀ¼
    proxyTable: {
		// '/api': {
		//     target: 'http://localhost:45337',
		//     pathRewrite: {
		//       '^/api': ''
		//     }
		//   }
    },//���� �����ø����Խ������

    // Various Dev Server settings
    host: 'localhost', //��ַ
    port: 8080, //�˿ں�
    autoOpenBrowser: false,//�Ƿ��ڱ�����
    errorOverlay: true,//�����������ʾ
    notifyOnErrors: true,//��ƽ̨������ʾ
    poll: false,  //ʹ���ļ�ϵͳ(file system)��ȡ�ļ��Ķ���֪ͨdevServer.watchOptions

    
    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',//���ӵ��ԣ�������ΪԭʼԴ���루�����У�����������������ʹ��

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,//����ʧЧ
    cssSourceMap: true////����ѹ������е�bug��λ���ǳ����ѣ���������sourcemap��¼ѹ��ǰ���λ����Ϣ��¼������������ʱֱ�Ӷ�λ��δѹ��ǰ��λ�ã������ķ������ǵ���
  },

  build: {//��������
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),//index��������ɵ�λ�ú����֣�������Ҫ�ı��׺������index.php

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),//��������ַ
    assetsSubDirectory: 'static',//js,css,images����ļ�����
    assetsPublicPath: './',//�����ĸ�Ŀ¼��ͨ�����ش��dist����ļ��ᱨ���˴��޸�Ϊ./����������ߵ��ļ����ɸ����ļ����λ�ý��и���·��

    /**
     * Source Maps
     */

    productionSourceMap: false,//�Ƿ�����map�ļ�
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
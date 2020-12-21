module.exports = {
	ignoreFiles: [
		'zotero-connectors',
		'circle.yml',
		'gulpfile.js',
		'JabFox.sublime-project',
		'JabFox.sublime-workspace',
		'package-lock.json',
		'install_linux.sh'
	],
	run: {
		startUrl: [
			'about:debugging',
            'https://mp.weixin.qq.com/s?__biz=MzIyNjMxOTY0NA==&mid=2247487927&idx=1&sn=d6ce001939f0f8a7a8cec714b0b56f30&chksm=e8731dc4df0494d29f8d3434b4f081732b14d9676fed3da33ed27f7cb7f118dac4fc7f40bfd5&xtrack=1&scene=90&subscene=93&sessionid=1608058892&clicktime=1608060411&enterid=1608060411&ascene=56&devicetype=android-29&version=2700159a&nettype=WIFI&abtest_cookie=AAACAA%3D%3D&lang=zh_CN&exportkey=ARxVojwUr8w21rGm1%2F%2BEv%2Fg%3D&pass_ticket=Nm1MCCIMOo%2Bie9AjHaWg6R6coTCXf6geNvQrWy3axVC7z5P5QZGRltniMS%2BgxXCe&wx_header=1',
          'https://arxiv.org/abs/2012.10193',
		],
		browserConsole: true,
	},
	build: {
		overwriteDest: true
	}
};

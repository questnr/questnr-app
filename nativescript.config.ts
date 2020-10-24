import { NativeScriptConfig } from '@nativescript/core';

export default {
	id: 'com.questnr',
	// appResourcesPath: 'App_Resources',
	// Done by Brijesh Lakkad 
	appResourcesPath: 'app/App_Resources',
	android: {
		v8Flags: '--expose_gc',
		markingMode: 'none',
		id: 'com.questnr.android',
	},
	appPath: 'app'
} as NativeScriptConfig;

// ./build_installer.js

// 1. Import Modules
const { MSICreator } = require('electron-wix-msi');
const path = require('path');

// 2. Define input and output directory.
// Important: the directories must be absolute, not relative e.g
// appDirectory: "C:\\Users\sdkca\Desktop\OurCodeWorld-win32-x64", 
// const APP_DIR = path.resolve(__dirname, 'C:\\Users\\alethea\\Desktop\\IonicApp-win32-ia32');
const APP_DIR = path.resolve(__dirname, 'C:\\Users\\alethea\\Desktop\\Fresh Start\\SelfCareApp\\release-builds\\SelfCareApp-win32-ia32');
// outputDirectory: "C:\\Users\sdkca\Desktop\windows_installer", 
const OUT_DIR = path.resolve(__dirname, '.\windows_installer');
const iconPath = path.resolve(__dirname,'C:\\Users\\alethea\\Desktop\\Fresh Start\\SelfCareApp\\resources');

// 3. Instantiate the MSICreator
const msiCreator = new MSICreator({
    appDirectory: APP_DIR,
    outputDirectory: OUT_DIR,
    appIconPath: iconPath,
    // Configure metadata
    description: 'This is a demo application',
    exe: 'SelfCare',
    name: 'SelfCare Desktop App',
    manufacturer: 'Alethea.in',
    version: '1.0.0',

    // Configure installer User Interface
    ui: {
        chooseDirectory: true
    },
});

// 4. Create a .wxs template file
msiCreator.create().then(function(){

    // Step 5: Compile the template to a .msi file
    msiCreator.compile();
});
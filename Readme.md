# To run app  
1. On an Emulator:  
	A. Start the emulator by executing the following command -   
        	`cd ~/Android/Sdk/tools && ./emulator -avd <avd_device_name>`  
        B) Now go to Project root directory and run following command:  
        	`react-native run-android`
2. On a Device:  
please run following command on terminal:  
    	A) To start the development server - go to the project root directory and run following command:  
        	`npm start`  
        B) Now go to Project root directory and run following command:  
        	`react-native run-android`  
# To generate release apk  
1. Go to \<Project root directory\>/android  
2. run following command:  
`gradle clean assembleRelease`
#### The generated release apk file path:
\<Project root directory\>/android/app/build/outputs/apk/release/app-release.apk

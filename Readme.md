#To run app on 
	1.an emulator:
    	A) First get emulator running by running following command on terminal
        	cd ~/Android/Sdk/tools && ./emulator -avd <avd_device_name>
        B) Then to run the app go to Project root directory and run following command:
        	react-native run-android
    2.on real device please run following command on terminal:
    	A) To start development server go to Project root directory and run following command:
        	npm start
        B) Then to run the app go to Project root directory and run following command:
        	react-native run-android  
#To generate release apk 
	1.Go to ~<Project root directory>/android  
	2.run following command:
    	gradle clean assembleRelease
#Path to get the generated release apk file is as follows:
	~/<Project root directory>/android/app/build/outputs/apk/release/app-release.apk
        

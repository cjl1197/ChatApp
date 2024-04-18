import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,
        SafeAreaView, TouchableWithoutFeedback, Keyboard,
        KeyboardAvoidingView, Platform} from 'react-native';
import { auth } from '../firebase/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebase } from '../firebase/firebase';
import { GlobalContext } from '../../globalContext';


export default function Signup({navigation}) {

 // text fields input
    const [email, setEmail] = useState('');
    const {username, setUsername} = useContext(GlobalContext);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
   

 // error messages
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

 // boolean fields
    const [isSetPassword, setIsSetPassword] = useState(false);
    const [isConfirmPassword, setIsConfirmPassword] = useState(false);
    const [isMatched, setIsMatched] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    const [users, setUsers] = useState([]);
    const usersRef = firebase.firestore().collection('users');
    const { userID, setUserID } = useContext(GlobalContext);

    let id;

    useEffect(() => {
        usersRef
        .onSnapshot(
            querySnapshot => {
                const users = []
                querySnapshot.forEach((doc) => {
                    const { username, userID} = doc.data()
                    users.push({ 
                        id: doc.id,
                        username,
                        userID
                    })
                })
                setUsers(users)
            }
        )
     
    }, []);



 // checks to see if passwords match
    const passwordCheck = () => {
        if (password != confirmPassword) {
            setConfirmPasswordError('Passwords do not match');
            setIsMatched(false);
        }
        else 
        {
            setConfirmPasswordError('');
            setIsMatched(true);
        }
    }

    const addUser = async () => {
        var exists = false;
        users.map(users => {
            if (users.username === username) {
                alert('Username already in use')
                exists = true;
            }
        })
        if (!exists) {
            auth
            .createUserWithEmailAndPassword(email, password)

            .then(userCredentials => {
                const user = userCredentials.user;
		    // console.log(userCredentials);
                const id = user.uid;
		        console.log(id)
                // AsyncStorage.setItem('userID', id);
                console.log('Registered with: ', user.email);
                const data = {
                    userID: id,
                    username: username
                };
                setUserID(id);
                console.log(id);
                usersRef
                .add(data)
                //navigation.navigate("Login");
                navigation.replace("Home Screen")

            })
            .catch((error) => {alert(error.message)})

            try {
                // await AsyncStorage.setItem('user', username);
                // await AsyncStorage.setItem('userID', userID);
            } catch (error) {
                    alert(error)
            }

           
                
    }
}

 // handles the press of sign up button
    const handlePress = () => {
        setIsPressed(true);
        if (isMatched) {
            addUser()
        }
    }

 // calls password check each time one of the password text boxes changes
    useEffect (() => {
        passwordCheck();
    }, [password, confirmPassword]); 


    return (
    <TouchableWithoutFeedback onPress={() => {
        Keyboard.dismiss();
    }}>
      <SafeAreaView style={styles.main}>
        <KeyboardAvoidingView behavior={"padding"} >
        <View style={styles.container}>
        <View>
            <Text style={styles.welcome}>New Account</Text>
        </View>
        
        <View>
            <TextInput 
                style={styles.input} 
                placeholder=" Email Address" 
                onChangeText={(val) => setEmail(val)}
            />
             <TextInput 
                style={styles.input} 
                placeholder=" Username" 
                onChangeText={(val) => setUsername(val)}
            />
            <Text>{emailError}</Text>
            <TextInput 
                style={styles.input} 
                placeholder=" Enter Password" 
                onChangeText={(val) => setPassword(val)}
                secureTextEntry
            />  
            <TextInput 
                style={styles.input} 
                placeholder=" Confirm Password" 
                onChangeText={(val) => setConfirmPassword(val)}
                secureTextEntry
            />
            <Text style={styles.error}>{(isPressed) && confirmPasswordError}</Text>

            <View style={styles.btnWrapper}>
                <TouchableOpacity 
                    style={styles.signUpBtn}
                    onPress={handlePress}
                    >
                    <Text style={styles.signUpBtnText}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>

        <View style={styles.signUpContainer}>
            <Text>Already have an account?</Text> 
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.signUp}>  Login</Text>
                </TouchableOpacity>
        </View>
        </View>
    </KeyboardAvoidingView>
    </SafeAreaView>
    </TouchableWithoutFeedback>
)}


const styles = StyleSheet.create({
main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#c0c0c0',
},
container: {
    padding: 15,
    width: '100%',
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
},
welcome: {
    fontSize: 40,
},
input: {
    height: 55,
    width: 300,
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 30,
    margin: 20,
    paddingLeft: 10,
},
btnWrapper: {
    height: 55,
    marginTop: 12,
    backgroundColor: '#3d3d3d',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
    borderRadius: 30,
},
signUpBtn: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 55,
},
signUpBtnText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
},
signUpContainer: {
    position: 'absolute',
    bottom: 20, 
    textAlign: 'center',
    flexDirection: 'row',
},
signUp: {
    color: '#0000FF',
    marginLeft: 10,
},
error: {
    color: 'red',
},
});

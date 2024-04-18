import React, {useState, useEffect, useContext} from 'react';
import {View, Text, TextInput, StyleSheet, 
        ScrollView, Modal, TouchableOpacity,
        TouchableWithoutFeedback, Keyboard, TouchableHighlight } from 'react-native'
import Chat from "./chat";
import ChatPage from "./chatpage";
import UserList from "./userList";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from "@react-navigation/native";
import { auth } from '../firebase/firebase';
import { firebase } from "../firebase/firebase";
import { GlobalContext} from '../../globalContext';

export default function Home({navigation}) {
    const [usernameModalVisible, setUsernameModalVisible] = useState(false);
    const {username, setUsername} = useContext(GlobalContext);
    const {userID, setUserID} = useContext(GlobalContext);
    const [isUsernameSet, setIsUsernameSet] = useState();
    let testUsers =[];
    const [users, setUsers] = useState([]);
    
    const conversationsRef = firebase.firestore().collection("Conversations");

    const usersRef = firebase.firestore().collection("users");

    const HandleUserPress = (user) => { navigation.navigate("Chat Page", { user }); };

    const handleSubmit = () => {
        setIsUsernameSet(true);
       
    }

    const createUser = async () => {
        try {
            await AsyncStorage.setItem('username', username)
            setIsUsernameSet(true);
        } catch (err) {
            alert(err)
        }
        setUsernameModalVisible(false)
    }

    const load = async () => {
        try {
            let username = await AsyncStorage.getItem('username');
        } catch (err) {
            alert(err);
        }
    }

    const signOut = async () => {
        auth
            .signOut()
            .then(() => {
                console.log('Singed Out')
                navigation.navigate("Login")
            })
    }
    const isFocused = useIsFocused();
    useEffect(() => {
	if (isFocused){
        if (username !== null) {
            setUsernameModalVisible(false);
        }
	const pullUsers = async () => {
		const queryA = conversationsRef.where("userA", "==", userID);
		const usersA = await queryA.get();
		const queryB = conversationsRef.where("userB", "==", userID);
		const usersB = await queryB.get();
		if (usersA.size > 0){
			usersA.forEach(async (doc)=>{
				const { userA, userB } = doc.data();
				const { id } = doc;
				const userQuery = usersRef.where("userID", "==", userB);
				const myUser = await userQuery.get();
				if (myUser.size > 0){
					myUser.forEach((doc) => {
						const { username } = doc.data();
						testUsers.push({id: userB,name: username,convoID: id});
					});
				}
				setUsers([...testUsers]);
			});
		} else { console.log("no record"); }
		if (usersB.size > 0) {
			usersB.forEach(async (doc)=>{
				const { userA, userB } = doc.data();
				const { id } = doc;
				const userQuery = usersRef.where("userID", "==", userA);
				const myUser = await userQuery.get();
				if (myUser.size > 0){
					myUser.forEach((doc) => {
						const { username } = doc.data();
						testUsers.push({id: userA,name: username,convoID: id});
					});
				}
				setUsers([...testUsers]);
			});
		}
	};
	pullUsers();
          navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => signOut()}>
                    <Text style={{color: 'white', fontSize: 20}}>Log Out</Text>
                </TouchableOpacity>
            )
        })
	}
   },[isFocused])
    
    return (
        <View style={{backgroundColor: '#c0c0c0', flex: 1}}>
        <TouchableWithoutFeedback onPress={() => {
            Keyboard.dismiss();
        }}><View style={{backgroundColor: '#c0c0c0'}}>
		<View style={ styles.btnWrapper }>
	    		<TouchableHighlight style={ styles.button }
	    			onPress={ () => { navigation.navigate("Find Users"); }}>
	    			<Text style={{ color: "#fff" }}>Find Users</Text>
	    		</TouchableHighlight>
	    	</View>
		<UserList users = { users } style={{ width: "100%" }} onPress={ HandleUserPress }/>
	    	</View>
        </TouchableWithoutFeedback>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
    },
    button: {
	textAlign: 'center',
   	justifyContent: 'center',
   	alignItems: 'center',
	borderRadius: 30,
    	width: '100%',
    	height: 55,
    },
    input: {
        height: 55,
        width: 300,
        borderColor: '#000',
        borderWidth: 2,
        borderRadius: 30,
        margin: 20,
        paddingLeft: 10,
        alignSelf: 'center',
    },
    btnWrapper: {
        height: 55,
        alignSelf: 'center',
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
        width: 350,
        borderRadius: 30,
    },
    setUsernameBtn: {
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 55,
    },
    usernameBtnText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold'
    },
    text: {
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
        marginTop: 100,
        marginBottom: 50,
    }
})

import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, TextInput, TouchableHighlight, ScrollView } from "react-native"
import { firebase } from "../firebase/firebase";
import { GlobalContext } from "../../globalContext";
import UserList from "./userList";

export default function FindUsers({ navigation }){
	//state and context
	const [users, setUsers] = useState([]);
	const [search, setSearch] = useState("");
    	const { userID, setUserID } = useContext(GlobalContext);
	//dbs
	const usersRef = firebase.firestore().collection("users");
	const conversationsRef = firebase.firestore().collection("Conversations");

	//functions
	const Search = async () => {
		const query = usersRef.where("username", ">=", search);
		const res = await query.get();
		if (res.size > 0){
			let tempUsers = [];
			res.forEach(doc => {
				const { username } = doc.data();
				const myID = doc.data().userID;
				const user = { name: username, id: myID };
				if (user.id != userID)
					tempUsers.push(user);
			});
			setUsers(tempUsers);
		}
	}
	
	const UserPressed = async (user) => {
		const queryA = await conversationsRef.where("userA", "==", user.id).where("userB", "==", userID);
		const resA = await queryA.get();
		const queryB = await conversationsRef.where("userB", "==", user.id).where("userA", "==", userID);
		const resB = await queryB.get();
		if (resA.size == 0 && resB.size == 0){
			const convo = await conversationsRef.add({
				userA: userID,
				userB: user.id,
			});
			user.convoID = convo.id;
			console.log(user.convoID);
		} else if (resA.size > 0){
			resA.forEach(doc => {
				const { id } = doc;
				user.convoID = id;
			});
		} else if (resB.size > 0){
			resB.forEach(doc => {
				const { id } = doc;
				user.convoID = id;
			});
		}
		console.log(user.convoID);
		navigation.replace("Chat Page", { user });
	}

	useEffect(() => {
		if (search.length > 0)
		Search();
		
	}, [search])

	//jsx
	return (
		<View style={{ flex: 1, backgroundColor: '#c0c0c0'}}>
			<View style={ styles.inputWrapper }>
				<TextInput style={ styles.input }
					placeholder="Search User"
					onChangeText={ val => setSearch(val) }/>
				{/* <TouchableHighlight style={ styles.button }
					onPress={ () => Search() }>
					<Text style={{ color: "#fff" }}>Search</Text>
				</TouchableHighlight> */}
			</View>
			<UserList users={ users } onPress={ UserPressed }/>
		</View>
	);
}
//styles
const styles = StyleSheet.create({
inputWrapper: {
	flexDirection: "row",
	alignItems: "center"
},
input: {
    height: 55,
    width: '90%',
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 30,
    paddingLeft: 10,
    margin: 20,
    marginRight: 10
},
button: {
	backgroundColor: "#00aeef",
	borderRadius: 15,
	padding: 15,
	paddingLeft: 20,
	paddingRight: 20
}
});

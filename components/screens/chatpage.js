import React, { useState, useEffect, useContext, useRef } from "react";
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableHighlight, TouchableWithoutFeedback, FlatList, Image, KeyboardAvoidingView, Keyboard, SafeAreaView, Platform} from "react-native";
import { GlobalContext } from "../../globalContext";
import { firebase, hooks } from "../firebase/firebase";
import { ref, uploadBytes, getStorage } from "firebase/storage";
import { AntDesign, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";


export default function ChatPage({navigation,route}){
	const [message, setMessage] = useState();
	const [messages, setMessages] = useState()
	const { user } = route.params;
	const {convoID } = user;
	const { userID, setUserID } = useContext(GlobalContext);
	const [fileUri, setFileUri] = useState("");

	const flatListRef = useRef(null);

	const sendMessage = async () => {

		console.log(user)
		console.log(convoID)
		console.log(userID)
		console.log(message)
		
		try {
			const messagesRef = firebase.firestore().collection("Messages");
			const newDocumentRef = await messagesRef.add({
				convoID: convoID,
				sender: userID,
				message: message,
				createdAt: firebase.firestore.FieldValue.serverTimestamp()
			});
			console.log('New document added with ID:', newDocumentRef.id);
		} catch (error) {
			console.log(error);
			}
			setMessage('')

	}

	useEffect(() => {
		const messagesRef = firebase.firestore().collection("Messages");
		const query = messagesRef.where("convoID", "==", convoID).orderBy("createdAt");
		query.onSnapshot(querySnapshot => {
			const tempMessages = [];
			querySnapshot.forEach(doc =>{
				const { message, sender, createdAt } = doc.data();
				tempMessages.push({message: message, sender: sender, createdAt: createdAt, id: doc.id});
			})
			setMessages(tempMessages);
		})
    }, []);

	useEffect(() => {

		navigation.setOptions({ title: "Chatting With "+user.name });
	},[user,navigation]);

	

	const data = messages 

	const ScrollToBottom = () => {
		if (data && data.length > 0) {
			flatListRef.current.scrollToEnd();
		}
	};

	const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

	async function AddFile() {
		try {
			MediaLibrary.requestPermissionsAsync()
			if (permissionResponse.granted);
			{
				const storage = getStorage();
				const result = await DocumentPicker.getDocumentAsync();
				console.log(result);
				const file = await fetch(result.uri);
				const storageRef = ref(storage, "test.png");
				const blob = await file.blob();
				const fileName = result.name;
				//throw Error("l");
				await uploadBytes(storageRef, blob);
			}
		} catch(error) {
			console.log(error);
		}
	}


	return (
	
	
		
		
		<SafeAreaView style={styles.container}>
	
		<View style={{marginBottom: 100, flex: 1}}>
			<FlatList
				ref={flatListRef}
				data = { data }
				renderItem = {({ item }) => (
					<View style={ item.sender == userID ? styles.itemMe : styles.item }>
							{ item.sender != userID ? <Image 
							source={{ width:40,height:40,uri:"https://picsum.photos/50"}} style={ styles.picture }/>
							: null }
								<Text style={{color: 'white', fontSize: '20%'}}>{ item.message }</Text>
					</View>
				)}
				keyExtractor={(item) => item.id}
				onContentSizeChange={() => ScrollToBottom()}
				// contentContainerStyle={{ paddingBottom: 100}}
			/>
			</View>
				<KeyboardAvoidingView 
					behavior={Platform.OS === 'ios' ? 'position' : 'height'}
					keyboardVerticalOffset={60}
				>
					<View style={ styles.inputWrapper }>
		{/*<View style={styles.addFileBtn}>
							<Ionicons
								name='document-attach'
								size={40}
								color='#3d3d3d'
								onPress={() => {AddFile()}}
							/>
						</View>*/}
							<TextInput
								style={ styles.input }
								onChangeText={(val) => setMessage(val)}
								clearButtonMode='always'
								value={message}
								selectionColor='white'
								

							/>
							<MaterialCommunityIcons
								name='send-circle'
								color='#3d3d3d'
								size= '60%'
								onPress={() => 
									{sendMessage()
									Keyboard.dismiss()}
								}
							/>
							
					</View>
				</KeyboardAvoidingView>
	
					
		</SafeAreaView>	
			
	);
}

const styles = StyleSheet.create({
container: {
	flex: 1,
	backgroundColor: '#c0c0c0',
},
inputWrapper: {
	position: "absolute",
	flexDirection: "row",
	bottom: 0,
	left: 0,
	right: 0,
	padding: 10,
	alignItems: "center",
	justifyContent: "center",
	backgroundColor: "#c0c0c0"
},
input: {
    height: 55,
    width: '65%',
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 30,
    paddingLeft: 10,
    margin: 0,
    marginRight: 10,
	marginLeft: 10,
	color: '#fff',
	backgroundColor: "#3d3d3d",
	fontSize: '20%'
},
button: {
	backgroundColor: "#00aeef",
	width: '20%',
	borderRadius: 15,
	padding: 15,
	paddingLeft: 20,
	paddingRight: 20
},
item: {
	padding: 5,
	margin: 5,
	marginLeft: 10,
	marginRight: 100,
	flexDirection: "row",
	alignItems: "center",
	alignSelf: "start",
	backgroundColor: "#476a6f",
	borderRadius: 20,
},
itemMe: {
	padding: 10,
	margin: 5,
	marginLeft: 100,
	marginRight: 10,
	flexDirection: "row",
	alignItems: "center",
	alignSelf: "flex-end",
	justifyContent: "right",
	backgroundColor: "#7eb09b",
	borderRadius: 20,
},
picture: {
	marginRight: 10,
	borderRadius: 50
},
center: {
	alignItems: "center",
	justifyContent: "center"
}
});

import React , {useState, useEffect} from "react";
import { ScrollView,View,Text} from 'react-native';
import { List, 
    Avatar,
    Divider,
    FAB,Portal,
    Dialog,Button,
    TextInput
} from "react-native-paper";
import {Ionicons} from '@expo/vector-icons'
import { getFirestore, collection, addDoc, query, where,getDocs} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { onSnapshot } from 'firebase/firestore';
import { AppColors } from "../config/constans";
import { colors } from "../config/theme";

const ChatList = () => {

  const [isDialogVisible, setIsDialogVisible]= useState(false);
  const [email, setEmail]= useState("");
  const [userEmail, setUserEmail]= useState("");

  const theme = {mode:"dark"}
  let activeColors = colors[theme.mode];

  useEffect(() => {
        getAuth().onAuthStateChanged(user => {
        setEmail(user?.email ?? "");
        });
  }, []);

  const[isLoading,setIsLoading]=useState(false);

  const navigation = useNavigation();


  const createChat = async () => {
    if (!email || !userEmail) return;
    setIsLoading(true);
    const db = getFirestore();
  
    const chatQuerySnapshot = await getDocs(
      query(collection(db, "chats"), where('users', '==', [email, userEmail]))
    );
  
    if (!chatQuerySnapshot.empty) {
      setIsLoading(false);
      navigation.navigate("Chat", { chatId: chatQuerySnapshot.docs[0].id });
      setIsDialogVisible(false);
    } else {
      const response = await addDoc(collection(db, "chats"), {
        users: [email, userEmail],
      });
      setIsLoading(false);
      setIsDialogVisible(false);
      navigation.navigate("Chat", { chatId: response.id });
    }
  };

  const [chats, setChats] = useState([]);
  const db = getFirestore();
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "chats"), where('users', 'array-contains', email)),
      (querySnapshot) => {
        setChats(querySnapshot.docs);
      }
    );
    return unsubscribe;
  }, [email, db]);
  

  return(
<View intensity={100} tint="dark" style={{flex:1}}>
<ScrollView style={{flex:1,backgroundColor:activeColors.primary}}>
{chats.map((chat) => (
        <React.Fragment  >
          <List.Item
            key={chat.id}
            title={chat.data().users.find((x) => x !== email)}
            description={(chat.data().messages ?? [])[0]?.text ?? undefined}
            titleStyle={{ color: activeColors.tint ,fontWeight:"bold",fontSize:18, }}
            descriptionStyle={{ color: activeColors.text ,fontSize:14, marginTop:8}}
            left={() => (
              <Avatar.Text
                style={{marginLeft:16,fontWeight:"bold",}}
                label={chat
                  .data()
                  .users.find((x) => x !== email)
                  .split(" ")
                  .reduce((prev, current) => prev + current[0], "")}
                size={66}
              />
            )}
            onPress={() => navigation.navigate("Chat", { chatId: chat.id })}
          />
          <Divider leftInset/>
        </React.Fragment>
      ))}
 </ScrollView>
 <Portal>
            <Dialog visible={isDialogVisible} 
            onDismiss={()=> setIsDialogVisible(false)}
            style={{backgroundColor:activeColors.secondary}}>
                <Dialog.Title style={{color:activeColors.tint}}>New Chat</Dialog.Title>
                <Dialog.Content>
                    <TextInput 
                    label="Enter User E-mail"
                    value={userEmail}
                    onChangeText={(text => setUserEmail(text))}
                    keyboardType="email-address"
                    style={{color:activeColors.tint}}
                    />
                </Dialog.Content>
                <Dialog.Actions >
                    <Button 
                    onPress={()=> setIsDialogVisible(false)}
                    style={{backgroundColor:activeColors.tertiary}}>Cancel</Button>
                    <Button 
                    onPress={() => createChat()} 
                    loading={isLoading}
                    style={{backgroundColor:activeColors.tertiary}}
                    >Save</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>

        <FAB 
        icon="heart"
        style={{position:'absolute', bottom:16, right:16}}
        onPress = {() => setIsDialogVisible(true)}
        />
 </View>
);
};

export default ChatList;

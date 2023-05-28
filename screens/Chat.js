import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { useRoute } from "@react-navigation/native";
import { collection, doc, getFirestore, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { GiftedChat, InputToolbar, Avatar } from "react-native-gifted-chat";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { colors } from "../config/theme";

const Chat = () => {
  const route = useRoute();
  const [messages, setMessages] = useState([]);
  const [uid, setUID] = useState("");
  const [name, setName] = useState("");
  const [otherUserName, setOtherUserName] = useState("");

  useEffect(() => {
    return getAuth().onAuthStateChanged((user) => {
      if (user) {
        setUID(user.uid);
        setName(user.displayName);
      }
    });
  }, []);

  useEffect(() => {
    const docRef = doc(collection(getFirestore(), "chats"), route.params.chatId);
    const unsubscribe = onSnapshot(docRef, (doc) => {
      setMessages(doc.data()?.messages ?? []);
      setOtherUserName(doc.data()?.otherUser?.name ?? "");
    });
    return unsubscribe;
  }, [route.params.chatId]);

  const onSend = (m = []) => {
    const chatRef = doc(collection(getFirestore(), "chats"), route.params.chatId);
    setDoc(
      chatRef,
      {
        messages: GiftedChat.append(messages, m),
      },
      { merge: true }
    );
  };

  const theme = { mode: "dark" };
  let activeColors = colors[theme.mode];

  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{ backgroundColor: activeColors.tertiary }}
        placeholder="Send a message..."
        placeholderTextColor={activeColors.text}
      />
    );
  };

  const renderAvatar = (props) => {
    const { currentMessage } = props;
    if (currentMessage.user._id === uid) {
      // render the current user's avatar as normal
      return <Avatar {...props} />;
    } else {
      // render the other user's avatar with their name above it
      return (
        <View style={{ marginRight: 10 }}>
          <Text style={{ fontSize: 12 }}>{otherUserName}</Text>
          <Avatar {...props} />
        </View>
      );
    }
  };
  
  return (
    <View style={{ flex: 1, backgroundColor: activeColors.primary }}>
      <GiftedChat
        messages={messages.map((x) => ({
          ...x,
          createdAt: x.createdAt?.toDate(),
        }))}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: uid,
          name: name,
        }}
        renderInputToolbar={renderInputToolbar}
        placeholderTextColor={activeColors.text}
        textInputStyle={{ color: activeColors.tint }}
        placeholder="Send a message..."
        renderAvatar={renderAvatar}
      />
    </View>
  );
};

export default Chat;

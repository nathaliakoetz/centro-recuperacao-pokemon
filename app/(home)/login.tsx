import { router } from "expo-router";
import { useState } from "react";
import { Button, Dimensions, Image, StyleSheet, Text, TextInput, View } from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const styles = StyleSheet.create({
    input: {
      width: 300,
      height: 40,
      borderColor: "gray",
      borderWidth: 1,
      marginBottom: 10,
      paddingLeft: 10,
    },
    image: {
      width: 200,
      height: 200,
      resizeMode: 'stretch',
      marginBottom: 50,
    },
  });

  const submit = () => {
    console.log(email);
    console.log(whatsapp);
    // Enviar dados via API
    // Se tudo der certo, redirecionar para a página inicial
    router.push({pathname: "/(form)/form1", params: {email, whatsapp}});  
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image source={require('../../assets/images/login-icon.png')} style={styles.image}></Image>
      <TextInput
        onChangeText={setEmail}
        value={email}
        placeholder="Seu E-mail"
        keyboardType="email-address"
        style={styles.input}
      ></TextInput>
      <TextInput
        onChangeText={setWhatsapp}
        value={whatsapp}
        placeholder="Seu Whatsapp"
        keyboardType="phone-pad"
        style={styles.input}
      ></TextInput>
      <Button title="Entrar" onPress={submit}></Button>
    </View>
  );
}

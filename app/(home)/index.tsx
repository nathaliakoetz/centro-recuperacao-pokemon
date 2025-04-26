import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Página inicial!!</Text>
      <Text>Nesta página vamos verificar se existe ou não dados do usuário</Text>
      <Text>Caso já exista, ele será direcionado para a Página Inicial</Text>
      <Text>Caso não exista, ele será direcionado para a Página de Login</Text>
      <Link href={"/login"}>Ir para o login/cadastro</Link>
      <Link href={"/(form)/form1"}>Ir para o início</Link>
    </View>
  );
}

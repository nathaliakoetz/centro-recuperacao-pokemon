import { View, Text, StyleSheet } from "react-native";

export default function Consultas() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Consultas em Andamento</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

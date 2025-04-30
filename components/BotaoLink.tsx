// components/BotaoLink.tsx
import { Text, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { ReactNode } from "react";

export default function BotaoLink({ href, children }: { href: any; children: ReactNode }) {
  return (
    <Link href={href} style={styles.botao}>
      <Text style={styles.texto}>{children}</Text>
    </Link>
  );
}

const styles = StyleSheet.create({
  botao: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  texto: {
    color: "#e63946",
    fontFamily: "PressStart2P_400Regular",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
});
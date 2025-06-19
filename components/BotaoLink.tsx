// components/BotaoLink.tsx
import { Text, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { ReactNode } from "react";
import { cores } from "../styles/estilosGlobais";

export default function BotaoLink({ href, children }: { href: any; children: ReactNode }) {
  return (
    <Link href={href} style={styles.botao}>
      <Text style={styles.texto}>{children}</Text>
    </Link>
  );
}

const styles = StyleSheet.create({
  botao: {
    backgroundColor: cores.vermelho, // Usando a cor de destaque vermelha
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5, // Efeito de sombra
  },
  texto: {
    color: cores.branco, // Texto branco para destacar
    fontFamily: "Roboto",
    fontSize: 16, // Tamanho de fonte ajustado
    fontWeight: "bold",
    textAlign: "center",
  },
});
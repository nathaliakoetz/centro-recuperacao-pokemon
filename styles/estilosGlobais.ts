import { StyleSheet } from "react-native";

export const cores = {
  fundoEscuro: "rgba(0,0,0,0.5)",
  vermelho: "#e63946",
  branco: "#fff",
};

export const estilosGlobais = StyleSheet.create({
  containerCentralizado: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  fundoComOverlay: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: cores.fundoEscuro,
  },
  titulo: {
    fontFamily: "PressStart2P_400Regular",
    fontSize: 28,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  botaoBase: {
    backgroundColor: cores.branco,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  textoBotao: {
    color: cores.vermelho,
    fontFamily: "PressStart2P_400Regular",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
});

import { StyleSheet } from "react-native";

export const cores = {
  // Cores Base do Tema Escuro
  fundoEscuro: "#1c1c1e",
  fundoSuperficie: "#2c2c2e",
  branco: "#FFFFFF",

  // Cores de Texto
  textoClaro: "#F5F5F7",
  textoSecundario: "#A9A9A9",
  
  // Cores de Ação e Semânticas (Baseadas no Novo Logo)
  primaria: "#dc533e",         // O vermelho-coral 
  secundaria: "#F8B8C2",       // O rosa-pêssego do corpo da Chansey
  acento: "#FDF5E6",           // O creme do ovo da Chansey
  
  sucesso: "#2a9d8f",           
  aviso: "#fca311",             
  erro: "#e63946",             
  
  neutra: "#bdc3c7",
};

export const espacamento = {
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
  xxl: 32,
};

export const tipografia = {
  familia: "ChauPhilomeneOne_400Regular",
  tamanhos: {
    titulo: 28,
    subtitulo: 22,
    corpo: 18,
    label: 16,
    pequeno: 12,
  },
  pesos: {
    regular: "400" as const,
    semiBold: "600" as const,
    bold: "700" as const,
  },
};

export const bordas = {
  raioPequeno: 8,
  raioMedio: 12,
  raioGrande: 16,
};

export const sombras = {
  sombraMedia: {
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
};

export const estilosGlobais = StyleSheet.create({
  containerCentralizado: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: espacamento.xl,
    backgroundColor: cores.fundoEscuro,
  },
  fundoComOverlay: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: cores.fundoEscuro,
  },
  titulo: {
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.titulo,
    fontWeight: tipografia.pesos.bold,
    color: cores.textoClaro,
    textAlign: "center",
    marginBottom: espacamento.xl,
  },
  textoSecundario: {
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.label,
    color: cores.textoSecundario,
    marginBottom: espacamento.xs,
  },
  textoNormal: {
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.corpo,
    color: cores.textoClaro,
    marginBottom: espacamento.s,
  },
  label: {
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.label,
    color: cores.textoClaro,
    marginBottom: espacamento.s,
  },
  linkTopo: {
    color: cores.textoClaro,
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.label,
    textDecorationLine: "underline",
  },
  campoTexto: {
    backgroundColor: cores.fundoSuperficie,
    borderRadius: bordas.raioPequeno,
    padding: espacamento.m,
    fontSize: tipografia.tamanhos.label,
    color: cores.textoClaro,
    borderWidth: 1,
    borderColor: cores.neutra,
    marginBottom: espacamento.l,
  },
  campoMultilinha: {
    backgroundColor: cores.fundoSuperficie,
    borderRadius: bordas.raioPequeno,
    padding: espacamento.m,
    height: 120,
    textAlignVertical: "top",
    fontSize: tipografia.tamanhos.label,
    color: cores.textoClaro,
    borderWidth: 1,
    borderColor: cores.neutra,
    marginBottom: espacamento.l,
  },
  botaoBase: {
    backgroundColor: cores.primaria,
    paddingVertical: espacamento.l - 2,
    paddingHorizontal: espacamento.xl,
    borderRadius: bordas.raioMedio,
    alignItems: "center",
    ...sombras.sombraMedia,
  },
  botaoSecundario: {
    backgroundColor: cores.fundoSuperficie,
    paddingVertical: espacamento.l - 2,
    paddingHorizontal: espacamento.xl,
    borderRadius: bordas.raioMedio,
    alignItems: "center",
    ...sombras.sombraMedia,
    borderWidth: 1,
    borderColor: cores.primaria,
  },
  textoBotao: {
    color: cores.branco,
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.corpo,
    fontWeight: tipografia.pesos.bold,
    textAlign: "center",
  },
  caixaImagem: {
    width: 180,
    height: 180,
    borderWidth: 2,
    borderColor: cores.neutra,
    borderRadius: bordas.raioGrande,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: cores.fundoSuperficie,
    marginTop: espacamento.xl,
    alignSelf: "center",
  },
  imagemPokemon: {
    width: 140,
    height: 140,
    borderRadius: bordas.raioMedio,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: espacamento.l,
    marginBottom: espacamento.xl,
    backgroundColor: cores.fundoSuperficie,
    paddingVertical: espacamento.m,
    borderRadius: bordas.raioPequeno,
  },
  voltarTexto: {
    color: cores.textoClaro,
    fontFamily: tipografia.familia,
    fontSize: 18,
    fontWeight: tipografia.pesos.semiBold,
  },
  modalFundo: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalConteudo: {
    backgroundColor: cores.fundoSuperficie,
    padding: espacamento.xl,
    borderRadius: bordas.raioGrande,
    width: "80%",
    maxWidth: 400,
    alignItems: "center",
    borderWidth: 1,
    borderColor: cores.neutra,
  },
  modalTitulo: {
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.corpo,
    fontWeight: tipografia.pesos.bold,
    color: cores.primaria,
    marginBottom: espacamento.m,
  },
  modalTexto: {
    fontSize: tipografia.tamanhos.corpo,
    fontFamily: tipografia.familia,
    color: cores.textoClaro,
    textAlign: "center",
    marginBottom: espacamento.m,
  },
  modalBotaoFechar: {
    backgroundColor: cores.primaria,
    paddingVertical: espacamento.m,
    paddingHorizontal: espacamento.xl,
    borderRadius: bordas.raioMedio,
    marginTop: espacamento.m,
  },
  textoFecharModal: {
    color: cores.branco,
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.label,
    textAlign: "center",
  },
});
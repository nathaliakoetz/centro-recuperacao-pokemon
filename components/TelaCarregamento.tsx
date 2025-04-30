import { View, ActivityIndicator, ImageBackground, StyleSheet } from "react-native";
import { estilosGlobais } from "../styles/estilosGlobais";

export default function TelaCarregamento() {
  return (
    <ImageBackground
      source={require("../assets/fundo.jpg")}
      style={StyleSheet.absoluteFill}
      resizeMode="cover"
    >
      <View style={estilosGlobais.fundoComOverlay}>
        <View style={estilosGlobais.containerCentralizado}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </View>
    </ImageBackground>
  );
}

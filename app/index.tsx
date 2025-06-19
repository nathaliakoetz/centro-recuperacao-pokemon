import { Text, View, StyleSheet, Image } from "react-native";
import BotaoLink from "../components/BotaoLink";
import { estilosGlobais, espacamento } from "../styles/estilosGlobais";

export default function Home() {
  return (
    <View style={estilosGlobais.containerCentralizado}>
      <View style={styles.tituloContainer}>
        <Image
          source={require('../assets/icon-b.png')}
          style={styles.logo}
        />
        <Text style={[estilosGlobais.titulo, styles.tituloCustomizado]}>
          Centro de Recuperação Pokémon
        </Text>
      </View>

      <View style={styles.botoesContainer}>
        <BotaoLink href="/login" tipo="primario">
          ÁREA CADASTRO
        </BotaoLink>
        <BotaoLink href="/loginMedico" tipo="primario">
          ÁREA MÉDICA
        </BotaoLink>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tituloContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: espacamento.s,
  },
  logo: {
    width: 460,  
    height: 460,
    marginBottom: espacamento.xs, 
  },
  tituloCustomizado: {
    fontSize: 50,
    marginBottom: 0,
    textAlign: 'center',
  },
  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: espacamento.l,
  },
});
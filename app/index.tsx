import { View, StyleSheet, Image, Text } from 'react-native';
import BotaoLink from '../components/BotaoLink';
import {
  estilosGlobais,
  espacamento,
  cores,
  tipografia,
  bordas,
  sombras
} from '../styles/estilosGlobais';

export default function Home() {
  return (
    <View style={estilosGlobais.containerCentralizado}>
      <View style={styles.cardPrincipal}>

        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
        />

        <Text style={styles.titulo}>
          BEM-VINDO AO CENTRO DE RECUPERAÇÃO POKÉMON
        </Text>

        <Text style={styles.subtitulo}>
          Escolha seu tipo de acesso para continuar.
        </Text>

        <View style={styles.botoesContainer}>
          <BotaoLink href="/cadastrar-usuario" tipo="secundario" style={styles.botaoCustomizado}>
            CADASTRAR NOVO USUÁRIO
          </BotaoLink>
          <BotaoLink href="/login" style={styles.botaoCustomizado}>
            ÁREA CADASTRO
          </BotaoLink>
          <BotaoLink href="/loginMedico" style={styles.botaoCustomizado}>
            ÁREA MÉDICA
          </BotaoLink>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardPrincipal: {
    backgroundColor: cores.fundoSuperficie,
    borderRadius: bordas.raioGrande,
    padding: espacamento.xxl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 850,
    ...sombras.sombraMedia,
  },
  logo: {
    width: 320,
    height: 320,
    resizeMode: 'contain',
    marginBottom: espacamento.m,
  },
  titulo: {
    fontFamily: tipografia.familia,
    fontSize: 36,
    color: cores.textoClaro,
    textAlign: 'center',
    marginBottom: espacamento.xs,
  },
  subtitulo: {
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.corpo,
    color: cores.textoSecundario,
    textAlign: 'center',
    marginBottom: espacamento.xxl,
  },
  botoesContainer: {
    flexDirection: 'row',
    gap: espacamento.l,
  },
  botaoCustomizado: {
    paddingVertical: espacamento.m,
    paddingHorizontal: espacamento.xl,
  },
});
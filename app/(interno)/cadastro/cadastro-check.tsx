import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import {
  estilosGlobais,
  cores,
  espacamento,
  bordas,
  sombras,
  tipografia,
} from '../../../styles/estilosGlobais';
import BotaoAcao from '../../../components/BotaoAcao';

export default function CadastroCheck() {
  const router = useRouter();

  return (
    <View style={estilosGlobais.containerCentralizado}>
      <View style={styles.cardPrincipal}>
        
        <TouchableOpacity 
          style={styles.voltarContainer} 
          onPress={() => router.back()}
        >
          <Image
            source={require('../../../assets/voltar.png')}
            style={styles.voltarIcon}
          />
        </TouchableOpacity>

        <Image
          source={require('../../../assets/check.png')}
          style={styles.imagemPrincipal}
        />

        <Text style={styles.titulo}>
          O Pokémon já possui cadastro?
        </Text>

        <View style={styles.botoesContainer}>
          <BotaoAcao
            onPress={() => router.push('/(interno)/cadastro/buscar-id')}
            style={styles.botaoCustomizado}
            tipo="primario"
          >
            Sim
          </BotaoAcao>
          
          <BotaoAcao
            onPress={() => router.push('/(interno)/cadastro/cadastro')}
            style={styles.botaoCustomizado}
            tipo="secundario"
          >
            Não
          </BotaoAcao>
        </View>
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardPrincipal: {
    backgroundColor: cores.fundoSuperficie,
    borderRadius: bordas.raioGrande,
    padding: espacamento.xl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 550,
    ...sombras.sombraMedia,
  },
  voltarContainer: {
    alignSelf: 'flex-start',
    marginBottom: espacamento.m,
  },
  voltarIcon: {
    width: 30,
    height: 30,
    tintColor: cores.textoSecundario,
  },
  imagemPrincipal: {
    width: 220,
    height: 220,
    resizeMode: 'contain',
    marginBottom: espacamento.l,
  },
  titulo: {
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.subtitulo,
    color: cores.textoClaro,
    textAlign: 'center',
    marginBottom: espacamento.xxl,
  },
  botoesContainer: {
    flexDirection: 'row',
    gap: espacamento.l,
    width: '100%',
    justifyContent: 'center',
  },
  botaoCustomizado: {
    flex: 1,
    paddingVertical: espacamento.m,
  },
});
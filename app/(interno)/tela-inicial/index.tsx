import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { estilosGlobais, tipografia, espacamento, cores } from '../../../styles/estilosGlobais';
import CardOpcao from '../../../components/CardOpcao';

export default function AreaInterna() {
  const { usuario } = useLocalSearchParams();
  const router = useRouter();
  const [dataHora, setDataHora] = useState("");

  useEffect(() => {
    const formatarDataHora = () => {
      const agora = new Date();
      const opcoesData = { day: 'numeric', month: 'long', year: 'numeric' } as const;
      const dataFormatada = agora.toLocaleDateString('pt-BR', opcoesData);
      const horaFormatada = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      setDataHora(`${dataFormatada} - ${horaFormatada}`);
    };
    formatarDataHora();
    const intervalId = setInterval(formatarDataHora, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const opcoes = [
    { titulo: 'AGUARDANDO CONSULTA', rota: '/(interno)/consulta/espera', tipo: 'primario' as const },
    { titulo: 'AGENDAR CONSULTA', rota: '/(interno)/cadastro/cadastro-check', tipo: 'primario' as const },
    { titulo: 'URGENTE', rota: '/(interno)/cadastro/urgente', tipo: 'urgente' as const },
  ];

  const handleLogout = () => {
    router.replace('/'); 
  };

  return (
    <View style={estilosGlobais.containerCentralizado}>
      <View style={styles.header}>
        <View style={styles.infoUsuarioContainer}>
          <Text style={styles.bemVindoTexto}>
            Bem-vindo, {usuario}!
          </Text>
          <Text style={styles.dataHoraTexto}>
            {dataHora}
          </Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Image source={require('../../../assets/sair.png')} style={styles.logoutIcon} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.cardsContainer}>
          {opcoes.map((item) => (
            <CardOpcao
              key={item.rota}
              onPress={() => router.push(item.rota as any)}
              tipo={item.tipo}
            >
              {item.titulo}
            </CardOpcao>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    width: '100%',
    maxWidth: 800,
    alignItems: 'center',
    paddingTop: 100,
  },
  header: {
    width: '100%',
    maxWidth: 800,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    top: espacamento.xxl,
    paddingHorizontal: espacamento.s,
  },
  infoUsuarioContainer: {
    flexDirection: 'column',
  },
  bemVindoTexto: {
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.subtitulo,
    fontWeight: tipografia.pesos.semiBold,
    color: cores.textoClaro,
  },
  dataHoraTexto: {
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.label,
    color: cores.textoSecundario,
  },
  logoutIcon: {
    width: 30,
    height: 30,
    tintColor: cores.textoSecundario,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: espacamento.xl,
    width: '100%',
  },
});
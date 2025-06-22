import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';
import { useState, useEffect } from 'react';
import {
  estilosGlobais,
  tipografia,
  espacamento,
  cores,
  bordas,
  sombras,
} from '../../../styles/estilosGlobais';
import CardOpcao from '../../../components/CardOpcao';

export default function Medico() {
  const router = useRouter();
  const { usuario, logout } = useAuth();
  const [dataHora, setDataHora] = useState('');

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
    { titulo: 'Pacientes em Espera', rota: '/(interno)/consulta/espera', tipo: 'primario' as const },
    { titulo: 'Consultas em Andamento', rota: '/(interno)/consulta/emConsulta', tipo: 'primario' as const },
    { titulo: 'Pacientes na Internação', rota: '/(interno)/consulta/internacao', tipo: 'urgente' as const },
  ];

  return (
    <View style={estilosGlobais.containerCentralizado}>
      <View style={styles.cardPrincipal}>
        <View style={styles.header}>
          <Text style={styles.bemVindoTexto}>Dr(a). {usuario}!</Text>
          <TouchableOpacity onPress={logout}>
            <Image
              source={require('../../../assets/sair.png')}
              style={styles.logoutIcon}
            />
          </TouchableOpacity>
        </View>

        <Image
          source={require('../../../assets/medico.png')}
          style={styles.imagemPrincipal}
        />

        <Text style={styles.titulo}>Painel Médico</Text>
        <Text style={styles.dataHoraTexto}>{dataHora}</Text>

        <View style={styles.opcoesContainer}>
          {opcoes.map((item) => (
            <CardOpcao
              key={item.rota}
              onPress={() => router.push(item.rota as any)}
              tipo={item.tipo}
              style={styles.botaoOpcao}
            >
              {item.titulo}
            </CardOpcao>
          ))}
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
    maxWidth: 500,
    ...sombras.sombraMedia,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: espacamento.m,
  },
  bemVindoTexto: {
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.subtitulo,
    color: cores.textoClaro,
    fontWeight: tipografia.pesos.semiBold,
  },
  logoutIcon: {
    width: 24,
    height: 24,
    tintColor: cores.textoSecundario,
  },
  imagemPrincipal: {
    width: 220,
    height: 220,
    resizeMode: 'contain',
    marginBottom: espacamento.s,
  },
  titulo: {
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.titulo,
    color: cores.textoClaro,
    textAlign: 'center',
  },
  dataHoraTexto: {
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.label,
    color: cores.textoSecundario,
    marginBottom: espacamento.xl,
  },
  opcoesContainer: {
    width: '100%',
    alignItems: 'center',
  },
  botaoOpcao: {
    flex: 0,
    width: '100%',
    minHeight: 0,
    paddingVertical: espacamento.l,
    marginBottom: espacamento.l,
  },
});
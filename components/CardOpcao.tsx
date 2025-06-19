import { Text, StyleSheet, Pressable, PressableProps, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { ReactNode } from 'react';
import { estilosGlobais, cores, tipografia, espacamento, bordas, sombras } from '../styles/estilosGlobais';

interface CardOpcaoProps extends PressableProps {
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
    tipo?: 'primario' | 'urgente';
}

export default function CardOpcao({ children, style, tipo = 'primario', ...rest }: CardOpcaoProps) {
    const cardStyle = [styles.card, style];
    const textoStyle: StyleProp<TextStyle> = [styles.cardTexto];

    if (tipo === 'urgente') {
        cardStyle.push(styles.cardUrgente);
        textoStyle.push(styles.textoUrgente);
    }

    return (
        <Pressable 
            style={({ pressed }) => [cardStyle, pressed && { opacity: 0.8 }]} 
            {...rest}
        >
            <Text style={textoStyle}>{children}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: cores.fundoSuperficie,
        borderRadius: bordas.raioMedio,
        padding: espacamento.l,
        flex: 1,
        maxWidth: 400,
        minHeight: 150,
        alignItems: 'center',
        justifyContent: 'center',
        ...sombras.sombraMedia,
        borderWidth: 1,
        borderColor: cores.neutra,
    },
    cardUrgente: {
        backgroundColor: cores.erro,
        borderColor: cores.erro,
    },
    cardTexto: {
        fontFamily: tipografia.familia,
        fontSize: 20,
        fontWeight: tipografia.pesos.semiBold,
        color: cores.textoClaro,
        textAlign: 'center',
    },
    textoUrgente: {
        color: cores.branco,
        fontWeight: tipografia.pesos.bold,
    },
});
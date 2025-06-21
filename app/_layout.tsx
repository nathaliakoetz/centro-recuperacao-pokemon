import { Stack, SplashScreen } from "expo-router";
import { useFonts, ChauPhilomeneOne_400Regular } from '@expo-google-fonts/chau-philomene-one';
import { useEffect } from "react";

// Impede que a tela de splash suma antes da hora
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Carrega a nova fonte para o projeto
  const [fontsLoaded, fontError] = useFonts({
    ChauPhilomeneOne_400Regular,
  });

  useEffect(() => {
    // Esconde a tela de splash assim que a fonte for carregada (ou der erro)
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Enquanto a fonte não for carregada, não exibe nada (a tela de splash continua visível)
  if (!fontsLoaded && !fontError) {
    return null;
  }

  // Com a fonte carregada, exibe o aplicativo
  return <Stack screenOptions={{headerShown: false}}/>;
}
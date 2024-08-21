// src/app/_app.tsx
import 'primereact/resources/themes/saga-blue/theme.css'; // Tema de PrimeReact
import 'primereact/resources/primereact.min.css'; // Estilos de PrimeReact
import 'primeicons/primeicons.css'; // Iconos de PrimeReact
import './globals.css'; // Tus estilos globales
import type { AppProps } from 'next/app'; // Importar AppProps

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

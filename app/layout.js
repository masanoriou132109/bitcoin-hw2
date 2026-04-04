import './globals.css';

export const metadata = {
  title: 'Robo-Advisor | DAT.co Insights',
  description: 'Visualizing and analyzing MicroStrategy (MSTR) Premium to NAV to assist trading decisions.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

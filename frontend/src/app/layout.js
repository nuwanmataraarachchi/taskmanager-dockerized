export const metadata = {
  title: "Task Manager",
  description: "Simple Next.js Task Manager App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f9f9f9",
          color: "#333",
        }}
      >
        {children}
      </body>
    </html>
  );
}

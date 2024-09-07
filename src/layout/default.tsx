function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="p-2 flex justify-center items-center flex-col">
      <div className="my-4" />
      {children}
    </main>
  );
}

export default DefaultLayout;
